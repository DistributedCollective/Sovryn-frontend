import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

type GraphQLEndpoint = { graph: string; index?: string; isFallback?: boolean };

const metaQuery = `{
  _meta{
    block {
      hash
    }
    deployment
    hasIndexingErrors
  }
}`;

const statusQuery = deployment => `{
  indexingStatuses(subgraphs: [${JSON.stringify(deployment)}]) {
    subgraph
    synced
    health
    entityCount
    fatalError {
      handler
      message
      deterministic
    }
    chains {
      chainHeadBlock {
        number
      }
      earliestBlock {
        number
      }
      latestBlock {
        number
      }
    }
  }
}`;

const createClient = (endpoint: GraphQLEndpoint) =>
  new ApolloClient({
    uri: endpoint.graph,
    cache: new InMemoryCache({
      resultCaching: false,
    }),
  });

type EvaluationResult = {
  score: number;
  isUp?: boolean;
  isSynced?: boolean;
  isHealthy?: boolean;
};

const evaluateEndpoint = async (endpoint: GraphQLEndpoint) => {
  let result: EvaluationResult = {
    score: 0,
    isUp: undefined,
    isSynced: undefined,
    isHealthy: undefined,
  };

  try {
    const metaResponse = await (
      await fetch(endpoint.graph, {
        method: 'POST',
        body: JSON.stringify({ query: metaQuery }),
      })
    ).json();

    if (!metaResponse?.data?._meta?.deployment) {
      console.error('Failed to fetch graph deployment id!', metaResponse);
      return result;
    }

    result.score++;
    result.isUp = true;

    if (!endpoint.index) {
      // endpoint can not be evaluated further
      return result;
    }

    const statusResponse = await (
      await fetch(endpoint.index, {
        method: 'POST',
        body: JSON.stringify({
          query: statusQuery(metaResponse.data._meta.deployment),
          // graphql variables sadly didn't work with the array as query parameter
        }),
      })
    ).json();
    if (statusResponse?.data?.indexingStatuses?.[0].subgraph) {
      const entry = statusResponse.data.indexingStatuses[0];
      if (entry.synced) {
        result.score++;
        result.isSynced = true;
      }
      if (entry.health === 'healthy') {
        result.score++;
        result.isHealthy = true;
      }
    }
  } catch (error) {
    console.error('Failed to evaluate graph endpoint!', error);
  }

  return result;
};

// TODO: add Perpetual GraphQL mainnet urls
const config: GraphQLEndpoint[] = [
  {
    graph:
      'https://api.thegraph.com/subgraphs/name/omerzam/perpetual-swaps-compete',
    index: 'https://api.thegraph.com/index-node/graphql',
  },
  {
    graph:
      'https://graphql.sovryn.app/subgraphs/name/DistributedCollective/Sovryn-perpetual-swaps-subgraph',
    isFallback: true,
  },
];

const RETRY_DELAY = 2 * 60 * 1000; // 2 seconds
const MAX_TEST_SCORE = 3; // number of tests, can change in future

type GraphQLProviderProps = {
  children: React.ReactNode;
};

export const GraphQLProvider: React.FC<GraphQLProviderProps> = ({
  children,
}) => {
  const [{ active, client, isInitialClient }, setState] = useState({
    active: 0,
    client: createClient(config[0]),
    isInitialClient: true,
  });

  useEffect(() => {
    const activeEndpoint = config[active];
    const evaluate = async () => {
      try {
        let bestEvaluation = await evaluateEndpoint(activeEndpoint);
        let bestIndex = active;

        if (bestEvaluation.score === MAX_TEST_SCORE) {
          console.info(
            `GraphQL endpoint is healthy and synced! Continuing to use "${activeEndpoint.graph}".`,
          );
          return;
        }
        console.info(
          `GraphQL endpoint is lacking! ${JSON.stringify(bestEvaluation)}`,
          `Evaluating alternatives!`,
        );

        for (let index = 0; index < config.length; index++) {
          if (index === active) {
            continue;
          }

          const endpoint = config[index];
          const evaluation = await evaluateEndpoint(endpoint);

          if (
            evaluation.score > bestEvaluation.score ||
            (endpoint.isFallback && evaluation.isUp)
          ) {
            bestEvaluation = evaluation;
            bestIndex = index;
          }
          if (bestEvaluation.score === MAX_TEST_SCORE) {
            break;
          }
        }

        if (bestIndex !== active) {
          console.info(
            `GraphQL endpoint switching to "${config[bestIndex].graph}"`,
          );

          const client = createClient(config[bestIndex]);
          setState({ active: bestIndex, client, isInitialClient: false });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isInitialClient) {
      evaluate();
    }

    const intervalId = setInterval(evaluate, RETRY_DELAY);

    return () => {
      client.stop();
      clearTimeout(intervalId);
    };
  }, [active, client, isInitialClient]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

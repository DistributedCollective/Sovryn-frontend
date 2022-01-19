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
  const tests = 3;
  let score = 0;

  let result: EvaluationResult = {
    score: 0,
    isUp: false,
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

    score++;
    result.isUp = true;

    if (!endpoint.index) {
      // endpoint can not be evaluated further
      result.score = score / tests;
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
        score++;
        result.isSynced = true;
      }
      if (entry.health === 'healthy') {
        score++;
        result.isHealthy = true;
      }
    }
  } catch (error) {
    console.error('Failed to evaluate graph endpoint!', error);
  }

  result.score = score / tests;
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

export let PERPETUAL_GRAPHQL_CLIENT = createClient(config[0]);

const RETRY_DELAY = 120 * 1000;

type GraphQLProvicerProps = {
  children: React.ReactNode;
};

export const GraphQLProvider: React.FC<GraphQLProvicerProps> = ({
  children,
}) => {
  const [{ active, client, isInitialClient }, setState] = useState({
    active: 0,
    client: PERPETUAL_GRAPHQL_CLIENT,
    isInitialClient: true,
  });

  useEffect(() => {
    const activeEndpoint = config[active];
    const evaluate = async () => {
      try {
        let bestScore = await evaluateEndpoint(activeEndpoint);
        let bestIndex = active;

        if (bestScore.score === 1) {
          console.info(
            `GraphQL endpoint is healthy and synced! Continuing to use "${activeEndpoint.graph}".`,
          );
          return;
        }
        console.info(
          `GraphQL endpoint is lacking! ${JSON.stringify(bestScore)}`,
          `Evaluating alternatives!`,
        );

        for (let index = 0; index < config.length; index++) {
          if (index === active) {
            continue;
          }

          const endpoint = config[index];
          const score = await evaluateEndpoint(endpoint);

          if (
            score.score > bestScore.score ||
            (endpoint.isFallback && score.isUp)
          ) {
            bestScore = score;
            bestIndex = index;
          }
          if (bestScore.score === 1) {
            break;
          }
        }

        if (bestIndex !== active) {
          console.info(
            `GraphQL endpoint switching to "${config[bestIndex].graph}"`,
          );

          const client = createClient(config[bestIndex]);
          PERPETUAL_GRAPHQL_CLIENT = client;
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

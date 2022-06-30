import React, { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { isMainnet, isStaging } from 'utils/classifiers';

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

const MAX_ALLOWED_BLOCK_BEHIND = 15; // ~45 seconds
const RETRY_DELAY = 2 * 60 * 1000; // 2 minutes
const MAX_TEST_SCORE = 4; // number of tests, can change in future
const LACKING_TEST_SCORE = MAX_TEST_SCORE - 1; // number of tests minus 1 for blocks behind, can change in future

type EvaluationResult = {
  score: number;
  isUp?: boolean;
  isSynced?: boolean;
  isHealthy?: boolean;
  isKeepingUp?: boolean;
  blocksBehind?: number;
};

const evaluateEndpoint = async (endpoint: GraphQLEndpoint) => {
  let result: EvaluationResult = {
    score: 0,
    isUp: undefined,
    isSynced: undefined,
    isHealthy: undefined,
    isKeepingUp: undefined,
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
      if (
        entry.chains?.[0]?.chainHeadBlock?.number &&
        entry.chains?.[0]?.latestBlock?.number
      ) {
        const blocksBehind =
          entry.chains[0].chainHeadBlock.number -
          entry.chains[0].latestBlock.number;
        if (blocksBehind > 0) {
          if (blocksBehind > MAX_ALLOWED_BLOCK_BEHIND) {
            result.isKeepingUp = false;
          } else {
            result.score += 1 - blocksBehind / (MAX_ALLOWED_BLOCK_BEHIND + 1);
            result.isKeepingUp = true;
          }
          result.blocksBehind = blocksBehind;
        }
      }
    }
  } catch (error) {
    console.error('Failed to evaluate graph endpoint!', error);
  }

  return result;
};

// fallback endpoint has to always be the last entry.
const config: GraphQLEndpoint[] =
  isMainnet || isStaging
    ? [
        {
          graph:
            'https://sovryn-perps-subgraph.sovryn.app/subgraphs/name/DistributedCollective/Sovryn-perpetual-swaps-subgraph',
          index: 'https://sovryn-perps-subgraph.sovryn.app/graphql',
        },
        {
          graph:
            'https://api.thegraph.com/subgraphs/name/distributedcollective/sovryn-perpetual-futures',
          index: 'https://api.thegraph.com/index-node/graphql',
          isFallback: true,
        },
      ]
    : [
        // {
        //   graph:
        //     'https://api.thegraph.com/subgraphs/name/omerzam/perpetual-swaps-compete',
        //   index: 'https://api.thegraph.com/index-node/graphql',
        // },
        {
          graph:
            'https://sovryn-perps-subgraph.test.sovryn.app/subgraphs/name/DistributedCollective/Sovryn-perpetual-swaps-subgraph',
          // isFallback: true,
        },
      ];

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

        if (bestEvaluation.score > LACKING_TEST_SCORE) {
          // console.info(
          //   `GraphQL endpoint is healthy and synced! [score:${bestEvaluation.score}] Continuing to use "${activeEndpoint.graph}".`,
          // );
          return;
        } else if (activeEndpoint.isFallback) {
          // TODO: add index to private fallback graph to be able to properly evaluate it.
          bestEvaluation.score =
            bestEvaluation.score > 0 ? LACKING_TEST_SCORE : 0;
        }
        // console.info(
        //   `GraphQL endpoint is ${
        //     activeEndpoint.isFallback ? 'the fallback' : 'lacking'
        //   }!`,
        //   JSON.stringify(bestEvaluation),
        //   `Evaluating alternatives!`,
        // );

        for (let index = 0; index < config.length; index++) {
          if (index === active) {
            continue;
          }

          const endpoint = config[index];
          const evaluation = await evaluateEndpoint(endpoint);

          if (
            evaluation.score > bestEvaluation.score ||
            (endpoint.isFallback &&
              evaluation.isUp &&
              bestEvaluation.score <= LACKING_TEST_SCORE)
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

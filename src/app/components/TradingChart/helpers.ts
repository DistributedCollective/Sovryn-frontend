import { ApolloClient, gql } from '@apollo/client';
import { CandleDuration } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import type { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { TradingCandleDictionary } from './dictionary';

export const MAX_CANDLE_COUNT = 500;
export const graph_endpoint: string = process.env.REACT_APP_GRAPH_RSK!;

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

export const queryCandles = async (
  client: ApolloClient<any>,
  candleDuration: CandleDuration,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleNumber: number,
) => {
  try {
    const candleDetails = TradingCandleDictionary.get(candleDuration);
    const query = gql`
      {
        candleSticks (
          where: {
            baseToken: "${baseToken}"
            quoteToken: "${quoteToken}"
            interval: "${candleDetails.entityName}"
            periodStartUnix_gte: ${startTime}
            periodStartUnix_lte: ${endTime}
          }
          orderBy: periodStartUnix
          orderDirection: desc
          first: ${Math.min(candleNumber, MAX_CANDLE_COUNT)}
        ) {
          id
          open
          high
          low
          close
          totalVolume
          periodStartUnix
        }
      }
    `;
    const bars: Bar[] = await client
      .query({
        query,
      })
      .then(response => response.data?.candleSticks || [])
      .then(response =>
        response.map(item => ({
          time: item.periodStartUnix * 1000,
          low: item.low,
          high: item.high,
          open: item.open,
          close: item.close,
          volume: item.totalVolume,
        })),
      )
      .then(response => response.sort((a, b) => a.time - b.time));
    return bars;
  } catch (error) {
    console.error(error);
    throw new Error(`Request error: ${error}`);
  }
};

const getTokenAddress = (asset: Asset) =>
  getTokenContract(asset).address.toLowerCase();

export const getTokensFromSymbol = (symbol: string) => {
  const [base, quote] = symbol.split('/');
  return {
    baseToken: getTokenAddress(base as Asset),
    quoteToken: getTokenAddress(quote as Asset),
  };
};

import { ApolloClient, gql } from '@apollo/client';
import {
  CandleDetails,
  CandleDuration,
} from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import type { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

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

export const candleSticksGQL = (
  baseToken: string,
  quoteToken: string,
  interval: string,
  periodStartUnix_gte: number,
  periodStartUnix_lt: number,
) => `
   {
     candleSticks(
       where: {
         baseToken: "${baseToken}"
         quoteToken: "${quoteToken}"
         interval: "${interval}"
         periodStartUnix_gte: ${periodStartUnix_gte}
         periodStartUnix_lt: ${periodStartUnix_lt}
       }
       orderBy: periodStartUnix
       orderDirection: asc
     ) {
       open
       high
       low
       close
       totalVolume
       periodStartUnix
       interval
     }
   }
 `;

export const fetchGrapql = async (
  query: string,
  signal?: AbortSignal,
): Promise<Bar[]> =>
  fetch(graph_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    signal,
  })
    .then(response => response.json())
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
    );

export const makeApiRequest = async (
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

export class TradingCandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [CandleDuration.M_1, new CandleDetails('MinuteInterval', 'D', 1, 5, 60)],
    [
      CandleDuration.M_15,
      // yes, value is correct, typo is in backend side.
      new CandleDetails('FifteenMintuesInterval', 'D', 3, 5, 60 * 15),
    ],
    [CandleDuration.H_1, new CandleDetails('HourInterval', 'D', 5, 5, 60 * 60)],
    [
      CandleDuration.H_4,
      new CandleDetails('FourHourInterval', 'D', 10, 10, 60 * 60 * 4),
    ],
    [
      CandleDuration.D_1,
      new CandleDetails('DayInterval', 'D', 90, 90, 60 * 60 * 24),
    ],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}

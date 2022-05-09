import type { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

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

const getTokenAddress = (asset: Asset) =>
  getTokenContract(asset).address.toLowerCase();

// @todo graph does not return expected values for other intervals.
// Leave it as HourInterval until it's fixed.
const resolveResolution = (resolution: string) => 'HourInterval';

export const fetchCandleSticks = (
  baseToken: Asset,
  quoteToken: Asset,
  interval: string,
  from: number,
  to: number,
  signal?: AbortSignal,
) =>
  fetchGrapql(
    candleSticksGQL(
      getTokenAddress(baseToken),
      getTokenAddress(quoteToken),
      resolveResolution(interval),
      from,
      to,
    ),
    signal,
  );

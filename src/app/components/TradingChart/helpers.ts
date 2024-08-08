import { CandleDetails } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { Bar } from './types';
import {
  CHUNK_SIZE,
  SOVRYN_INDEXER_MAINNET,
  SOVRYN_INDEXER_TESTNET,
} from './constants';
import { isMainnet } from 'utils/classifiers';

type TimestampChunk = {
  from: number;
  to: number;
};

const pairsToInvert = ['RBTC/DLLR'];

const indexerBaseUrl = isMainnet
  ? SOVRYN_INDEXER_MAINNET
  : SOVRYN_INDEXER_TESTNET;

export const shouldInvertPair = (symbolName: string) =>
  pairsToInvert.includes(symbolName);

const splitPeriodToChunks = (
  from: number,
  to: number,
  candleDetails: CandleDetails,
): TimestampChunk[] => {
  const timeSpanSeconds = to - from;
  const candlesInPeriod = Math.abs(
    Math.floor(timeSpanSeconds / candleDetails.candleSeconds),
  );

  const chunks =
    candlesInPeriod > CHUNK_SIZE ? Math.ceil(candlesInPeriod / CHUNK_SIZE) : 1;

  let _from = from;
  let _to = from;

  const times: TimestampChunk[] = [];

  if (candlesInPeriod > CHUNK_SIZE) {
    const delay = CHUNK_SIZE * candleDetails.candleSeconds;
    for (let chunk = 0; chunk < chunks; chunk++) {
      _from = chunk === 0 ? from : _to;
      _to = _from + delay < to ? _from + delay : to;
      times.push({ from: _from, to: _to });
    }
    return times;
  }

  return [{ from, to }];
};

export const queryPairByChunks = async (
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
): Promise<Bar[]> => {
  const queries = splitPeriodToChunks(
    startTime,
    endTime,
    candleDetails,
  ).map(item =>
    queryCandles(candleDetails, baseToken, quoteToken, item.from, item.to),
  );

  return Promise.all(queries).then(items =>
    items.flat(1).sort((a, b) => a.time - b.time),
  );
};

export const queryCandles = async (
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
) => {
  try {
    const fullIndexerUrl = `${indexerBaseUrl}base=${baseToken}&quote=${quoteToken}&start=${startTime}&end=${endTime}&timeframe=${candleDetails.candleSymbol}`;

    const result = await (await fetch(fullIndexerUrl)).json();

    const bars: Bar[] = result.data.map(item => ({
      time: Number(item.date) * 1000,
      low: item.low,
      high: item.high,
      open: item.open,
      close: item.close,
    }));

    return bars;
  } catch (error) {
    console.error(error);
    throw new Error(`Request error: ${error}`);
  }
};

const getTokenAddress = (asset: Asset) =>
  getTokenContract(asset).address.toLowerCase();

export const getTokensFromSymbol = (symbol: string) => {
  let [base, quote] = symbol.split('/');
  return {
    baseToken: getTokenAddress(base as Asset),
    quoteToken: getTokenAddress(quote as Asset),
  };
};

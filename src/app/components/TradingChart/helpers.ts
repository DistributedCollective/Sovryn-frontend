import { ApolloClient, gql } from '@apollo/client';
import { CandleDetails } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { uniqBy } from 'lodash';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

// maximum number of candles that should be loaded in one request
const CHUNK_SIZE = 75;

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

export type CandleSticksResponse = {
  id: string;
  open: number;
  high: number;
  low: number;
  close: number;
  totalVolume: number;
  periodStartUnix: number;
};

type TimestampChunk = {
  from: number;
  to: number;
};

export const hasDirectFeed = (symbolName: string) => {
  const [, quote] = symbolName.split('/') as [Asset, Asset];
  return [Asset.RBTC, Asset.XUSD].includes(quote);
};

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
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  hasDirectPair: boolean,
  candleLimit: number = CHUNK_SIZE,
): Promise<Bar[]> => {
  const queries = splitPeriodToChunks(
    startTime,
    endTime,
    candleDetails,
  ).map(item =>
    queryCandles(
      client,
      candleDetails,
      hasDirectPair,
      baseToken,
      quoteToken,
      item.from,
      item.to,
      candleLimit,
    ),
  );

  return Promise.all(queries).then(items =>
    items.flat(1).sort((a, b) => a.time - b.time),
  );
};

const queryDirectPair = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleLimit: number = CHUNK_SIZE,
): Promise<Bar[]> => {
  const query = gql`
      {
        ${candleDetails.entityName} (
          where: {
            baseToken: "${baseToken}"
            quoteToken: "${quoteToken}"
            periodStartUnix_gte: ${startTime}
            periodStartUnix_lte: ${endTime}
          }
          orderBy: periodStartUnix
          orderDirection: desc
          first: ${candleLimit}
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
  return client
    .query({
      query,
    })
    .then(response => response.data?.candleSticks || [])
    .then(items =>
      items.map(item => ({
        open: Number(item.open),
        high: Number(item.high),
        low: Number(item.low),
        close: Number(item.close),
        volume: Number(item.totalVolume),
        time: Number(item.periodStartUnix) * 1000,
      })),
    );
};

const fillItem = (base: Bar, quote?: Bar, lastQuote?: Bar): Bar | null => {
  if (!quote && lastQuote) {
    quote = lastQuote;
  }

  if (!quote) {
    return null;
  }

  return {
    open: base.open / quote.open,
    high: base.high / quote.high,
    low: base.low / quote.low,
    close: base.close / quote.close,
    volume: 0,
    time: base.time,
  };
};

export const queryCustomPairs = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleLimit: number = CHUNK_SIZE,
) => {
  return Promise.all([
    queryDirectPair(
      client,
      candleDetails,
      baseToken,
      getTokenAddress(Asset.XUSD),
      startTime,
      endTime,
      candleLimit,
    ),
    queryDirectPair(
      client,
      candleDetails,
      quoteToken,
      getTokenAddress(Asset.XUSD),
      startTime,
      endTime,
      candleLimit,
    ),
  ]).then(e => {
    const baseCandles: Bar[] = e[0];
    const quoteCandles: Bar[] = e[1];

    const items: Bar[] = [];
    let lastQuote;
    let lastBase;

    for (let base of baseCandles) {
      const quote = quoteCandles.find(item => item.time === base.time);

      const item = fillItem(base, quote, lastQuote);
      if (item) {
        items.push(item);
      }

      if (quote) {
        lastQuote = quote;
      }
    }

    for (let quote of quoteCandles) {
      const base = items.find(item => item.time === quote.time);

      if (!base && lastBase) {
        const item = fillItem(lastBase, quote, lastBase);
        if (item) {
          items.push(item);
        } else {
          items.push(lastBase);
        }
      }

      if (base) {
        lastBase = base;
      }
    }

    return items;
  });
};

export const queryCandles = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  directFeed: boolean,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleLimit: number = CHUNK_SIZE,
) => {
  try {
    const bars: Bar[] = await (directFeed
      ? queryDirectPair(
          client,
          candleDetails,
          baseToken,
          quoteToken,
          startTime,
          endTime,
          candleLimit,
        )
      : queryCustomPairs(
          client,
          candleDetails,
          baseToken,
          quoteToken,
          startTime,
          endTime,
          candleLimit,
        ));
    return addMissingBars(bars, candleDetails);
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

export const addMissingBars = (
  bars: Bar[],
  candleDetails: CandleDetails,
): Bar[] => {
  const seconds = candleDetails.candleSeconds * 1e3;
  let newBars: Bar[] = [];
  let previousBar = bars[bars.length - 1];
  for (let i = 0; i < bars.length; i++) {
    previousBar = newBars[newBars.length - 1];
    if (i === 0) {
      newBars.push(bars[i]);
    } else if (bars[i].time === previousBar.time + seconds) {
      /* Is next bar in sequence */
      newBars.push(bars[i]);
    } else {
      const extraBar = {
        high: previousBar.close,
        low: previousBar.close,
        open: previousBar.close,
        close: previousBar.close,
        volume: 0,
      };
      let startTime = previousBar.time + seconds;
      while (startTime < bars[i].time) {
        const newBar = {
          ...extraBar,
          time: startTime,
        };
        newBars.push(newBar);
        startTime += seconds;
      }
      newBars.push(bars[i]);
    }
  }

  const items = uniqBy(newBars, 'time').sort((a, b) => a.time - b.time);

  return items;
};

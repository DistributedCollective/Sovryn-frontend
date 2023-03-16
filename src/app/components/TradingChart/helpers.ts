import { ApolloClient, gql } from '@apollo/client';
import { CandleDetails } from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { uniqBy } from 'lodash';
import { Asset } from 'types';
import { getTokenContract } from 'utils/blockchain/contract-helpers';

// maximum number of candles that should be loaded in one request
const CHUNK_SIZE = 1000;
const endTimeChache = new Map<string, number>();

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

const pairstoInvert = ['RBTC/DLLR'];

export const shouldInvertPair = (symbolName: string) =>
  pairstoInvert.includes(symbolName);

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
  preventFill: boolean = false,
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
      preventFill,
    ),
  );

  return Promise.all(queries).then(items =>
    items.flat(1).sort((a, b) => a.time - b.time),
  );
};

type Candle = {
  open: string;
  high: string;
  low: string;
  close: string;
  totalVolume: string;
  periodStartUnix: string;
};

const candleToBar = (item: Candle): Bar => ({
  open: Number(item.open),
  high: Number(item.high),
  low: Number(item.low),
  close: Number(item.close),
  volume: Number(item.totalVolume),
  time: Number(item.periodStartUnix) * 1000,
});

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
    .then(response => response.data?.[candleDetails.entityName] || [])
    .then(items => items.map(candleToBar));
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

export const getEndTime = (baseToken: string, quoteToken: string) => {
  const key = `${baseToken}-${quoteToken}`;
  return endTimeChache.get(key);
};

export const setEndTime = (
  baseToken: string,
  quoteToken: string,
  timestamp: number,
) => {
  const key = `${baseToken}-${quoteToken}`;
  endTimeChache.set(key, timestamp);
};

const getFirstCandleTimestamp = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
): Promise<number> => {
  const query = gql`
      {
        ${candleDetails.entityName} (
          where: {
            baseToken: "${baseToken}"
            quoteToken: "${quoteToken}"
          }
          orderBy: periodStartUnix
          orderDirection: asc
          first: 1
        ) {
          periodStartUnix
        }
      }
    `;
  return client
    .query({
      query,
    })
    .then(response => response.data?.[candleDetails.entityName] || [])
    .then(items => items[0]?.periodStartUnix || Date.now() / 1000);
};

const getBarOlderThan = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  timestamp,
): Promise<Bar | undefined> => {
  const query = gql`
      {
        ${candleDetails.entityName} (
          where: {
            baseToken: "${baseToken}"
            quoteToken: "${quoteToken}"
            periodStartUnix_lte: ${timestamp}
          }
          orderBy: periodStartUnix
          orderDirection: desc
          first: 1
        ) {
          open
          close
          high
          low
          totalVolume
          periodStartUnix
        }
      }
    `;
  return client
    .query({
      query,
    })
    .then(response => response.data?.[candleDetails.entityName] || [])
    .then(items => items.map(candleToBar))
    .then(items => items[0]);
};

const getBarNewerThan = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  timestamp,
): Promise<Bar | undefined> => {
  const query = gql`
      {
        ${candleDetails.entityName} (
          where: {
            baseToken: "${baseToken}"
            quoteToken: "${quoteToken}"
            periodStartUnix_gte: ${timestamp}
          }
          orderBy: periodStartUnix
          orderDirection: asc
          first: 1
        ) {
          open
          close
          high
          low
          totalVolume
          periodStartUnix
        }
      }
    `;
  return client
    .query({
      query,
    })
    .then(response => response.data?.[candleDetails.entityName] || [])
    .then(items => items.map(candleToBar))
    .then(items => items[0]);
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
  preventFill: boolean = false,
) => {
  try {
    const graphStartTime = getEndTime(baseToken, quoteToken);
    if (graphStartTime === undefined) {
      if (directFeed) {
        const firstCandleTimestamp = await getFirstCandleTimestamp(
          client,
          candleDetails,
          baseToken,
          quoteToken,
        );
        setEndTime(baseToken, quoteToken, firstCandleTimestamp);
      } else {
        const base = await getFirstCandleTimestamp(
          client,
          candleDetails,
          baseToken,
          getTokenAddress(Asset.XUSD),
        );
        const quote = await getFirstCandleTimestamp(
          client,
          candleDetails,
          quoteToken,
          getTokenAddress(Asset.XUSD),
        );
        setEndTime(baseToken, quoteToken, Math.min(base, quote));
      }
    }

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

    if (preventFill) {
      return bars;
    }

    return addMissingBars(
      bars,
      client,
      baseToken,
      quoteToken,
      candleDetails,
      graphStartTime !== undefined && graphStartTime > startTime
        ? graphStartTime
        : startTime,
      endTime,
    );
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

export const addMissingBars = async (
  bars: Bar[],
  client: ApolloClient<any>,
  baseToken: string,
  quoteToken: string,
  candleDetails: CandleDetails,
  startTimestamp: number,
  endTimestamp: number,
): Promise<Bar[]> => {
  const seconds = candleDetails.candleSeconds;
  const barCount = Math.floor((endTimestamp - startTimestamp) / seconds);

  if (bars.length === 0 && barCount <= 2) {
    return [];
  }

  let items = uniqBy(bars, 'time').sort((a, b) => a.time - b.time);

  if (items.length === 0) {
    const oldestExistingBar = await getBarOlderThan(
      client,
      candleDetails,
      baseToken,
      quoteToken,
      startTimestamp,
    );

    const newestBar = await getBarNewerThan(
      client,
      candleDetails,
      baseToken,
      quoteToken,
      endTimestamp,
    );

    items = [
      {
        time: startTimestamp * 1000,
        open: oldestExistingBar?.open || 0,
        close: oldestExistingBar?.open || 0,
        high: oldestExistingBar?.open || 0,
        low: oldestExistingBar?.open || 0,
        volume: 0,
      },
      {
        time: endTimestamp * 1000,
        open: newestBar?.open || 0,
        close: newestBar?.open || 0,
        high: newestBar?.open || 0,
        low: newestBar?.open || 0,
        volume: 0,
      },
    ];
  }

  // fill previous bars

  const firstBar = items[0];

  // missing bar count between first bar and start timestamp
  const missingBarCountStart = Math.floor(
    (firstBar.time / 1000 - startTimestamp) / seconds,
  );

  if (missingBarCountStart > 0) {
    let i = missingBarCountStart;
    while (i > 0) {
      let time = firstBar.time - (i + 1) * seconds * 1000;

      if (time >= Date.now()) {
        break;
      }

      // time = time < startTimestamp * 1000 ? startTimestamp * 1000 : time;

      items.push({
        open: firstBar.close,
        high: firstBar.close,
        low: firstBar.close,
        close: firstBar.close,
        volume: 0,
        time,
      });

      i--;
    }
  }

  items = uniqBy(items, 'time').sort((a, b) => a.time - b.time);

  const lastBar = items[items.length - 1];

  const missingBarCountEnd = Math.floor(
    (endTimestamp - lastBar.time / 1000) / seconds,
  );

  if (missingBarCountEnd >= 1) {
    let i = missingBarCountEnd;
    while (i > 0) {
      let time = lastBar.time + i * seconds * 1000;
      items.push({
        open: lastBar.close,
        high: lastBar.close,
        low: lastBar.close,
        close: lastBar.close,
        volume: 0,
        time,
      });

      i--;
    }
  }

  items = uniqBy(items, 'time').sort((a, b) => a.time - b.time);

  if (barCount - items.length > 0) {
    let index = 0;
    const firstItem = items[0];
    const newBars: Bar[] = [];
    while (index < barCount) {
      const nextTime = firstItem.time + (index + 1) * seconds * 1000;
      const search = items.find(item => item.time === nextTime);

      if (search) {
        newBars.push(search);
      } else {
        const searchNext = items.find(item => item.time > nextTime);

        if (searchNext) {
          const previous = newBars
            .filter(item => item.time < nextTime)
            .sort((a, b) => b.time - a.time)[0];

          const open = previous ? previous.close : searchNext.open;
          const close = searchNext.close;

          const high = Math.max(open, close);
          const low = Math.min(open, close);

          newBars.push({
            open,
            high,
            low,
            close,
            volume: 0,
            time: nextTime,
          });
        }
      }

      index++;
    }
    items = newBars;
  }

  items = items.map((item, index) => {
    const next = items[index + 1] || item;
    const close = !next.volume ? item.close : next.open;

    return {
      ...item,
      close,
    };
  });

  return items;
};

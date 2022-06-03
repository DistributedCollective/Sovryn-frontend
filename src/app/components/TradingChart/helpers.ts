import { ApolloClient, gql } from '@apollo/client';
import {
  CandleDetails,
  CandleDuration,
} from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';
import { Asset } from 'types';
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

export type CandleSticksResponse = {
  id: string;
  open: number;
  high: number;
  low: number;
  close: number;
  totalVolume: number;
  periodStartUnix: number;
};

export const hasDirectFeed = (symbolName: string) => {
  const [, quote] = symbolName.split('/') as [Asset, Asset];
  return [Asset.RBTC, Asset.XUSD].includes(quote);
};

const queryDirectPair = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleNumber: number,
): Promise<CandleSticksResponse[]> => {
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
  return client
    .query({
      query,
    })
    .then(response => response.data?.candleSticks || []);
};

const fillItem = (
  base: CandleSticksResponse,
  quote?: CandleSticksResponse,
  lastQuote?: CandleSticksResponse,
): CandleSticksResponse | null => {
  if (!quote && lastQuote) {
    quote = lastQuote;
  }

  if (!quote) {
    return null;
  }

  return {
    id: base.id,
    open: base.open / quote.open,
    high: base.high / quote.high,
    low: base.low / quote.low,
    close: base.close / quote.close,
    totalVolume: 0,
    periodStartUnix: base.periodStartUnix,
  };
};

export const queryCustomPairs = async (
  client: ApolloClient<any>,
  candleDetails: CandleDetails,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleNumber: number,
) => {
  return Promise.all([
    queryDirectPair(
      client,
      candleDetails,
      baseToken,
      getTokenAddress(Asset.XUSD),
      startTime,
      endTime,
      candleNumber,
    ),
    queryDirectPair(
      client,
      candleDetails,
      quoteToken,
      getTokenAddress(Asset.XUSD),
      startTime,
      endTime,
      candleNumber,
    ),
  ]).then(e => {
    const baseCandles: CandleSticksResponse[] = e[0];
    const quoteCandles: CandleSticksResponse[] = e[1];

    const items: CandleSticksResponse[] = [];
    let lastQuote;
    let lastBase;

    for (let base of baseCandles) {
      const quote = quoteCandles.find(
        item => item.periodStartUnix === base.periodStartUnix,
      );

      const item = fillItem(base, quote, lastQuote);
      if (item) {
        items.push(item);
      }

      if (quote) {
        lastQuote = quote;
      }
    }

    for (let quote of quoteCandles) {
      const base = items.find(
        item => item.periodStartUnix === quote.periodStartUnix,
      );

      if (!base && lastBase) {
        const item = fillItem(lastBase, quote, lastBase);
        if (item) {
          items.push(item);
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
  candleDuration: CandleDuration,
  directFeed: boolean,
  baseToken: string,
  quoteToken: string,
  startTime: number,
  endTime: number,
  candleNumber: number,
) => {
  try {
    const candleDetails = TradingCandleDictionary.get(candleDuration);

    const bars: Bar[] = await (directFeed
      ? queryDirectPair(
          client,
          candleDetails,
          baseToken,
          quoteToken,
          startTime,
          endTime,
          candleNumber,
        )
      : queryCustomPairs(
          client,
          candleDetails,
          baseToken,
          quoteToken,
          startTime,
          endTime,
          candleNumber,
        )
    )
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
    return addMissingBars(bars, candleDuration);
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
  candleDuration: CandleDuration,
): Bar[] => {
  const candleDetails = TradingCandleDictionary.get(candleDuration);
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
          time2: new Date(startTime).toLocaleString(),
        };
        newBars.push(newBar);
        startTime += seconds;
      }
      newBars.push(bars[i]);
    }
  }

  return newBars;
};

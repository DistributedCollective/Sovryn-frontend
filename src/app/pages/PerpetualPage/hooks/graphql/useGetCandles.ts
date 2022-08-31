import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

const MAX_CANDLE_COUNT = 500;

/**
 * Hook to return candlesticks for chart
 * Takes as input:
 * 1. PerpetualId
 * 2. Candle duration
 * 3. Start time
 *
 * Returns as output:
 * open, high, low, close, volume, startTime
 */
export function useGetCandles(
  candleDuration: CandleDuration,
  perpetualId: string,
  startTime: number,
) {
  const CANDLE_QUERY = generateCandleQuery(
    candleDuration,
    perpetualId,
    startTime,
  );
  const candleQuery = useQuery(CANDLE_QUERY);
  return candleQuery;
}

export const generateCandleQuery = (
  candleDuration: CandleDuration,
  perpetualId: string,
  startTime: number,
): DocumentNode => {
  const candleDetails = CandleDictionary.get(candleDuration);
  return gql`
    {
      ${candleDetails.entityName}(
        where: {
          periodStartUnix_gte: ${startTime}
          perpetual: "${perpetualId}"
        }
        orderBy: periodStartUnix
        orderDirection: asc
        first: ${MAX_CANDLE_COUNT}
      ) {
        open
        high
        low
        close
        totalVolume
        periodStartUnix
        oraclePriceOpen
        oraclePriceHigh
        oraclePriceLow
        oraclePriceClose
        txCount
      }
    }
  `;
};

export const generateFirstCandleQuery = (
  candleDuration: CandleDuration,
  perpetualId: string,
  candleNumber: number,
): DocumentNode => {
  const candleDetails = CandleDictionary.get(candleDuration);
  return gql`
    {
      ${candleDetails.entityName}(
        where: {
          perpetual: "${perpetualId}"
        }
        orderBy: periodStartUnix
        orderDirection: asc
        first: ${Math.min(candleNumber, MAX_CANDLE_COUNT)}
      ) {
        open
        high
        low
        close
        totalVolume
        periodStartUnix
        oraclePriceOpen
        oraclePriceHigh
        oraclePriceLow
        oraclePriceClose
        txCount
      }
    }
  `;
};

export enum CandleDuration {
  M_1 = 'M_1',
  M_15 = 'M_15',
  H_1 = 'H_1',
  H_4 = 'H_4',
  D_1 = 'D_1',
}

class CandleDetails {
  /** TODO: Add default number of candles or default startTime */
  constructor(
    public entityName: string,
    public resolutionBack: 'D' | 'M',
    public intervalBack: number,
    public startDaysFromNow: number, // Number of days back to start from in default query
    public candleSeconds: number,
  ) {
    this.entityName = entityName;
    this.resolutionBack = resolutionBack;
    this.intervalBack = intervalBack;
    this.startDaysFromNow = startDaysFromNow;
    this.candleSeconds = candleSeconds;
  }
}

export class CandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [
      CandleDuration.M_1,
      new CandleDetails('candleSticksMinutes', 'D', 1, 5, 60),
    ],
    [
      CandleDuration.M_15,
      new CandleDetails('candleSticksFifteenMinutes', 'D', 3, 5, 60 * 15),
    ],
    [
      CandleDuration.H_1,
      new CandleDetails('candleSticksHours', 'D', 5, 5, 60 * 60),
    ],
    [
      CandleDuration.H_4,
      new CandleDetails('candleSticksFourHours', 'D', 10, 10, 60 * 60 * 4),
    ],
    [
      CandleDuration.D_1,
      new CandleDetails('candleSticksDays', 'D', 90, 90, 60 * 60 * 24),
    ],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}

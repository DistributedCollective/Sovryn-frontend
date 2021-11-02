import { useQuery, gql } from '@apollo/client';
import { DocumentNode } from 'graphql';

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
  endTime?: number,
) {
  console.debug('Getting candles');
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
  endTime?: number,
): DocumentNode => {
  const candleDetails = CandleDictionary.get(candleDuration);
  console.debug(candleDetails);
  return gql`
    {
      ${candleDetails.entityName}(
        where: {
          periodStartUnix_gte: ${startTime}
          perpetualId: "${perpetualId}"
        }
        orderBy: periodStartUnix
        orderDirection: desc
        first: 200
      ) {
        perpetualId
        open
        high
        low
        close
        periodStartUnix
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
  constructor(public entityName: string) {
    this.entityName = entityName;
  }
}

class CandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [CandleDuration.M_1, new CandleDetails('candleSticksMinutes')],
    [CandleDuration.M_15, new CandleDetails('candleSticksFifteenMinutes')],
    [CandleDuration.H_1, new CandleDetails('candleSticksHours')],
    [CandleDuration.H_4, new CandleDetails('candleSticksFourHours')],
    [CandleDuration.D_1, new CandleDetails('candleSticksDays')],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}

import {
  CandleDetails,
  CandleDuration,
} from 'app/pages/PerpetualPage/hooks/graphql/useGetCandles';

export class TradingCandleDictionary {
  public static candles: Map<CandleDuration, CandleDetails> = new Map<
    CandleDuration,
    CandleDetails
  >([
    [
      CandleDuration.M_1,
      new CandleDetails('candleStickMinutes', 'D', 1, 5, 60),
    ],
    [
      CandleDuration.M_15,
      new CandleDetails('candleStickFifteenMinutes', 'D', 3, 5, 60 * 15),
    ],
    [
      CandleDuration.H_1,
      new CandleDetails('candleStickHours', 'D', 5, 5, 60 * 60),
    ],
    [
      CandleDuration.H_4,
      new CandleDetails('candleStickFourHours', 'D', 10, 10, 60 * 60 * 4),
    ],
    [
      CandleDuration.D_1,
      new CandleDetails('candleStickDays', 'D', 90, 90, 60 * 60 * 24),
    ],
  ]);

  public static get(candle: CandleDuration): CandleDetails {
    return this.candles.get(candle) as CandleDetails;
  }
}

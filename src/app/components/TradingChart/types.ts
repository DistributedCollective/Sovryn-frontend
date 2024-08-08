export enum SeriesStyle {
  Bars = 0,
  Candles = 1,
  Line = 2,
  Area = 3,
  HeikenAshi = 8,
  HollowCandles = 9,
  Renko = 4,
  Kagi = 5,
  PointAndFigure = 6,
  LineBreak = 7,
}

export type Bar = {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume?: number;
};

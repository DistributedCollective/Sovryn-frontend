export enum AppSection {
  Lend = 'lend',
  Borrow = 'borrow',
  MarginTrade = 'marginTrade',
  YieldFarm = 'yieldFarm',
}

export interface ISectionData {
  imageUrl: string;
  title: JSX.Element;
}

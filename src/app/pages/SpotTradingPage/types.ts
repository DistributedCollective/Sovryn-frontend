import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';

export enum SpotPairType {
  SOV_RBTC = 'SOV_RBTC',
  SOV_XUSD = 'SOV_XUSD',
  SOV_USDT = 'SOV_USDT',
  SOV_DOC = 'SOV_DOC',
  RBTC_XUSD = 'RBTC_XUSD',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_DOC = 'RBTC_DOC',
  USDT_DOC = 'USDT_DOC',
  MOC_RBTC = 'MOC_RBTC',
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.SOV_XUSD]: [Asset.SOV, Asset.XUSD],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.RBTC_XUSD]: [Asset.RBTC, Asset.XUSD],
  [SpotPairType.RBTC_USDT]: [Asset.RBTC, Asset.USDT],
  [SpotPairType.RBTC_DOC]: [Asset.RBTC, Asset.DOC],
  [SpotPairType.USDT_DOC]: [Asset.USDT, Asset.DOC],
  [SpotPairType.MOC_RBTC]: [Asset.MOC, Asset.RBTC],
};

export const pairList = [
  SpotPairType.SOV_RBTC,
  SpotPairType.SOV_XUSD,
  SpotPairType.SOV_USDT,
  SpotPairType.SOV_DOC,
  SpotPairType.RBTC_USDT,
  SpotPairType.RBTC_XUSD,
  SpotPairType.RBTC_DOC,
  SpotPairType.USDT_DOC,
  SpotPairType.MOC_RBTC,
];

export interface SpotTradingPageState {
  pairType: SpotPairType;
  amount: string;
}

export enum TradingTypes {
  BUY = 'BUY',
  SELL = 'SELL',
}

export const getOrder = (from: Asset, to: Asset) => {
  const fromSymbol = AssetsDictionary.get(from).symbol.toUpperCase();
  const toSymbol = AssetsDictionary.get(to).symbol.toUpperCase();
  let buyPair = pairList.find(pair => pair === `${toSymbol}_${fromSymbol}`);
  let sellPair = pairList.find(pair => pair === `${fromSymbol}_${toSymbol}`);

  const pair = buyPair || sellPair;

  if (!pair) return null;

  return {
    orderType: buyPair ? TradingTypes.BUY : TradingTypes.SELL,
    pair,
    pairAsset: pairs[pair],
  };
};

export type ContainerState = SpotTradingPageState;

import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';

export enum SpotPairType {
  SOV_RBTC = 'SOV_RBTC',
  SOV_USDT = 'SOV_USDT',
  SOV_DOC = 'SOV_DOC',
  SOV_ETH = 'SOV_ETH',
  SOV_BPRO = 'SOV_BPRO',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_DOC = 'RBTC_DOC',
  RBTC_ETH = 'RBTC_ETH',
  RBTC_BPRO = 'RBTC_BPRO',
  USDT_DOC = 'USDT_DOC',
  USDT_ETH = 'USDT_ETH',
  USDT_BPRO = 'USDT_BPRO',
  DOC_ETH = 'DOC_ETH',
  DOC_BPRO = 'DOC_BPRO',
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.RBTC_USDT]: [Asset.RBTC, Asset.USDT],
  [SpotPairType.RBTC_DOC]: [Asset.RBTC, Asset.DOC],
  [SpotPairType.USDT_DOC]: [Asset.USDT, Asset.DOC],
  [SpotPairType.SOV_ETH]: [Asset.SOV, Asset.ETH],
  [SpotPairType.RBTC_ETH]: [Asset.RBTC, Asset.ETH],
  [SpotPairType.USDT_ETH]: [Asset.USDT, Asset.ETH],
  [SpotPairType.DOC_ETH]: [Asset.DOC, Asset.ETH],
  [SpotPairType.SOV_BPRO]: [Asset.SOV, Asset.BPRO],
  [SpotPairType.RBTC_BPRO]: [Asset.RBTC, Asset.BPRO],
  [SpotPairType.USDT_BPRO]: [Asset.USDT, Asset.BPRO],
  [SpotPairType.DOC_BPRO]: [Asset.DOC, Asset.BPRO],
};

export const pairList = [
  SpotPairType.SOV_RBTC,
  SpotPairType.SOV_USDT,
  SpotPairType.SOV_DOC,
  SpotPairType.SOV_ETH,
  SpotPairType.SOV_BPRO,
  SpotPairType.RBTC_USDT,
  SpotPairType.RBTC_DOC,
  SpotPairType.RBTC_ETH,
  SpotPairType.RBTC_BPRO,
  SpotPairType.USDT_DOC,
  SpotPairType.USDT_ETH,
  SpotPairType.USDT_BPRO,
  SpotPairType.DOC_ETH,
  SpotPairType.DOC_BPRO,
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

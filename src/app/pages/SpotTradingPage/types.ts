import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';

export enum SpotPairType {
  SOV_RBTC = 'SOV_RBTC',
  SOV_USDT = 'SOV_USDT',
  SOV_DOC = 'SOV_DOC',
  SOV_ETH = 'SOV_ETH',
  SOV_BPRO = 'SOV_BPRO',
  SOV_MOC = 'SOV_MOC',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_DOC = 'RBTC_DOC',
  USDT_DOC = 'USDT_DOC',
  RBTC_MOC = 'RBTC_MOC',
  USDT_MOC = 'USDT_MOC',
  ETH_RBTC = 'ETH_RBTC',
  ETH_USDT = 'ETH_USDT',
  ETH_BPRO = 'ETH_BPRO',
  ETH_MOC = 'ETH_MOC',
  RBTC_BPRO = 'RBTC_BPRO',
  BPRO_USDT = 'BPRO_USDT',
  BPRO_DOC = 'BPRO_DOC',
  BPRO_MOC = 'BPRO_MOC',
  DOC_MOC = 'DOC_MOC',
  ETH_DOC = 'ETH_DOC',
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.SOV_BPRO]: [Asset.SOV, Asset.BPRO],
  [SpotPairType.SOV_ETH]: [Asset.SOV, Asset.ETH],
  [SpotPairType.SOV_MOC]: [Asset.SOV, Asset.MOC],
  [SpotPairType.RBTC_USDT]: [Asset.RBTC, Asset.USDT],
  [SpotPairType.RBTC_DOC]: [Asset.RBTC, Asset.DOC],
  [SpotPairType.RBTC_BPRO]: [Asset.RBTC, Asset.BPRO],
  [SpotPairType.RBTC_MOC]: [Asset.RBTC, Asset.MOC],
  [SpotPairType.BPRO_USDT]: [Asset.BPRO, Asset.USDT],
  [SpotPairType.BPRO_DOC]: [Asset.BPRO, Asset.DOC],
  [SpotPairType.BPRO_MOC]: [Asset.BPRO, Asset.MOC],
  [SpotPairType.USDT_DOC]: [Asset.USDT, Asset.DOC],
  [SpotPairType.USDT_MOC]: [Asset.USDT, Asset.MOC],
  [SpotPairType.ETH_RBTC]: [Asset.ETH, Asset.RBTC],
  [SpotPairType.ETH_USDT]: [Asset.ETH, Asset.USDT],
  [SpotPairType.ETH_BPRO]: [Asset.ETH, Asset.BPRO],
  [SpotPairType.ETH_MOC]: [Asset.ETH, Asset.MOC],
  [SpotPairType.ETH_DOC]: [Asset.ETH, Asset.DOC],
  [SpotPairType.DOC_MOC]: [Asset.DOC, Asset.MOC],
};

export const pairList = [
  SpotPairType.SOV_RBTC,
  SpotPairType.SOV_USDT,
  SpotPairType.SOV_DOC,
  SpotPairType.SOV_BPRO,
  SpotPairType.SOV_ETH,
  SpotPairType.SOV_MOC,
  SpotPairType.RBTC_USDT,
  SpotPairType.RBTC_DOC,
  SpotPairType.RBTC_BPRO,
  SpotPairType.RBTC_MOC,
  SpotPairType.BPRO_USDT,
  SpotPairType.BPRO_DOC,
  SpotPairType.BPRO_MOC,
  SpotPairType.USDT_DOC,
  SpotPairType.USDT_MOC,
  SpotPairType.ETH_RBTC,
  SpotPairType.ETH_USDT,
  SpotPairType.ETH_BPRO,
  SpotPairType.ETH_MOC,
  SpotPairType.ETH_DOC,
  SpotPairType.DOC_MOC,
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

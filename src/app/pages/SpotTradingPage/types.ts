import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';

export enum SpotPairType {
  SOV_RBTC = 'SOV_RBTC',
  SOV_XUSD = 'SOV_XUSD',
  SOV_USDT = 'SOV_USDT',
  SOV_DOC = 'SOV_DOC',
  RBTC_XUSD = 'RBTC_XUSD',
  SOV_ETH = 'SOV_ETH',
  SOV_BPRO = 'SOV_BPRO',
  SOV_MOC = 'SOV_MOC',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_DOC = 'RBTC_DOC',
  USDT_DOC = 'USDT_DOC',
  MOC_RBTC = 'MOC_RBTC',
  ETH_XUSD = 'ETH_XUSD',
  MOC_XUSD = 'MOC_XUSD',
  BPRO_XUSD = 'BPRO_XUSD',
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
  SOV_BNB = 'SOV_BNBS',
  BNB_RBTC = 'BNBS_RBTC',
  BNB_ETH = 'BNBS_ETH',
  BNB_USDT = 'BNBS_USDT',
  BNB_XUSD = 'BNBS_XUSD',
  BNB_DOC = 'BNBS_DOC',
  BNB_MOC = 'BNBS_MOC',
  FISH_RBTC = 'FISH_RBTC',
  FISH_SOV = 'FISH_SOV',
  FISH_XUSD = 'FISH_XUSD',
  FISH_USDT = 'FISH_USDT',
  FISH_DOC = 'FISH_DOC',
  FISH_ETH = 'FISH_ETH',
  FISH_BNB = 'FISH_BNB',
  // RIF
  RIF_RBTC = 'RIF_RBTC',
  RIF_SOV = 'RIF_SOV',
  RIF_XUSD = 'RIF_XUSD',
  RIF_USDT = 'RIF_USDT',
  RIF_DOC = 'RIF_DOC',
  RIF_ETH = 'RIF_ETH',
  RIF_BNB = 'RIF_BNB',
  RIF_FISH = 'RIF_FISH',
  // MYNT
  MYNT_RBTC = 'MYNT_RBTC',
  MYNT_SOV = 'MYNT_SOV',
  MYNT_XUSD = 'MYNT_XUSD',
  MYNT_USDT = 'MYNT_USDT',
  MYNT_DOC = 'MYNT_DOC',
  MYNT_ETH = 'MYNT_ETH',
  MYNT_BNB = 'MYNT_BNB',
  MYNT_FISH = 'MYNT_FISH',
  MYNT_RIF = 'MYNT_RIF',
  // BRZ
  BRZ_RBTC = 'BRZ_RBTC',
  BRZ_SOV = 'BRZ_SOV',
  BRZ_XUSD = 'BRZ_XUSD',
  BRZ_USDT = 'BRZ_USDT',
  BRZ_DOC = 'BRZ_DOC',
  BRZ_ETH = 'BRZ_ETH',
  BRZ_BNB = 'BRZ_BNB',
  BRZ_FISH = 'BRZ_FISH',
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.SOV_XUSD]: [Asset.SOV, Asset.XUSD],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.RBTC_XUSD]: [Asset.RBTC, Asset.XUSD],
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
  [SpotPairType.MOC_RBTC]: [Asset.MOC, Asset.RBTC],
  [SpotPairType.ETH_XUSD]: [Asset.ETH, Asset.XUSD],
  [SpotPairType.MOC_XUSD]: [Asset.MOC, Asset.XUSD],
  [SpotPairType.BPRO_XUSD]: [Asset.BPRO, Asset.XUSD],
  [SpotPairType.USDT_MOC]: [Asset.USDT, Asset.MOC],
  [SpotPairType.ETH_RBTC]: [Asset.ETH, Asset.RBTC],
  [SpotPairType.ETH_USDT]: [Asset.ETH, Asset.USDT],
  [SpotPairType.ETH_BPRO]: [Asset.ETH, Asset.BPRO],
  [SpotPairType.ETH_MOC]: [Asset.ETH, Asset.MOC],
  [SpotPairType.ETH_DOC]: [Asset.ETH, Asset.DOC],
  [SpotPairType.DOC_MOC]: [Asset.DOC, Asset.MOC],
  [SpotPairType.SOV_BNB]: [Asset.SOV, Asset.BNB],
  [SpotPairType.BNB_RBTC]: [Asset.BNB, Asset.RBTC],
  [SpotPairType.BNB_ETH]: [Asset.BNB, Asset.ETH],
  [SpotPairType.BNB_USDT]: [Asset.BNB, Asset.USDT],
  [SpotPairType.BNB_XUSD]: [Asset.BNB, Asset.XUSD],
  [SpotPairType.BNB_DOC]: [Asset.BNB, Asset.DOC],
  [SpotPairType.BNB_MOC]: [Asset.BNB, Asset.MOC],
  [SpotPairType.FISH_RBTC]: [Asset.FISH, Asset.RBTC],
  [SpotPairType.FISH_SOV]: [Asset.FISH, Asset.SOV],
  [SpotPairType.FISH_XUSD]: [Asset.FISH, Asset.XUSD],
  [SpotPairType.FISH_USDT]: [Asset.FISH, Asset.USDT],
  [SpotPairType.FISH_DOC]: [Asset.FISH, Asset.DOC],
  [SpotPairType.FISH_ETH]: [Asset.FISH, Asset.ETH],
  [SpotPairType.FISH_BNB]: [Asset.FISH, Asset.BNB],
  // RIF
  [SpotPairType.RIF_RBTC]: [Asset.RIF, Asset.RBTC],
  [SpotPairType.RIF_SOV]: [Asset.RIF, Asset.SOV],
  [SpotPairType.RIF_XUSD]: [Asset.RIF, Asset.XUSD],
  [SpotPairType.RIF_USDT]: [Asset.RIF, Asset.USDT],
  [SpotPairType.RIF_DOC]: [Asset.RIF, Asset.DOC],
  [SpotPairType.RIF_ETH]: [Asset.RIF, Asset.ETH],
  [SpotPairType.RIF_BNB]: [Asset.RIF, Asset.BNB],
  [SpotPairType.RIF_FISH]: [Asset.RIF, Asset.FISH],
  // MYNT
  [SpotPairType.MYNT_RBTC]: [Asset.MYNT, Asset.RBTC],
  [SpotPairType.MYNT_SOV]: [Asset.MYNT, Asset.SOV],
  [SpotPairType.MYNT_XUSD]: [Asset.MYNT, Asset.XUSD],
  [SpotPairType.MYNT_USDT]: [Asset.MYNT, Asset.USDT],
  [SpotPairType.MYNT_DOC]: [Asset.MYNT, Asset.DOC],
  [SpotPairType.MYNT_ETH]: [Asset.MYNT, Asset.ETH],
  [SpotPairType.MYNT_BNB]: [Asset.MYNT, Asset.BNB],
  [SpotPairType.MYNT_FISH]: [Asset.MYNT, Asset.FISH],
  [SpotPairType.MYNT_RIF]: [Asset.MYNT, Asset.RIF],
  // BRZ
  [SpotPairType.BRZ_RBTC]: [Asset.BRZ, Asset.RBTC],
  [SpotPairType.BRZ_SOV]: [Asset.BRZ, Asset.SOV],
  [SpotPairType.BRZ_XUSD]: [Asset.BRZ, Asset.XUSD],
  [SpotPairType.BRZ_USDT]: [Asset.BRZ, Asset.USDT],
  [SpotPairType.BRZ_DOC]: [Asset.BRZ, Asset.DOC],
  [SpotPairType.BRZ_ETH]: [Asset.BRZ, Asset.ETH],
  [SpotPairType.BRZ_BNB]: [Asset.BRZ, Asset.BNB],
  [SpotPairType.BRZ_FISH]: [Asset.BRZ, Asset.FISH],
};

export const pairList = [
  SpotPairType.SOV_RBTC,
  SpotPairType.SOV_XUSD,
  SpotPairType.SOV_USDT,
  SpotPairType.SOV_DOC,
  SpotPairType.SOV_BPRO,
  SpotPairType.SOV_ETH,
  SpotPairType.SOV_MOC,
  SpotPairType.RBTC_USDT,
  SpotPairType.RBTC_XUSD,
  SpotPairType.RBTC_DOC,
  SpotPairType.RBTC_BPRO,
  SpotPairType.RBTC_MOC,
  SpotPairType.BPRO_USDT,
  SpotPairType.BPRO_DOC,
  SpotPairType.BPRO_MOC,
  SpotPairType.USDT_DOC,
  SpotPairType.MOC_RBTC,
  SpotPairType.ETH_XUSD,
  SpotPairType.MOC_XUSD,
  SpotPairType.BPRO_XUSD,
  SpotPairType.USDT_MOC,
  SpotPairType.ETH_RBTC,
  SpotPairType.ETH_USDT,
  SpotPairType.ETH_BPRO,
  SpotPairType.ETH_MOC,
  SpotPairType.ETH_DOC,
  SpotPairType.DOC_MOC,
  SpotPairType.SOV_BNB,
  SpotPairType.BNB_RBTC,
  SpotPairType.BNB_ETH,
  SpotPairType.BNB_USDT,
  SpotPairType.BNB_XUSD,
  SpotPairType.BNB_DOC,
  SpotPairType.BNB_MOC,
  SpotPairType.FISH_RBTC,
  SpotPairType.FISH_SOV,
  SpotPairType.FISH_XUSD,
  SpotPairType.FISH_USDT,
  SpotPairType.FISH_DOC,
  SpotPairType.FISH_ETH,
  SpotPairType.FISH_BNB,
  // RIF
  SpotPairType.RIF_RBTC,
  SpotPairType.RIF_SOV,
  SpotPairType.RIF_XUSD,
  SpotPairType.RIF_USDT,
  SpotPairType.RIF_DOC,
  SpotPairType.RIF_ETH,
  SpotPairType.RIF_BNB,
  SpotPairType.RIF_FISH,

  // MYNT
  SpotPairType.MYNT_RBTC,
  SpotPairType.MYNT_SOV,
  SpotPairType.MYNT_XUSD,
  SpotPairType.MYNT_USDT,
  SpotPairType.MYNT_DOC,
  SpotPairType.MYNT_ETH,
  SpotPairType.MYNT_BNB,
  SpotPairType.MYNT_FISH,
  SpotPairType.MYNT_RIF,
  // BRZ
  SpotPairType.BRZ_RBTC,
  SpotPairType.BRZ_SOV,
  SpotPairType.BRZ_XUSD,
  SpotPairType.BRZ_USDT,
  SpotPairType.BRZ_DOC,
  SpotPairType.BRZ_ETH,
  SpotPairType.BRZ_BNB,
  SpotPairType.BRZ_FISH,
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
  const fromSymbol = AssetsDictionary.get(from)?.symbol.toUpperCase();
  const toSymbol = AssetsDictionary.get(to)?.symbol.toUpperCase();
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

export const getAmmSpotPairs = () => {
  return pairList.filter(item => {
    const [assetA, assetB] = pairs[item];
    return (
      AssetsDictionary.get(assetA).hasAMM && AssetsDictionary.get(assetB).hasAMM
    );
  });
};

export type ContainerState = SpotTradingPageState;

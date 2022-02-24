import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';
import { BigNumber } from 'ethers';
import { IApiBigNumber } from 'app/hooks/limitOrder/types';

export enum SpotPairType {
  //SOV
  SOV_RBTC = 'SOV_RBTC',
  SOV_XUSD = 'SOV_XUSD',
  SOV_USDT = 'SOV_USDT',
  SOV_DOC = 'SOV_DOC',
  SOV_ETH = 'SOV_ETH',
  SOV_BPRO = 'SOV_BPRO',
  SOV_MOC = 'SOV_MOC',
  SOV_BNBS = 'SOV_BNBS',
  //RBTC
  RBTC_USDT = 'RBTC_USDT',
  RBTC_DOC = 'RBTC_DOC',
  RBTC_XUSD = 'RBTC_XUSD',
  RBTC_MOC = 'RBTC_MOC',
  RBTC_BPRO = 'RBTC_BPRO',
  //USDT
  USDT_DOC = 'USDT_DOC',
  USDT_MOC = 'USDT_MOC',
  //MOC
  MOC_RBTC = 'MOC_RBTC',
  MOC_XUSD = 'MOC_XUSD',
  //ETH
  ETH_RBTC = 'ETH_RBTC',
  ETH_USDT = 'ETH_USDT',
  ETH_BPRO = 'ETH_BPRO',
  ETH_MOC = 'ETH_MOC',
  ETH_XUSD = 'ETH_XUSD',
  ETH_DOC = 'ETH_DOC',
  //BPRO
  BPRO_USDT = 'BPRO_USDT',
  BPRO_DOC = 'BPRO_DOC',
  BPRO_MOC = 'BPRO_MOC',
  BPRO_XUSD = 'BPRO_XUSD',
  //DOC
  DOC_MOC = 'DOC_MOC',
  //BNBS
  BNBS_RBTC = 'BNBS_RBTC',
  BNBS_ETH = 'BNBS_ETH',
  BNBS_USDT = 'BNBS_USDT',
  BNBS_XUSD = 'BNBS_XUSD',
  BNBS_DOC = 'BNBS_DOC',
  BNBS_MOC = 'BNBS_MOC',
  //FISH
  FISH_RBTC = 'FISH_RBTC',
  FISH_SOV = 'FISH_SOV',
  FISH_XUSD = 'FISH_XUSD',
  FISH_USDT = 'FISH_USDT',
  FISH_DOC = 'FISH_DOC',
  FISH_ETH = 'FISH_ETH',
  FISH_BNBS = 'FISH_BNBS',
  // RIF
  RIF_RBTC = 'RIF_RBTC',
  RIF_SOV = 'RIF_SOV',
  RIF_XUSD = 'RIF_XUSD',
  RIF_USDT = 'RIF_USDT',
  RIF_DOC = 'RIF_DOC',
  RIF_ETH = 'RIF_ETH',
  RIF_BNBS = 'RIF_BNBS',
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
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.SOV_XUSD]: [Asset.SOV, Asset.XUSD],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.SOV_BPRO]: [Asset.SOV, Asset.BPRO],
  [SpotPairType.SOV_ETH]: [Asset.SOV, Asset.ETH],
  [SpotPairType.SOV_MOC]: [Asset.SOV, Asset.MOC],
  [SpotPairType.SOV_BNBS]: [Asset.SOV, Asset.BNB],
  [SpotPairType.RBTC_USDT]: [Asset.RBTC, Asset.USDT],
  [SpotPairType.RBTC_DOC]: [Asset.RBTC, Asset.DOC],
  [SpotPairType.RBTC_BPRO]: [Asset.RBTC, Asset.BPRO],
  [SpotPairType.RBTC_MOC]: [Asset.RBTC, Asset.MOC],
  [SpotPairType.RBTC_XUSD]: [Asset.RBTC, Asset.XUSD],
  [SpotPairType.BPRO_USDT]: [Asset.BPRO, Asset.USDT],
  [SpotPairType.BPRO_DOC]: [Asset.BPRO, Asset.DOC],
  [SpotPairType.BPRO_MOC]: [Asset.BPRO, Asset.MOC],
  [SpotPairType.USDT_DOC]: [Asset.USDT, Asset.DOC],
  [SpotPairType.MOC_RBTC]: [Asset.MOC, Asset.RBTC],
  [SpotPairType.MOC_XUSD]: [Asset.MOC, Asset.XUSD],
  [SpotPairType.BPRO_XUSD]: [Asset.BPRO, Asset.XUSD],
  [SpotPairType.USDT_MOC]: [Asset.USDT, Asset.MOC],
  [SpotPairType.ETH_RBTC]: [Asset.ETH, Asset.RBTC],
  [SpotPairType.ETH_USDT]: [Asset.ETH, Asset.USDT],
  [SpotPairType.ETH_BPRO]: [Asset.ETH, Asset.BPRO],
  [SpotPairType.ETH_MOC]: [Asset.ETH, Asset.MOC],
  [SpotPairType.ETH_DOC]: [Asset.ETH, Asset.DOC],
  [SpotPairType.ETH_XUSD]: [Asset.ETH, Asset.XUSD],
  [SpotPairType.DOC_MOC]: [Asset.DOC, Asset.MOC],
  [SpotPairType.BNBS_RBTC]: [Asset.BNB, Asset.RBTC],
  [SpotPairType.BNBS_ETH]: [Asset.BNB, Asset.ETH],
  [SpotPairType.BNBS_USDT]: [Asset.BNB, Asset.USDT],
  [SpotPairType.BNBS_XUSD]: [Asset.BNB, Asset.XUSD],
  [SpotPairType.BNBS_DOC]: [Asset.BNB, Asset.DOC],
  [SpotPairType.BNBS_MOC]: [Asset.BNB, Asset.MOC],
  [SpotPairType.FISH_RBTC]: [Asset.FISH, Asset.RBTC],
  [SpotPairType.FISH_SOV]: [Asset.FISH, Asset.SOV],
  [SpotPairType.FISH_XUSD]: [Asset.FISH, Asset.XUSD],
  [SpotPairType.FISH_USDT]: [Asset.FISH, Asset.USDT],
  [SpotPairType.FISH_DOC]: [Asset.FISH, Asset.DOC],
  [SpotPairType.FISH_ETH]: [Asset.FISH, Asset.ETH],
  [SpotPairType.FISH_BNBS]: [Asset.FISH, Asset.BNB],
  // RIF
  [SpotPairType.RIF_RBTC]: [Asset.RIF, Asset.RBTC],
  [SpotPairType.RIF_SOV]: [Asset.RIF, Asset.SOV],
  [SpotPairType.RIF_XUSD]: [Asset.RIF, Asset.XUSD],
  [SpotPairType.RIF_USDT]: [Asset.RIF, Asset.USDT],
  [SpotPairType.RIF_DOC]: [Asset.RIF, Asset.DOC],
  [SpotPairType.RIF_ETH]: [Asset.RIF, Asset.ETH],
  [SpotPairType.RIF_BNBS]: [Asset.RIF, Asset.BNB],
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
};

export const pairList = Object.keys(pairs);

export interface SpotTradingPageState {
  pairType: SpotPairType;
  pendingLimitOrders: ILimitOrder[];
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

export const getSpotPairs = (pair: SpotPairType) => {
  return pairs[pair];
};

export type ContainerState = SpotTradingPageState;

export type ILimitOrder = {
  hash?: string;
  maker: string;
  fromToken: string;
  toToken: string;
  amountIn: BigNumber | string;
  amountOutMin: BigNumber | string;
  recipient: string;
  deadline: BigNumber | string;
  created: BigNumber | string;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filled?: BigNumber | string;
  filledAmount?: string;
};

export type IApiLimitOrder = {
  hash: string;
  maker: string;
  fromToken: string;
  toToken: string;
  amountIn: IApiBigNumber;
  amountOutMin: IApiBigNumber;
  recipient: string;
  deadline: IApiBigNumber;
  created: IApiBigNumber;
  v: string;
  r: string;
  s: string;
  canceled: boolean;
  filled: IApiBigNumber;
  filledAmount?: string;
};
export interface ITradeFormProps {
  sourceToken: Asset;
  targetToken: Asset;
  tradeType: TradingTypes;
  hidden: boolean;
  pair: Asset[];
}

import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
/* --- STATE --- */
import { Asset } from 'types/asset';
import { BigNumber } from 'ethers';
import { IPairData } from '../LandingPage/components/CryptocurrencyPrices/types';

export enum SpotPairType {
  USDT_RBTC = 'USDT_RBTC',
  USDT_BPRO = 'USDT_BPRO',
  USDT_DOC = 'USDT_DOC',
  USDT_SOV = 'USDT_SOV',
  USDT_ETH = 'USDT_ETH',
  USDT_MOC = 'USDT_MOC',
  USDT_XUSD = 'USDT_XUSD',
  USDT_BNBS = 'USDT_BNBS',
  USDT_FISH = 'USDT_FISH',
  USDT_RIF = 'USDT_RIF',
  BPRO_RBTC = 'BPRO_RBTC',
  BPRO_USDT = 'BPRO_USDT',
  BPRO_DOC = 'BPRO_DOC',
  BPRO_SOV = 'BPRO_SOV',
  BPRO_ETH = 'BPRO_ETH',
  BPRO_MOC = 'BPRO_MOC',
  BPRO_XUSD = 'BPRO_XUSD',
  BPRO_BNBS = 'BPRO_BNBS',
  BPRO_FISH = 'BPRO_FISH',
  BPRO_RIF = 'BPRO_RIF',
  DOC_RBTC = 'DOC_RBTC',
  DOC_USDT = 'DOC_USDT',
  DOC_BPRO = 'DOC_BPRO',
  DOC_SOV = 'DOC_SOV',
  DOC_ETH = 'DOC_ETH',
  DOC_MOC = 'DOC_MOC',
  DOC_XUSD = 'DOC_XUSD',
  DOC_BNBS = 'DOC_BNBS',
  DOC_FISH = 'DOC_FISH',
  DOC_RIF = 'DOC_RIF',
  SOV_RBTC = 'SOV_RBTC',
  SOV_USDT = 'SOV_USDT',
  SOV_BPRO = 'SOV_BPRO',
  SOV_DOC = 'SOV_DOC',
  SOV_ETH = 'SOV_ETH',
  SOV_MOC = 'SOV_MOC',
  SOV_XUSD = 'SOV_XUSD',
  SOV_BNBS = 'SOV_BNBS',
  SOV_FISH = 'SOV_FISH',
  SOV_RIF = 'SOV_RIF',
  ETH_RBTC = 'ETH_RBTC',
  ETH_USDT = 'ETH_USDT',
  ETH_BPRO = 'ETH_BPRO',
  ETH_DOC = 'ETH_DOC',
  ETH_SOV = 'ETH_SOV',
  ETH_MOC = 'ETH_MOC',
  ETH_XUSD = 'ETH_XUSD',
  ETH_BNBS = 'ETH_BNBS',
  ETH_FISH = 'ETH_FISH',
  ETH_RIF = 'ETH_RIF',
  MOC_RBTC = 'MOC_RBTC',
  MOC_USDT = 'MOC_USDT',
  MOC_BPRO = 'MOC_BPRO',
  MOC_DOC = 'MOC_DOC',
  MOC_SOV = 'MOC_SOV',
  MOC_ETH = 'MOC_ETH',
  MOC_XUSD = 'MOC_XUSD',
  MOC_BNBS = 'MOC_BNBS',
  MOC_FISH = 'MOC_FISH',
  MOC_RIF = 'MOC_RIF',
  XUSD_RBTC = 'XUSD_RBTC',
  XUSD_USDT = 'XUSD_USDT',
  XUSD_BPRO = 'XUSD_BPRO',
  XUSD_DOC = 'XUSD_DOC',
  XUSD_SOV = 'XUSD_SOV',
  XUSD_ETH = 'XUSD_ETH',
  XUSD_MOC = 'XUSD_MOC',
  XUSD_BNBS = 'XUSD_BNBS',
  XUSD_FISH = 'XUSD_FISH',
  XUSD_RIF = 'XUSD_RIF',
  BNBS_RBTC = 'BNBS_RBTC',
  BNBS_USDT = 'BNBS_USDT',
  BNBS_BPRO = 'BNBS_BPRO',
  BNBS_DOC = 'BNBS_DOC',
  BNBS_SOV = 'BNBS_SOV',
  BNBS_ETH = 'BNBS_ETH',
  BNBS_MOC = 'BNBS_MOC',
  BNBS_XUSD = 'BNBS_XUSD',
  BNBS_FISH = 'BNBS_FISH',
  BNBS_RIF = 'BNBS_RIF',
  FISH_RBTC = 'FISH_RBTC',
  FISH_USDT = 'FISH_USDT',
  FISH_BPRO = 'FISH_BPRO',
  FISH_DOC = 'FISH_DOC',
  FISH_SOV = 'FISH_SOV',
  FISH_ETH = 'FISH_ETH',
  FISH_MOC = 'FISH_MOC',
  FISH_XUSD = 'FISH_XUSD',
  FISH_BNBS = 'FISH_BNBS',
  FISH_RIF = 'FISH_RIF',
  RIF_RBTC = 'RIF_RBTC',
  RIF_USDT = 'RIF_USDT',
  RIF_BPRO = 'RIF_BPRO',
  RIF_DOC = 'RIF_DOC',
  RIF_SOV = 'RIF_SOV',
  RIF_ETH = 'RIF_ETH',
  RIF_MOC = 'RIF_MOC',
  RIF_XUSD = 'RIF_XUSD',
  RIF_BNBS = 'RIF_BNBS',
  RIF_FISH = 'RIF_FISH',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_BPRO = 'RBTC_BPRO',
  RBTC_DOC = 'RBTC_DOC',
  RBTC_SOV = 'RBTC_SOV',
  RBTC_ETH = 'RBTC_ETH',
  RBTC_MOC = 'RBTC_MOC',
  RBTC_XUSD = 'RBTC_XUSD',
  RBTC_BNBS = 'RBTC_BNBS',
  RBTC_FISH = 'RBTC_FISH',
  RBTC_RIF = 'RBTC_RIF',
}

export const pairs = {
  [SpotPairType.RBTC_USDT]: [Asset.RBTC, Asset.USDT],
  [SpotPairType.BPRO_USDT]: [Asset.BPRO, Asset.USDT],
  [SpotPairType.SOV_USDT]: [Asset.SOV, Asset.USDT],
  [SpotPairType.ETH_USDT]: [Asset.ETH, Asset.USDT],
  [SpotPairType.XUSD_USDT]: [Asset.XUSD, Asset.USDT],
  [SpotPairType.BNBS_USDT]: [Asset.BNB, Asset.USDT],
  [SpotPairType.FISH_USDT]: [Asset.FISH, Asset.USDT],
  [SpotPairType.RIF_USDT]: [Asset.RIF, Asset.USDT],

  [SpotPairType.RBTC_BPRO]: [Asset.RBTC, Asset.BPRO],
  [SpotPairType.SOV_BPRO]: [Asset.SOV, Asset.BPRO],
  [SpotPairType.ETH_BPRO]: [Asset.ETH, Asset.BPRO],
  [SpotPairType.BNBS_BPRO]: [Asset.BNB, Asset.BPRO],
  [SpotPairType.FISH_BPRO]: [Asset.FISH, Asset.BPRO],
  [SpotPairType.RIF_BPRO]: [Asset.RIF, Asset.BPRO],

  [SpotPairType.RBTC_DOC]: [Asset.RBTC, Asset.DOC],
  [SpotPairType.USDT_DOC]: [Asset.USDT, Asset.DOC],
  [SpotPairType.BPRO_DOC]: [Asset.BPRO, Asset.DOC],
  [SpotPairType.SOV_DOC]: [Asset.SOV, Asset.DOC],
  [SpotPairType.ETH_DOC]: [Asset.ETH, Asset.DOC],
  [SpotPairType.XUSD_DOC]: [Asset.XUSD, Asset.DOC],
  [SpotPairType.BNBS_DOC]: [Asset.BNB, Asset.DOC],
  [SpotPairType.FISH_DOC]: [Asset.FISH, Asset.DOC],
  [SpotPairType.RIF_DOC]: [Asset.RIF, Asset.DOC],

  [SpotPairType.FISH_SOV]: [Asset.FISH, Asset.SOV],
  [SpotPairType.RIF_SOV]: [Asset.RIF, Asset.SOV],

  [SpotPairType.SOV_ETH]: [Asset.SOV, Asset.ETH],
  [SpotPairType.BNBS_ETH]: [Asset.BNB, Asset.ETH],
  [SpotPairType.FISH_ETH]: [Asset.FISH, Asset.ETH],
  [SpotPairType.RIF_ETH]: [Asset.RIF, Asset.ETH],

  [SpotPairType.USDT_MOC]: [Asset.USDT, Asset.MOC],
  [SpotPairType.BPRO_MOC]: [Asset.BPRO, Asset.MOC],
  [SpotPairType.DOC_MOC]: [Asset.DOC, Asset.MOC],
  [SpotPairType.SOV_MOC]: [Asset.SOV, Asset.MOC],
  [SpotPairType.ETH_MOC]: [Asset.ETH, Asset.MOC],
  [SpotPairType.BNBS_MOC]: [Asset.BNB, Asset.MOC],
  [SpotPairType.FISH_MOC]: [Asset.FISH, Asset.MOC],
  [SpotPairType.RIF_MOC]: [Asset.RIF, Asset.MOC],
  [SpotPairType.RBTC_MOC]: [Asset.RBTC, Asset.MOC],

  [SpotPairType.RBTC_XUSD]: [Asset.RBTC, Asset.XUSD],
  [SpotPairType.USDT_XUSD]: [Asset.USDT, Asset.XUSD],
  [SpotPairType.BPRO_XUSD]: [Asset.BPRO, Asset.XUSD],
  [SpotPairType.DOC_XUSD]: [Asset.DOC, Asset.XUSD],
  [SpotPairType.SOV_XUSD]: [Asset.SOV, Asset.XUSD],
  [SpotPairType.ETH_XUSD]: [Asset.ETH, Asset.XUSD],
  [SpotPairType.MOC_XUSD]: [Asset.MOC, Asset.XUSD],
  [SpotPairType.BNBS_XUSD]: [Asset.BNB, Asset.XUSD],
  [SpotPairType.FISH_XUSD]: [Asset.FISH, Asset.XUSD],
  [SpotPairType.RIF_XUSD]: [Asset.RIF, Asset.XUSD],

  [SpotPairType.BPRO_BNBS]: [Asset.BPRO, Asset.BNB],
  [SpotPairType.SOV_BNBS]: [Asset.SOV, Asset.BNB],
  [SpotPairType.FISH_BNBS]: [Asset.FISH, Asset.BNB],
  [SpotPairType.RIF_BNBS]: [Asset.RIF, Asset.BNB],

  [SpotPairType.BPRO_FISH]: [Asset.BPRO, Asset.FISH],
  [SpotPairType.MOC_FISH]: [Asset.MOC, Asset.FISH],
  [SpotPairType.RIF_FISH]: [Asset.RIF, Asset.FISH],
  [SpotPairType.BNBS_FISH]: [Asset.BNB, Asset.FISH],

  [SpotPairType.MOC_RBTC]: [Asset.MOC, Asset.RBTC],
  [SpotPairType.ETH_RBTC]: [Asset.ETH, Asset.RBTC],
  [SpotPairType.BNBS_RBTC]: [Asset.BNB, Asset.RBTC],
  [SpotPairType.FISH_RBTC]: [Asset.FISH, Asset.RBTC],
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.RIF_RBTC]: [Asset.RIF, Asset.RBTC],

  [SpotPairType.BNBS_RIF]: [Asset.BNB, Asset.RIF],
  [SpotPairType.MOC_RIF]: [Asset.MOC, Asset.RIF],
  [SpotPairType.BPRO_RIF]: [Asset.BPRO, Asset.RIF],

  [SpotPairType.RIF_DOC]: [Asset.RIF, Asset.DOC],
};

export const pairList = Object.keys(pairs);

export const allPairs = {
  ...pairs,
  [SpotPairType.USDT_RBTC]: [Asset.USDT, Asset.RBTC],
  [SpotPairType.USDT_BPRO]: [Asset.USDT, Asset.BPRO],
  [SpotPairType.USDT_SOV]: [Asset.USDT, Asset.SOV],
  [SpotPairType.USDT_ETH]: [Asset.USDT, Asset.ETH],
  [SpotPairType.USDT_XUSD]: [Asset.USDT, Asset.XUSD],
  [SpotPairType.USDT_BNBS]: [Asset.USDT, Asset.BNB],
  [SpotPairType.USDT_FISH]: [Asset.USDT, Asset.FISH],
  [SpotPairType.USDT_RIF]: [Asset.USDT, Asset.RIF],

  [SpotPairType.BPRO_RBTC]: [Asset.BPRO, Asset.RBTC],
  [SpotPairType.BPRO_SOV]: [Asset.BPRO, Asset.SOV],
  [SpotPairType.BPRO_ETH]: [Asset.BPRO, Asset.ETH],
  [SpotPairType.BPRO_BNBS]: [Asset.BPRO, Asset.BNB],
  [SpotPairType.BPRO_FISH]: [Asset.BPRO, Asset.FISH],
  [SpotPairType.BPRO_RIF]: [Asset.BPRO, Asset.RIF],

  [SpotPairType.DOC_RBTC]: [Asset.DOC, Asset.RBTC],
  [SpotPairType.DOC_USDT]: [Asset.DOC, Asset.USDT],
  [SpotPairType.DOC_BPRO]: [Asset.DOC, Asset.BPRO],
  [SpotPairType.DOC_SOV]: [Asset.DOC, Asset.SOV],
  [SpotPairType.DOC_ETH]: [Asset.DOC, Asset.ETH],
  [SpotPairType.DOC_XUSD]: [Asset.DOC, Asset.XUSD],
  [SpotPairType.DOC_BNBS]: [Asset.DOC, Asset.BNB],
  [SpotPairType.DOC_FISH]: [Asset.DOC, Asset.FISH],
  [SpotPairType.DOC_RIF]: [Asset.DOC, Asset.RIF],

  [SpotPairType.SOV_FISH]: [Asset.SOV, Asset.FISH],
  [SpotPairType.SOV_RIF]: [Asset.SOV, Asset.RIF],

  [SpotPairType.ETH_SOV]: [Asset.ETH, Asset.SOV],
  [SpotPairType.ETH_BNBS]: [Asset.ETH, Asset.BNB],
  [SpotPairType.ETH_FISH]: [Asset.ETH, Asset.FISH],
  [SpotPairType.ETH_RIF]: [Asset.ETH, Asset.RIF],

  [SpotPairType.MOC_USDT]: [Asset.MOC, Asset.USDT],
  [SpotPairType.MOC_BPRO]: [Asset.MOC, Asset.BPRO],
  [SpotPairType.MOC_DOC]: [Asset.MOC, Asset.DOC],
  [SpotPairType.MOC_SOV]: [Asset.MOC, Asset.SOV],
  [SpotPairType.MOC_ETH]: [Asset.MOC, Asset.ETH],
  [SpotPairType.MOC_BNBS]: [Asset.MOC, Asset.BNB],
  [SpotPairType.MOC_FISH]: [Asset.MOC, Asset.FISH],
  [SpotPairType.MOC_RIF]: [Asset.MOC, Asset.RIF],

  [SpotPairType.XUSD_RBTC]: [Asset.XUSD, Asset.RBTC],
  [SpotPairType.XUSD_USDT]: [Asset.XUSD, Asset.USDT],
  [SpotPairType.XUSD_BPRO]: [Asset.XUSD, Asset.BPRO],
  [SpotPairType.XUSD_DOC]: [Asset.XUSD, Asset.DOC],
  [SpotPairType.XUSD_SOV]: [Asset.XUSD, Asset.SOV],
  [SpotPairType.XUSD_ETH]: [Asset.XUSD, Asset.ETH],
  [SpotPairType.XUSD_MOC]: [Asset.XUSD, Asset.MOC],
  [SpotPairType.XUSD_BNBS]: [Asset.XUSD, Asset.BNB],
  [SpotPairType.XUSD_FISH]: [Asset.XUSD, Asset.FISH],
  [SpotPairType.XUSD_RIF]: [Asset.XUSD, Asset.RIF],

  [SpotPairType.BNBS_BPRO]: [Asset.BNB, Asset.BPRO],
  [SpotPairType.BNBS_SOV]: [Asset.BNB, Asset.SOV],
  [SpotPairType.BNBS_FISH]: [Asset.BNB, Asset.FISH],
  [SpotPairType.BNBS_RIF]: [Asset.BNB, Asset.RIF],

  [SpotPairType.FISH_BPRO]: [Asset.FISH, Asset.BPRO],
  [SpotPairType.FISH_MOC]: [Asset.FISH, Asset.MOC],
  [SpotPairType.FISH_RIF]: [Asset.FISH, Asset.RIF],
  [SpotPairType.FISH_BNBS]: [Asset.FISH, Asset.BNB],

  [SpotPairType.RIF_BPRO]: [Asset.RIF, Asset.BPRO],
  [SpotPairType.RIF_MOC]: [Asset.RIF, Asset.MOC],
  [SpotPairType.RIF_BNBS]: [Asset.RIF, Asset.BNB],

  [SpotPairType.RBTC_SOV]: [Asset.RBTC, Asset.SOV],
  [SpotPairType.RBTC_ETH]: [Asset.RBTC, Asset.ETH],
  [SpotPairType.RBTC_BNBS]: [Asset.RBTC, Asset.BNB],
  [SpotPairType.RBTC_FISH]: [Asset.RBTC, Asset.FISH],
  [SpotPairType.RBTC_RIF]: [Asset.RBTC, Asset.RIF],
};

export const allPairList = Object.keys(allPairs);

export interface SpotTradingPageState {
  pairType: SpotPairType;
  amount: string;
}

export interface TradingPairs {
  [0]: IPairData;
  [1]: IPairData;
  RBTC_source?: string;
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

export type LimitOrder = {
  hash?: string;
  maker: string;
  fromToken: string;
  toToken: string;
  amountIn: BigNumber;
  amountOutMin: BigNumber;
  recipient: string;
  deadline: BigNumber;
  created: BigNumber;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filledAmount?: string;
};

export interface ITradeFormProps {
  sourceToken: Asset;
  targetToken: Asset;
  tradeType: TradingTypes;
  hidden: boolean;
}

/* --- STATE --- */
import { Asset } from 'types/asset';

export enum SpotPairType {
  SOV_RBTC = 'SOV_RBTC',
  RBTC_SOV = 'RBTC_SOV',
}

export const pairs = {
  [SpotPairType.SOV_RBTC]: [Asset.SOV, Asset.RBTC],
  [SpotPairType.RBTC_SOV]: [Asset.RBTC, Asset.SOV],
};

export const pairList = [SpotPairType.SOV_RBTC, SpotPairType.RBTC_SOV];

export interface SpotTradingPageState {
  pairType: SpotPairType;
  amount: string;
  collateral: Asset;
}

export enum TradingTypes {
  BUY = 'BUY',
  SELL = 'SELL',
}

export type ContainerState = SpotTradingPageState;

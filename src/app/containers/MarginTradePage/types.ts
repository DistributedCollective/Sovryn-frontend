/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';

export interface MarginTradePageState {
  pairType: TradingPairType;
  collateral: Asset;
}

export type ContainerState = MarginTradePageState;

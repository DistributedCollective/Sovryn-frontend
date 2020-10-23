/* --- STATE --- */
import { TradingPairType } from '../../../utils/trading-pair-dictionary';

export interface TradingPageState {
  tradingPair: TradingPairType;
}

export type ContainerState = TradingPageState;

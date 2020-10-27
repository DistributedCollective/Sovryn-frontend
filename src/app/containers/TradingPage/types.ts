/* --- STATE --- */
import { TradingPairType } from 'utils/trading-pair-dictionary';

export interface TradingPageState {
  tradingPair: TradingPairType;
  isMobileStatsOpen: boolean;
}

export type ContainerState = TradingPageState;

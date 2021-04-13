/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';

export interface TradingPageState {
  tradingPair: TradingPairType;
  swapPair: string;
  tab: TabType;
  isMobileStatsOpen: boolean;
}

export type ContainerState = TradingPageState;

export enum TabType {
  TRADE = 'trade',
  SWAP = 'swap',
}

/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { IPairData } from '../LandingPage/components/CryptocurrencyPrices/types';

export interface MarginTradePageState {
  pairType: TradingPairType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
}

export interface TradingPairs {
  [0]: IPairData;
  [1]: IPairData;
  RBTC_source?: string;
}

export type ContainerState = MarginTradePageState;

/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';

export interface MarginTradePageState {
  pairType: TradingPairType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
}

export type ContainerState = MarginTradePageState;

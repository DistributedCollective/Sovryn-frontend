import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpatual-pair-dictionary';

export interface PerpetualsPageState {
  pairType: PerpetualPairType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
}

export type ContainerState = PerpetualsPageState;

import { PerpetualTrade } from '../../types';
import { PerpetualPairType } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';

export enum EditPositionSizeDialogStep {
  trade = 'trade',
  slippage = 'slippage',
}

export type EditPositionSizeDialogState = {
  pairType: PerpetualPairType;
  trade?: PerpetualTrade;
  changedTrade?: PerpetualTrade;
  onChange: (trade: PerpetualTrade) => void;
};

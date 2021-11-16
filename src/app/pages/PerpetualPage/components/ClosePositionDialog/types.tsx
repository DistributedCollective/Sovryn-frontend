import { PerpetualTrade } from '../../types';

export enum EditPositionSizeDialogStep {
  trade = 'trade',
  slippage = 'slippage',
}

export type EditPositionSizeDialogState = {
  trade?: PerpetualTrade;
  changedTrade?: PerpetualTrade;
  onChange: (trade: PerpetualTrade) => void;
};

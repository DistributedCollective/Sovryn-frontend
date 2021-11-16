import { PerpetualTrade } from '../../types';

export enum ClosePositionDialogStep {
  trade = 'trade',
  slippage = 'slippage',
}

export type ClosePositionDialogState = {
  trade?: PerpetualTrade;
  changedTrade?: PerpetualTrade;
  onChange: (trade: PerpetualTrade) => void;
};

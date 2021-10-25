import { PerpetualTrade } from '../../types';

export enum NewPositionCardStep {
  unconnected = 'unconnected',
  trade = 'trade',
  slippage = 'slippage',
}

export type NewPositionCardContextType = {
  trade: PerpetualTrade;
  onChangeTrade: (trade: PerpetualTrade) => void;
  onSubmit: () => void;
};

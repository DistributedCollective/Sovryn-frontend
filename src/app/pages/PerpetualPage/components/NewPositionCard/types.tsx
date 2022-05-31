import { PerpetualTrade } from '../../types';
import { SetStateAction, Dispatch } from 'react';

export enum NewPositionCardStep {
  unconnected = 'unconnected',
  trade = 'trade',
  slippage = 'slippage',
}

export type NewPositionCardContextType = {
  hasOpenPosition: boolean;
  hasEmptyBalance: boolean;
  trade: PerpetualTrade;
  setTrade: Dispatch<SetStateAction<PerpetualTrade>>;
  onSubmit: (trade: PerpetualTrade) => void;
};

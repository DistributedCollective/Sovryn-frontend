import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { TradingPairType } from '../../../utils/dictionaries/trading-pair-dictionary';
import { Asset } from '../../../types/asset';

// The initial state of the MarginTradePage container
export const initialState: ContainerState = {
  pairType: TradingPairType.BTC_USDT,
  collateral: Asset.BTC,
};

const marginTradePageSlice = createSlice({
  name: 'marginTradePage',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = marginTradePageSlice;

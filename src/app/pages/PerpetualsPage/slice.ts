import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { Asset } from '../../../types';
import type { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpatual-pair-dictionary';

// The initial state of the MarginTradePage container
export const initialState: ContainerState = {
  pairType: PerpetualPairType.BTCUSD,
  collateral: Asset.RBTC,
  amount: '0',
  leverage: 2,
  position: (undefined as unknown) as TradingPosition,
};

const perpetualsPageSlice = createSlice({
  name: 'perpetualsPage',
  initialState,
  reducers: {
    setPairType(state, { payload }: PayloadAction<PerpetualPairType>) {
      state.pairType = payload;
    },
    setCollateral(state, { payload }: PayloadAction<Asset>) {
      state.collateral = payload;
    },
    setLeverage(state, { payload }: PayloadAction<number>) {
      state.leverage = payload;
    },
    setAmount(state, { payload }: PayloadAction<string>) {
      state.amount = payload;
    },
    submit(state, { payload }: PayloadAction<TradingPosition>) {
      state.position = payload;
    },
    closeTradingModal(state) {
      state.position = (undefined as unknown) as TradingPosition;
    },
  },
});

export const { actions, reducer, name: sliceKey } = perpetualsPageSlice;

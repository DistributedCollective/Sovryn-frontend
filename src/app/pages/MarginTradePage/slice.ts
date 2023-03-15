import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { IMarginTradePageState, MarginLimitOrder } from './types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';

export const initialState: IMarginTradePageState = {
  pairType: TradingPairType.RBTC_XUSD,
  collateral: Asset.RBTC,
  amount: '0',
  leverage: 2,
  position: TradingPosition.LONG,
  pendingLimitOrders: [],
};

const marginTradePageSlice = createSlice({
  name: 'marginTradePage',
  initialState,
  reducers: {
    setPairType(state, { payload }: PayloadAction<TradingPairType>) {
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
    closeTradingModal(state, { payload }: PayloadAction<TradingPosition>) {
      state.position = payload;
    },
    addPendingLimitOrders(state, { payload }: PayloadAction<MarginLimitOrder>) {
      state.pendingLimitOrders = [...state.pendingLimitOrders, payload];
    },
  },
});

export const { actions, reducer, name: sliceKey } = marginTradePageSlice;

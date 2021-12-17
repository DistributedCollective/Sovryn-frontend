import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, NotificationUser } from './types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';

// The initial state of the MarginTradePage container
export const initialState: ContainerState = {
  pairType: TradingPairType.SOV_RBTC,
  collateral: Asset.RBTC,
  amount: '0',
  leverage: 2,
  position: TradingPosition.LONG,

  notificationToken: '',
  notificationUser: undefined,
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
    setNotificationToken(state, { payload }: PayloadAction<string>) {
      state.notificationToken = payload;
    },
    setNotificationUser(
      state,
      { payload }: PayloadAction<NotificationUser | undefined>,
    ) {
      state.notificationUser = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = marginTradePageSlice;

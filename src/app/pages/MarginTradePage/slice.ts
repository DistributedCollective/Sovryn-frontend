import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import {
  IMarginTradePageState,
  MarginLimitOrder,
  NotificationPayload,
  NotificationUser,
} from './types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';

export const initialState: IMarginTradePageState = {
  pairType: TradingPairType.SOV_RBTC,
  collateral: Asset.RBTC,
  amount: '0',
  leverage: 2,
  position: TradingPosition.LONG,
  notificationWallet: '',
  notificationToken: '',
  notificationUser: undefined,
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
    setNotificationToken(
      state,
      { payload }: PayloadAction<NotificationPayload>,
    ) {
      state.notificationToken = payload.token;
      state.notificationWallet = payload.wallet;
    },
    setNotificationUser(
      state,
      { payload }: PayloadAction<NotificationUser | undefined>,
    ) {
      state.notificationUser = payload;
    },
    resetNotification(state) {
      state.notificationToken = '';
      state.notificationWallet = '';
      state.notificationUser = undefined;
    },
    addPendingLimitOrders(state, { payload }: PayloadAction<MarginLimitOrder>) {
      console.log('payload:', payload);
      state.pendingLimitOrders = [...state.pendingLimitOrders, payload];
    },
  },
});

export const { actions, reducer, name: sliceKey } = marginTradePageSlice;

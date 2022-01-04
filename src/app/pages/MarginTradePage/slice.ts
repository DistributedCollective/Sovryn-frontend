import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, NotificationPayload, NotificationUser } from './types';
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

  notificationWallet: '',
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
  },
});

export const { actions, reducer, name: sliceKey } = marginTradePageSlice;

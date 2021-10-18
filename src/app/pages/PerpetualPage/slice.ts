import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import {
  ContainerState,
  PerpetualPageModals,
  PerpetualTradeType,
} from './types';
import { Asset } from '../../../types';
import { TradingPosition } from '../../../types/trading-position';
import { PerpetualPairType } from '../../../utils/dictionaries/perpetual-pair-dictionary';

// The initial state of the MarginTradePage container
export const initialState: ContainerState = {
  pairType: PerpetualPairType.BTCUSD,
  tradeType: PerpetualTradeType.MARKET,
  collateral: Asset.RBTC,
  amount: '0',
  limit: '0',
  leverage: 2,
  position: TradingPosition.LONG,
  modal: PerpetualPageModals.NONE,
};

const perpetualPageSlice = createSlice({
  name: 'perpetualPage',
  initialState,
  reducers: {
    setPairType(state, { payload }: PayloadAction<PerpetualPairType>) {
      state.pairType = payload;
    },
    setTradeType(state, { payload }: PayloadAction<PerpetualTradeType>) {
      state.tradeType = payload;
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
    setLimit(state, { payload }: PayloadAction<string>) {
      state.limit = payload;
    },
    setPosition(state, { payload }: PayloadAction<TradingPosition>) {
      state.position = payload;
    },
    setModal(state, { payload }: PayloadAction<PerpetualPageModals>) {
      state.modal = payload;
    },
    reset(state) {
      state.amount = '';
    },
  },
});

export const { actions, reducer, name: sliceKey } = perpetualPageSlice;

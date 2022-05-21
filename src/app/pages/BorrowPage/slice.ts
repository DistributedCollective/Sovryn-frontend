import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';
import { Asset } from '../../../types/asset';

// The initial state of the WalletConnector container
export const initialState: ContainerState = {
  asset: Asset.RBTC,
  collateral: null,
  lendAmount: '',
  borrowAmount: '',
  repayItem: null,
  addItem: null,
  repayModalOpen: false,
  addModalOpen: false,
};

const lendBorrowSovrynSlice = createSlice({
  name: 'lendBorrowSovryn',
  initialState,
  reducers: {
    changeAsset(state, { payload }: PayloadAction<Asset>) {
      state.asset = payload;
    },
    changeCollateral(state, { payload }: PayloadAction<Asset>) {
      state.collateral = payload;
    },
    changeBorrowAmount(state, { payload }: PayloadAction<string>) {
      state.borrowAmount = payload;
    },
    openRepayModal(state, { payload }: PayloadAction<string>) {
      state.repayItem = payload;
      state.repayModalOpen = true;
    },
    closeRepayModal(state) {
      state.repayItem = null;
      state.repayModalOpen = false;
    },
    openAddModal(state, { payload }: PayloadAction<string>) {
      state.addItem = payload;
      state.addModalOpen = true;
    },
    closeAddModal(state) {
      state.addItem = null;
      state.addModalOpen = false;
    },
  },
});

export const { actions, reducer, name: sliceKey } = lendBorrowSovrynSlice;

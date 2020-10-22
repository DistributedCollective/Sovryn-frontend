import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, SwapTransactionForm } from './types';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';

// The initial state of the TokenSwapContainer container
export const initialState: ContainerState = {
  sourceToken: AssetsDictionary.get(Asset.BTC).getTokenContractAddress(),
  targetToken: AssetsDictionary.get(Asset.DOC).getTokenContractAddress(),
  amount: '1',
  path: [],
  rateByPath: '0',
  transactions: [],
};

const tokenSwapContainerSlice = createSlice({
  name: 'tokenSwapContainer',
  initialState,
  reducers: {
    changeAmount(state, { payload }: PayloadAction<string>) {
      state.amount = payload;
    },
    changeSourceToken(state, { payload }: PayloadAction<string>) {
      state.sourceToken = payload;
    },
    changeTargetToken(state, { payload }: PayloadAction<string>) {
      state.targetToken = payload;
    },
    changePath(state, { payload }: PayloadAction<Array<string>>) {
      state.path = payload;
    },
    submitForm(state, { payload }: PayloadAction<SwapTransactionForm>) {},
    requestRate(
      state,
      { payload }: PayloadAction<{ path: string[]; amount: string }>,
    ) {},
    requestRateSuccess(state, { payload }: PayloadAction<string>) {
      state.rateByPath = payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = tokenSwapContainerSlice;

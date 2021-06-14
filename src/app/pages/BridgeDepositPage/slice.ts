import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, DepositStep, TxStep } from './types';
import { Chain } from '../../../types';
import { CrossBridgeAsset } from './types/cross-bridge-asset';

// The initial state of the BridgeDepositPage container
export const initialState: ContainerState = {
  step: DepositStep.CHAIN_SELECTOR,
  txStep: TxStep.NONE,
  chain: null,
  targetChain: Chain.RSK,
  targetAsset: null,
  sourceAsset: null,
  receiver: '',
  amount: '',
};

const bridgeDepositPageSlice = createSlice({
  name: 'bridgeDepositPage',
  initialState,
  reducers: {
    selectNetwork(
      state,
      action: PayloadAction<{ chain: Chain; walletContext }>,
    ) {
      state.chain = action.payload.chain;
    },
    selectTargetNetwork(state, action: PayloadAction<Chain>) {
      state.targetChain = action.payload;
    },
    selectTargetAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.targetAsset = action.payload;
    },
    selectSourceAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.sourceAsset = action.payload;
      state.amount = '';
      state.step = DepositStep.AMOUNT_SELECTOR;
    },
    selectAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
      state.step = DepositStep.REVIEW;
    },
    selectReceiver(state, action: PayloadAction<string>) {
      state.receiver = action.payload;
    },
    setStep(state, action: PayloadAction<DepositStep>) {
      state.step = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = bridgeDepositPageSlice;

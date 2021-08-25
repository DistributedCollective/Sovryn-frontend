import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, WithdrawStep } from './types';
import { Chain } from '../../../types';
import { TxStep } from '../BridgeDepositPage/types';
import { CrossBridgeAsset } from '../BridgeDepositPage/types/cross-bridge-asset';

// The initial state of the BridgeDepositPage container
export const initialState: ContainerState = {
  step: WithdrawStep.CHAIN_SELECTOR,
  chain: Chain.RSK,
  targetChain: Chain.ETH,
  targetAsset: null,
  sourceAsset: null,
  receiver: '',
  amount: '',
  tx: {
    step: TxStep.NONE,
    loading: false,
    hash: '',
    approveHash: '',
  },
};

const bridgeDepositPageSlice = createSlice({
  name: 'bridgeWithdrawPage',
  initialState,
  reducers: {
    selectSourceNetwork(state, { payload }: PayloadAction<Chain>) {
      state.chain = payload;
    },
    selectTargetNetwork(state, action: PayloadAction<Chain>) {
      state.targetChain = action.payload;
      state.step = WithdrawStep.TOKEN_SELECTOR;
      state.tx.loading = false;
    },
    selectTargetAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.targetAsset = action.payload;
      state.amount = '';
      state.step = WithdrawStep.AMOUNT_SELECTOR;
      state.tx.loading = false;
    },
    selectSourceAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.sourceAsset = action.payload;
      state.tx.loading = false;
    },
    selectAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
      state.step = WithdrawStep.RECEIVER_SELECTOR;
      state.tx.loading = false;
    },
    initReceiver(state, { payload }: PayloadAction<string>) {
      state.receiver = payload;
      state.tx.loading = false;
    },
    selectReceiver(state, action: PayloadAction<string>) {
      state.receiver = action.payload;
      state.tx.loading = false;
      state.step = WithdrawStep.REVIEW;
    },
    setStep(state, action: PayloadAction<WithdrawStep>) {
      state.step = action.payload;
    },
    submitForm(state) {
      state.tx.loading = true;
      state.tx.step = TxStep.MAIN;
      state.tx.hash = '';
      state.tx.approveHash = '';
    },
    confirmTransfer(
      state,
      { payload }: PayloadAction<{ approveHash?: string; nonce?: number }>,
    ) {
      state.tx.loading = true;
      state.tx.step = TxStep.CONFIRM_TRANSFER;
      state.tx.hash = '';
      state.tx.approveHash = payload?.approveHash || '';
    },
    approveTokens(state) {
      state.tx.loading = true;
      state.tx.step = TxStep.APPROVE;
      state.tx.hash = '';
      state.tx.approveHash = '';
    },
    pendingTransfer(state, { payload }: PayloadAction<string>) {
      state.tx.loading = true;
      state.step = WithdrawStep.PROCESSING;
      state.tx.step = TxStep.PENDING_TRANSFER;
      state.tx.hash = payload;
    },
    confirmedTransfer(state) {
      state.tx.loading = false;
      state.tx.step = TxStep.COMPLETED_TRANSFER;
      state.step = WithdrawStep.COMPLETE;
    },

    failedTransfer(state) {
      state.tx.loading = false;
      state.tx.step = TxStep.FAILED_TRANSFER;
    },
    closeTransfer(state) {
      state.tx.loading = false;
      state.tx.step = TxStep.NONE;
      state.tx.hash = '';
      state.tx.approveHash = '';
      state.amount = '';
      state.sourceAsset = null;
      state.receiver = '';
      state.chain = Chain.RSK;
    },
    forceTransferState(state, { payload }: PayloadAction<TxStep>) {
      state.tx.step = payload;
    },
    init() {},
    close() {},
    reset(state) {
      state.step = WithdrawStep.CHAIN_SELECTOR;
      state.chain = Chain.RSK;
      state.targetChain = null;
      state.targetAsset = null;
      state.sourceAsset = null;
      state.receiver = '';
      state.amount = '';
      state.tx = {
        step: TxStep.NONE,
        loading: false,
        hash: '',
        approveHash: '',
      };
    },
  },
});

export const { actions, reducer, name: sliceKey } = bridgeDepositPageSlice;

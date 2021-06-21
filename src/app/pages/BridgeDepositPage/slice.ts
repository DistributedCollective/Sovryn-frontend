import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState, DepositStep, TxStep } from './types';
import { Chain } from '../../../types';
import { CrossBridgeAsset } from './types/cross-bridge-asset';

// The initial state of the BridgeDepositPage container
export const initialState: ContainerState = {
  step: DepositStep.CHAIN_SELECTOR,
  chain: null,
  targetChain: Chain.RSK,
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
  requestedReturnToPortfolio: false,
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
      state.tx.loading = false;
    },
    selectSourceNetwork(state, { payload }: PayloadAction<Chain>) {
      state.chain = payload;
    },
    selectTargetNetwork(state, action: PayloadAction<Chain>) {
      state.targetChain = action.payload;
      state.tx.loading = false;
    },
    selectTargetAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.targetAsset = action.payload;
      state.tx.loading = false;
    },
    selectSourceAsset(state, action: PayloadAction<CrossBridgeAsset>) {
      state.sourceAsset = action.payload;
      state.amount = '';
      state.step = DepositStep.AMOUNT_SELECTOR;
      state.tx.loading = false;
    },
    selectAmount(state, action: PayloadAction<string>) {
      state.amount = action.payload;
      state.step = DepositStep.REVIEW;
      state.tx.loading = false;
    },
    selectReceiver(state, action: PayloadAction<string>) {
      state.receiver = action.payload;
      state.tx.loading = false;
    },
    setStep(state, action: PayloadAction<DepositStep>) {
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
      state.step = DepositStep.PROCESSING;
      state.tx.step = TxStep.PENDING_TRANSFER;
      state.tx.hash = payload;
    },
    confirmedTransfer(state) {
      state.tx.loading = false;
      state.tx.step = TxStep.COMPLETED_TRANSFER;
      state.step = DepositStep.COMPLETE;
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
      state.chain = null;
    },
    forceTransferState(state, { payload }: PayloadAction<TxStep>) {
      state.tx.step = payload;
    },
    returnToPortfolio(state) {
      state.requestedReturnToPortfolio = true;
    },
    init() {},
    close() {},
    reset(state) {
      state.step = DepositStep.CHAIN_SELECTOR;
      state.chain = null;
      state.targetChain = Chain.RSK;
      state.targetAsset = null;
      state.sourceAsset = null;
      state.receiver = '';
      state.amount = '';
      state.requestedReturnToPortfolio = false;
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

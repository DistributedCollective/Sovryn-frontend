/* --- STATE --- */
import type { Chain, Nullable } from 'types';
import type { CrossBridgeAsset } from './types/cross-bridge-asset';

export interface BridgeDepositPageState {
  step: DepositStep;
  chain: Nullable<Chain>;
  targetChain: Chain;
  targetAsset: Nullable<CrossBridgeAsset>;
  sourceAsset: Nullable<CrossBridgeAsset>;
  receiver: string;
  amount: string;
  tx: TxState;
  requestedReturnToPortfolio: boolean;
}

export enum DepositStep {
  CHAIN_SELECTOR,
  WALLET_SELECTOR,
  TOKEN_SELECTOR,
  AMOUNT_SELECTOR,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETE,
}

export interface TxState {
  loading: boolean;
  hash: string;
  approveHash: string;
  step: TxStep;
}

export enum TxStep {
  NONE,
  MAIN,
  APPROVE,
  CONFIRM_TRANSFER,
  PENDING_TRANSFER,
  COMPLETED_TRANSFER,
  FAILED_TRANSFER,
  USER_DENIED,
}

export type ContainerState = BridgeDepositPageState;

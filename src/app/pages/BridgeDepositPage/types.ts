/* --- STATE --- */
import type { Chain, Nullable } from 'types';
import type { CrossBridgeAsset } from './types/cross-bridge-asset';

export interface BridgeDepositPageState {
  step: DepositStep;
  txStep: TxStep;
  chain: Nullable<Chain>;
  targetChain: Chain;
  targetAsset: Nullable<CrossBridgeAsset>;
  sourceAsset: Nullable<CrossBridgeAsset>;
  receiver: string;
  amount: string;
}

export enum DepositStep {
  CHAIN_SELECTOR,
  TOKEN_SELECTOR,
  AMOUNT_SELECTOR,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETE,
}

export enum TxStep {
  NONE,
  APPROVE,
  CONFIRM,
}

export type ContainerState = BridgeDepositPageState;

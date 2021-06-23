/* --- STATE --- */
import type { Chain, Nullable } from 'types';
import type { TxState } from '../BridgeDepositPage/types';
import type { CrossBridgeAsset } from '../BridgeDepositPage/types/cross-bridge-asset';

export interface BridgeWithdrawPageState {
  step: WithdrawStep;
  chain: Chain;
  targetChain: Nullable<Chain>;
  targetAsset: Nullable<CrossBridgeAsset>;
  sourceAsset: Nullable<CrossBridgeAsset>;
  receiver: string;
  amount: string;
  tx: TxState;
}

export enum WithdrawStep {
  CHAIN_SELECTOR,
  TOKEN_SELECTOR,
  AMOUNT_SELECTOR,
  RECEIVER_SELECTOR,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETE,
}

export type ContainerState = BridgeWithdrawPageState;

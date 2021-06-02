/* --- STATE --- */
import { Chain, Asset } from 'types';

export interface BridgeDepositPageState {
  step: DepositStep;
  chain: Chain;
  targetAsset: Asset;
  sourceAsset: Asset; // todo aggregator tokens.
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

export type ContainerState = BridgeDepositPageState;

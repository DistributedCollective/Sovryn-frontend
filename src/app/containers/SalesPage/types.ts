/* --- STATE --- */
import { Nullable } from 'types';

export interface SalesPageState {
  step: number;
  maxDeposit: number;
  minDeposit: number;
  upgradeLoading: boolean;
  btcAddressLoading: boolean;
  btcAddress: Nullable<string>;
  btcMin: number;
  btcMax: number;
  btcDeposit: Nullable<BtcDeposit>;
  transferDeposit: Nullable<BtcDeposit>;
  codeTx: Nullable<string>;
  codeError: Nullable<string>;
}

export type ContainerState = SalesPageState;

export interface BtcDeposit {
  status: string;
  txHash: string;
  value: string;
}

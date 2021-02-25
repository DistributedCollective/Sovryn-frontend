/* --- STATE --- */
export interface FastBtcDialogState {
  step: Step;
  txId: TxId;
  ready: boolean;
  deposit: DepositState;
  depositTx: TxState;
  transferTx: TxState;
  limits: Limits;
}

export type ContainerState = FastBtcDialogState;

export enum Step {
  MAIN,
  WALLET,
  TRANSACTION,
}

export enum TxId {
  DEPOSIT,
  TRANSFER,
}

export interface DepositState {
  loading: boolean;
  address: string;
}

export interface TxState {
  txHash: string;
  value: number;
  status: string;
}

export interface Limits {
  min: number;
  max: number;
}

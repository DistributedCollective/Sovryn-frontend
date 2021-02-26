/* --- STATE --- */
export interface FastBtcDialogState {
  step: Step;
  txId: TxId;
  ready: boolean;
  deposit: DepositState;
  depositTx: TxState;
  transferTx: TxState;
  limits: Limits;
  history: TxHistory;
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
  receiver: string;
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

export interface TxHistory {
  items: HistoryItem[];
  loading: boolean;
}

export interface HistoryItem {
  id: number;
  dateAdded: string;
  btcadr: string;
  web3adr: string;
  status: string;
  txHash: string;
  type: string;
  valueBtc: number;
}

import { Nullable } from '../../types';

export type TxData = {
  to: string;
  from: string;
  input: string;
  gas: number;
  gas_price: string;
  value: string;
};

export type TxTuple = [TxData] | [TxData, TxData]; // tuple, allow only 1 or 2 items in array.

type Simulation =
  | {
      id: string;
    }
  | {};

type ErrorInfo = {
  error_message: string;
  address: string;
};

type LogData = {
  anonymous: boolean;
  inputs: Nullable;
  name: string;
  raw: { address: string; data: string; topics: string[] };
};

type StackTrace = {
  code: Nullable;
  contract: string;
  error: string;
  file_index: Nullable;
  length: Nullable;
  line: Nullable;
  name: Nullable;
  op: string;
};

type StateDiff = {
  dirty: Nullable;
  original: Nullable;
  raw: { address: string; dirty: string; key: string; original: string }[];
  soltype: Nullable;
};

type TransactionInfo = {
  block_number: number;
  call_trace: any;
  console_logs: Nullable;
  contract_address: string;
  contract_id: string;
  created_at: string;
  intrinsic_gas: number;
  logs: Nullable<LogData[]>;
  method: Nullable<string>;
  parameters: Nullable;
  raw_state_diff: Nullable;
  refund_gas: number;
  stack_trace: StackTrace[];
  state_diff: Nullable<StateDiff[]>;
  transaction_id: string;
};

type Transaction = {
  access_list: Nullable;
  addresses: Nullable<string[]>;
  block_hash: string;
  block_number: number;
  contract_ids: Nullable<string[]>;
  cumulative_gas_used: number;
  decoded_input: Nullable<string>;
  effective_gas_price: number;
  error_info?: Nullable<ErrorInfo>;
  error_message?: Nullable<string>;
  from: string;
  function_selector: string;
  gas: number;
  gas_fee_cap: number;
  gas_price: number;
  gas_tip_cap: number;
  gas_used: number;
  hash: string;
  index: number;
  input: string;
  method: string;
  network_id: string;
  nonce: number;
  status: boolean;
  timestamp: string;
  to: string;
  transaction_info: TransactionInfo;
  value: string;
};

export type SimulatorResponse = [SimulatedTx] | [SimulatedTx, SimulatedTx];

export type SimulatedTx = {
  contracts: string[];
  generated_access_list: string[];
  simulation: Simulation;
  transaction: Transaction;
};

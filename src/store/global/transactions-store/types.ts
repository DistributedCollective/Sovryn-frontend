/* --- STATE --- */
import { Nullable } from 'types';
import { Asset } from 'types/asset';

export interface TransactionsStoreState {
  transactionStack: string[];
  transactions: Transactions;
  loading: boolean;
  requestDialog: RequestDialogState;
}

export type ContainerState = TransactionsStoreState;

export enum TxType {
  STAKING_STAKE = 'staking-stake',
  STAKING_WITHDRAW = 'staking-withdraw',
  STAKING_EXTEND = 'staking-extend',
  STAKING_DELEGATE = 'staking-delegate',
  VESTING_DELEGATE = 'vesting-delegate',
  STAKING_INCREASE_STAKE = 'staking',
  STAKING_REWARDS_CLAIM = 'staking_rewards_claim',
  STAKING_LIQUID_SOV_CLAIM = 'staking_liquid_sov_claim',
  NONE = 'none',
  APPROVE = 'approve',
  LEND = 'lend',
  UNLEND = 'unlend',
  TRADE = 'trade',
  PERPETUAL_OPEN = 'perpetual-open',
  PERPETUAL_CLOSE = 'perpetual-close',
  CLOSE_WITH_DEPOSIT = 'close_with_deposit',
  CLOSE_WITH_SWAP = 'close_with_swap',
  BORROW = 'borrow',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
  DEPOSIT_COLLATERAL = 'deposit_collateral',
  OPEN_PERPETUAL_TRADE = 'open_perpetual_trade',
  WITHDRAW_COLLATERAL = 'withdraw_collateral',
  CONVERT_BY_PATH = 'convert_by_path', // swap
  SWAP_EXTERNAL = 'swap_external',
  OTHER = 'other',
  SALE_BUY_SOV = 'sale_buy_sov',
  SOV_REIMBURSE = 'sov_reimburse',
  SOV_CONVERT = 'sov_convert',
  SOV_ORIGIN_CLAIM = 'sov_origin_claim',
  SOV_WITHDRAW_VESTING = 'sov_withdraw_vesting',
  ESCROW_SOV_DEPOSIT = 'escrow_sov_deposit',
  LM_DEPOSIT = 'lm_deposit',
  LOCKED_SOV_CLAIM = 'locked_sov_claim',
  ORIGINS_SALE_BUY = 'origins_sale_buy',
  CONVERT_RUSDT_TO_XUSD = 'convert_rusdt_to_xusd',
  LOCKED_FUND_WAITED_CLAIM = 'locked_fund_waited_claim',
  LOCKED_FUND_CREATE_STAKE = 'locked_fund_create_stake',
  CROSS_CHAIN_DEPOSIT = 'cross_chain_deposit',
  CROSS_CHAIN_WITHDRAW = 'cross_chain_withdraw',
  UNWRAP_WRBTC = 'unwrap_wrbtc',
  CLAIM_VESTED_SOV_REWARDS = 'claim_vested_sov_rewards',
  SIMULATOR_REQUEST = 'simulator_request',
}

export enum TxStatus {
  NONE = 'none',
  PENDING_FOR_USER = 'pending_for_user',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface Transactions {
  [transactionHash: string]: Transaction;
}

export interface Transaction {
  chainId?: number;
  transactionHash: string;
  approveTransactionHash: Nullable<string>;
  type: TxType;
  status: TxStatus;
  loading: boolean;
  to: string;
  from: string;
  value: string;
  asset: Nullable<Asset>;
  assetAmount: Nullable<string>;
  customData?: { [key: string]: any };
}

export interface RequestDialogState {
  open: boolean;
  type: TxType;
  asset: Nullable<Asset>;
  amount: string;
  error: Nullable<string>;
}

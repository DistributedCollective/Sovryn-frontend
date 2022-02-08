import { TxType } from '../store/global/transactions-store/types';
import { AppMode } from '../types';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentNetwork: AppMode | string =
  String(process.env.REACT_APP_NETWORK).toLowerCase() || AppMode.MAINNET;

export const currentChainId = chains[currentNetwork];

export const blockExplorers = {
  1: 'https://etherscan.io',
  3: 'https://ropsten.etherscan.io',
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  btc_30: 'https://live.blockcypher.com/btc',
  btc_31: 'https://live.blockcypher.com/btc-testnet',
  56: 'https://bscscan.com',
  97: 'https://testnet.bscscan.com',
};

export const rpcNodes = {
  30: 'https://mainnet.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const databaseRpcNodes = {
  30: 'https://backend.sovryn.app/rpc',
  31: 'https://api.test.sovryn.app/rpc',
};

export const backendUrl = {
  30: 'https://backend.sovryn.app',
  31: 'https://api.test.sovryn.app',
};

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const sovAnalyticsCookie = { name: 'SovAnalytics', value: 'optout' };

export const chartStorageKey = 'sovryn.charts';

export const gasLimit = {
  [TxType.TRADE]: 3750000,
  [TxType.CLOSE_WITH_SWAP]: 2300000,
  [TxType.ADD_LIQUIDITY]: 500000,
  [TxType.REMOVE_LIQUIDITY]: 650000,
  [TxType.BORROW]: 1500000,
  [TxType.CONVERT_BY_PATH]: 750000,
  [TxType.LEND]: 300000,
  [TxType.UNLEND]: 450000,
  [TxType.SALE_BUY_SOV]: 260000,
  [TxType.SOV_REIMBURSE]: 100000,
  [TxType.SOV_CONVERT]: 2700000,
  [TxType.ESCROW_SOV_DEPOSIT]: 100000,
  [TxType.LM_DEPOSIT]: 150000,
  [TxType.LOCKED_SOV_CLAIM]: 3250000,
  [TxType.ORIGINS_SALE_BUY]: 300000,
  [TxType.CONVERT_RUSDT_TO_XUSD]: 150000,
  [TxType.CROSS_CHAIN_DEPOSIT]: 280000,
  [TxType.CROSS_CHAIN_WITHDRAW]: 280000,
  [TxType.SWAP_EXTERNAL]: 950000,
  [TxType.LOCKED_FUND_WAITED_CLAIM]: 3000000,
  [TxType.UNWRAP_WRBTC]: 50000,
  [TxType.STAKING_STAKE]: 1400000,
  [TxType.STAKING_INCREASE_STAKE]: 450000,
  [TxType.STAKING_EXTEND]: 450000,
  [TxType.STAKING_WITHDRAW]: 650000,
  [TxType.STAKING_REWARDS_CLAIM]: 3250000, //limit should be reduced once contract issue with claiming 0 values is resolved
  [TxType.STAKING_LIQUID_SOV_CLAIM]: 1500000,
  [TxType.DEPOSIT_COLLATERAL]: 250000,
  [TxType.CLAIM_VESTED_SOV_REWARDS]: 6000000,
  [TxType.SOV_WITHDRAW_VESTING]: 1900000,
  [TxType.SIMULATOR_REQUEST]: 6800000,
  [TxType.FAST_BTC_WITHDRAW]: 300000,
};

export const discordInvite = 'https://discord.gg/kBTNx4zjRf'; //unlimited use, no-expiry invite

export const sovrynTelegram = 'https://t.me/SovrynBitcoin';

export const useTenderlySimulator = !!process.env.REACT_APP_ESTIMATOR_URI;

export const TRADE_LOG_SIGNATURE_HASH =
  '0xf640c1cfe1a912a0b0152b5a542e5c2403142eed75b06cde526cee54b1580e5c';

export const MAINTENANCE_MARGIN = 15000000000000000000;

export const MIN_GAS = 40000;

export const CREATE_TICKET_LINK =
  'https://sovryn.freshdesk.com/support/tickets/new';

export const MILLION = 1000000;

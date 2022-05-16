import { TxType } from '../store/global/transactions-store/types';
import { AppMode } from '../types';
import { toWei } from './blockchain/math-helpers';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentNetwork: AppMode | string =
  String(process.env.REACT_APP_NETWORK).toLowerCase() || AppMode.MAINNET;

export const isMainnet = currentNetwork === 'mainnet';
export const isStaging = !!process.env.REACT_APP_STAGING;

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
  30: ['https://mainnet.sovryn.app/rpc', 'https://public-node.rsk.co/'],
  31: ['https://testnet.sovryn.app/rpc', 'https://public-node.testnet.rsk.co/'],
  56: 'wss://bsc.sovryn.app/mainnet',
  97: 'wss://bsctestnet.sovryn.app/websocket',
};

export const bitocracyUrl =
  currentNetwork === AppMode.MAINNET
    ? 'https://bitocracy.sovryn.app'
    : 'https://bitocracy.test.sovryn.app';

export const databaseRpcNodes = {
  30: 'https://backend.sovryn.app/rpc',
  31: 'https://api.test.sovryn.app/rpc',
};

export const backendUrl = {
  30: 'https://backend.sovryn.app',
  31: 'https://api.test.sovryn.app',
};

export const graphRskUrl = process.env.REACT_APP_GRAPH_RSK;

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const sovAnalyticsCookie = { name: 'SovAnalytics', value: 'optout' };

export const chartStorageKey = 'sovryn.charts';

export const gasLimit = {
  [TxType.APPROVE]: 100000,
  [TxType.TRADE]: 3750000,
  [TxType.CLOSE_WITH_SWAP]: 2300000,
  [TxType.CLOSE_WITH_DEPOSIT]: 500000,
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
  [TxType.DEPOSIT_COLLATERAL]: 250000,
  [TxType.STAKING_LIQUID_SOV_CLAIM]: 2500000,
  [TxType.DEPOSIT_COLLATERAL]: 250000,
  [TxType.CLAIM_VESTED_SOV_REWARDS]: 6000000,
  [TxType.SOV_WITHDRAW_VESTING]: 1900000,
  [TxType.SIMULATOR_REQUEST]: 6800000,
  [TxType.DEPOSIT_COLLATERAL]: 850000,
  [TxType.WITHDRAW_COLLATERAL]: 1400000,
  [TxType.FAST_BTC_WITHDRAW]: 300000,
  [TxType.PERPETUAL_TRADE]: 3000000,
  [TxType.PERPETUAL_DEPOSIT_COLLATERAL]: 1700000,
  [TxType.PERPETUAL_WITHDRAW_COLLATERAL]: 2400000,
  [TxType.LIMIT_ORDER]: 3000000,
  [TxType.SETTLEMENT_WITDHRAW]: 70000,
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

export const WIKI_LIMIT_ORDER_LIMITS_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/limit-order-limitations';
export const WIKI_LIMIT_ORDER_WALLETS_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/limit-order-limitations#wallet-compatibility';

export const MILLION = 1000000;

// most wallets considers 546 sats as minimum amount user needs to have in wallet to use network.
// i'm putting it as 10 sats for now.
export const DUST_AMOUNT = toWei(0.0000001);

export const notificationServiceUrl = {
  30: 'https://notify.sovryn.app/',
  31: 'https://notify.test.sovryn.app/',
};

export const limitOrderUrl = {
  // 30: 'https://orderbook.sovryn.app/limitOrder',
  30: 'https://_ob.sovryn.app/mainnet/api',
  // 31: 'https://orderbook.test.sovryn.app/limitOrder',
  31: 'https://_ob.sovryn.app/testnet/api',
};

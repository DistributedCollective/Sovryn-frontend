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
export const isStaging = process.env.REACT_APP_STAGING === 'true';

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
  30: ['https://rsk-live.sovryn.app/rpc', 'https://public-node.rsk.co/'],
  31: ['https://testnet.sovryn.app/rpc', 'https://public-node.testnet.rsk.co/'],
  56: 'wss://bsc.sovryn.app/mainnet/websocket',
  97: 'wss://bsc.sovryn.app/testnet/websocket',
};

export const bitocracyUrl =
  currentNetwork === AppMode.MAINNET
    ? 'https://bitocracy.sovryn.app'
    : 'https://bitocracy.test.sovryn.app';

export const D2_URL =
  currentNetwork === AppMode.MAINNET
    ? isStaging
      ? 'https://staging.sovryn.app'
      : 'https://sovryn.app'
    : 'https://test.sovryn.app';

export const myntUrl =
  currentNetwork === AppMode.MAINNET
    ? isStaging
      ? 'https://alpha-staging.sovryn.app/mynt-token'
      : 'https://alpha.sovryn.app/mynt-token'
    : 'https://alpha-test.sovryn.app/mynt-token';

export const databaseRpcNodes = {
  30: 'https://backend.sovryn.app/rpc',
  31: 'https://api.test.sovryn.app/rpc',
};

export const backendUrl = {
  30: 'https://backend.sovryn.app',
  31: 'https://api.test.sovryn.app',
};

export const userLogUrl = {
  30: 'https://user-log.sovryn.app',
  31: 'https://user-log.test.sovryn.app',
};

export const subgraphWrapperUrl = {
  30: 'https://graph-wrapper.sovryn.app',
  31: 'https://graph-wrapper.test.sovryn.app',
};

export const maintenanceUrl = {
  30: 'https://maintenance-mode.sovryn.app/maintenance',
  31: 'https://maintenance-mode.test.sovryn.app/maintenance',
};

export const bscScanApi =
  isMainnet || isStaging
    ? 'https://api.bscscan.com'
    : 'https://api-testnet.bscscan.com';

export const graphRskUrl = process.env.REACT_APP_GRAPH_RSK;

export const graphBabelfishUrl = process.env.REACT_APP_GRAPH_BABELFISH;

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const sovAnalyticsCookie = { name: 'SovAnalytics', value: 'optout' };

export const chartStorageKey = 'sovryn.charts';

export const gasLimit = {
  [TxType.APPROVE]: 100000,
  [TxType.TRADE]: 3750000,
  [TxType.CLOSE_WITH_SWAP]: 2300000,
  [TxType.CLOSE_WITH_DEPOSIT]: 950000,
  [TxType.ADD_LIQUIDITY]: 550000,
  [TxType.REMOVE_LIQUIDITY]: 650000,
  [TxType.BORROW]: 1500000,
  [TxType.CONVERT_BY_PATH]: 750000,
  [TxType.LEND]: 350000,
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
  [TxType.STAKING_WITHDRAW]: 1400000,
  [TxType.STAKING_REWARDS_CLAIM]: 6700000,
  [TxType.STAKING_REWARDS_CLAIM_RBTC]: 6700000,
  [TxType.STAKING_LIQUID_SOV_CLAIM]: 3500000,
  [TxType.CLAIM_VESTED_SOV_REWARDS]: 6000000,
  [TxType.SOV_WITHDRAW_VESTING]: 4000000,
  [TxType.SOV_WITHDRAW_VESTING_TEAM]: 6700000,
  [TxType.SIMULATOR_REQUEST]: 6800000,
  [TxType.DEPOSIT_COLLATERAL]: 850000,
  [TxType.WITHDRAW_COLLATERAL]: 1400000,
  [TxType.FAST_BTC_WITHDRAW]: 300000,
  [TxType.PERPETUAL_TRADE]: 2300000,
  [TxType.PERPETUAL_DEPOSIT_COLLATERAL]: 400000,
  [TxType.PERPETUAL_WITHDRAW_COLLATERAL]: 1300000,
  [TxType.PERPETUAL_CREATE_LIMIT_ORDER]: 500000,
  [TxType.PERPETUAL_CANCEL_LIMIT_ORDER]: 200000,
  [TxType.LIMIT_ORDER]: 3000000,
  [TxType.SETTLEMENT_WITDHRAW]: 70000,
  [TxType.CONVERT_BTCB]: 120000,
  [TxType.CLAIM_ALL_REWARDS]: 6800000,
};

export const discordInvite = 'https://discord.gg/sovryn';

export const sovrynTwitter = 'https://twitter.com/SovrynBTC';
export const sovrynTelegram = 'https://t.me/SovrynBitcoin';

export const useTenderlySimulator = !!process.env.REACT_APP_ESTIMATOR_URI;

export const TRADE_LOG_SIGNATURE_HASH =
  '0xf640c1cfe1a912a0b0152b5a542e5c2403142eed75b06cde526cee54b1580e5c';

export const MAINTENANCE_MARGIN = 15000000000000000000;

export const MIN_GAS = 40000;

export const CREATE_TICKET_LINK = 'https://help.sovryn.app/';

export const BABELFISH_APP_LINK = 'https://app.babelfish.money';

export const WIKI_LIMIT_ORDER_LIMITS_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/limit-order-limitations';
export const WIKI_LIMIT_ORDER_WALLETS_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/limit-order-limitations#wallet-compatibility';
export const WIKI_PERPETUAL_FUTURES_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/perpetual-futures';
export const WIKI_TRADE_NOTIFICATIONS_LINK =
  'https://wiki.sovryn.app/en/sovryn-dapp/trade-notifications';

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

export const learnMoreYieldFarming =
  'https://wiki.sovryn.app/en/sovryn-dapp/market-making#yield-farming';
export const learnMoreLending =
  'https://wiki.sovryn.app/en/sovryn-dapp/market-making';

export const ammServiceUrl = {
  30: 'https://amm-apy.sovryn.app/',
  31: 'https://amm-apy.test.sovryn.app/',
};
export const APOLLO_POLL_INTERVAL = 60e3;

export const graphWrapperUrl = {
  30: 'https://graph-wrapper.sovryn.app/',
  31: 'https://graph-wrapper.test.sovryn.app/',
};

export const DEFAULT_PAGE_SIZE = 5;
export const DEFAULT_ASSET_DECIMALS = 18;

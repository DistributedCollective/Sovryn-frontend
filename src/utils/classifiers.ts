import { Asset } from '../types/asset';
import { TxType } from '../store/global/transactions-store/types';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentNetwork =
  String(process.env.REACT_APP_NETWORK).toLowerCase() || 'mainnet';

export const currentChainId = chains[currentNetwork];

export const blockExplorers = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
  btc_30: 'https://live.blockcypher.com/btc',
  btc_31: 'https://live.blockcypher.com/btc-testnet',
};

export const networkNames = {
  30: 'RSK Mainnet',
  31: 'RSK Testnet',
};

export const rpcNodes = {
  // 30: 'https://mainnet.sovryn.app/rpc',
  30: 'https://mainnetbackup.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const readNodes = {
  // 30: 'wss://mainnet.sovryn.app/ws',
  30: 'wss://mainnetbackup.sovryn.app/ws',
  31: 'wss://testnet.sovryn.app/ws',
  // 30: 'https://public-node.rsk.co',
  // 31: 'https://public-node.testnet.rsk.co',
};

export const fastBtcApis = {
  30: 'https://fastbtc.sovryn.app/',
  31: 'https://testnet.sovryn.app/fastbtc',
};

// export const rpcNodesFallback = {
//   30: 'https://public-node.rsk.co',
//   31: 'https://public-node.testnet.rsk.co',
// };

export const databaseRpcNodes = {
  30: 'https://backend.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/backendrpc',
};

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const liquidityPools = [
  {
    source: Asset.BTC,
    label: 'rBTC',
    tokenLabel: 'rBTC',
  },
  {
    source: Asset.DOC,
    label: 'DoC',
    tokenLabel: 'DoC',
  },
  {
    source: Asset.USDT,
    label: 'USDT',
    tokenLabel: 'USDT',
  },
];

export const gasLimit = {
  [TxType.TRADE]: 1750000,
  [TxType.ADD_LIQUIDITY]: 275000,
  [TxType.BORROW]: 1300000,
  [TxType.CONVERT_BY_PATH]: 580000,
};

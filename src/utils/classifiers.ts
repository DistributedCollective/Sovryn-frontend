import { Asset } from '../types/asset';

export const chains = {
  mainnet: 30,
  testnet: 31,
};

export const currentChainId =
  chains[String(process.env.REACT_APP_NETWORK).toLowerCase() || 'mainnet'];

export const blockExplorers = {
  30: 'https://explorer.rsk.co',
  31: 'https://explorer.testnet.rsk.co',
};

export const networkNames = {
  // 1: 'Ethereum Mainnet',
  30: 'RSK Mainnet',
  31: 'RSK Testnet',
};

export const rpcNodes = {
  // 1: 'https://mainnet.infura.io/v3/46a3b4b834df4b55a613ee5d9b0fe4e5',
  30: 'https://mainnet.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const wsNodes = {
  // 1: 'wss://mainnet.infura.io/ws/v3/46a3b4b834df4b55a613ee5d9b0fe4e5',
  30: 'wss://mainnet.sovryn.app/ws',
  31: 'wss://testnet.sovryn.app/ws',
};

export const ethGenesisAddress = '0x0000000000000000000000000000000000000000';

export const liquidityPools = [
  {
    source: Asset.BTC,
    target: Asset.DOC,
    label: 'wRBTC',
    tokenLabel: 'wRBTC',
  },
  {
    source: Asset.DOC,
    target: Asset.BTC,
    label: 'DoC',
    tokenLabel: 'DoC',
  },
];

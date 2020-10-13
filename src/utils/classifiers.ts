import { Asset } from '../types/asset';

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
};

export const networkNames = {
  30: 'RSK Mainnet',
  31: 'RSK Testnet',
};

export const rpcNodes = {
  30: 'https://mainnet.sovryn.app/rpc',
  31: 'https://testnet.sovryn.app/rpc',
};

export const readNodes = {
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

import { ChainId } from '../types';

export const metamaskDefaultChains = [1, 3, 4, 5, 42];

const { ethereum } = window as any;

export const addNetwork = (params: any) => {
  ethereum
    .request({ method: 'wallet_addEthereumChain', params })
    .catch((error: Error) => console.log(`Error: ${error.message}`));
};

const networks = {
  [ChainId.RSK_MAINNET]: [
    {
      chainId: '0x1e',
      chainName: 'RSK',
      nativeCurrency: {
        name: 'RSK BTC',
        symbol: 'RBTC',
        decimals: 18,
      },
      rpcUrls: ['https://mainnet.sovryn.app/rpc'],
      blockExplorerUrls: ['https://explorer.rsk.co'],
    },
  ],
  [ChainId.RSK_TESTNET]: [
    {
      chainId: '0x1f',
      chainName: 'RSK Testnet',
      nativeCurrency: {
        name: 'Test RSK BTC',
        symbol: 'tRBTC',
        decimals: 18,
      },
      rpcUrls: ['https://testnet.sovryn.app/rpc'],
      blockExplorerUrls: ['https://explorer.testnet.rsk.co'],
    },
  ],
  [ChainId.BSC_MAINNET]: [
    {
      chainId: '0x38',
      chainName: 'BSC',
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: ['https://bsc-dataseed.binance.org/'],
      blockExplorerUrls: ['https://bscscan.com'],
    },
  ],
  [ChainId.BSC_TESTNET]: [
    {
      chainId: '0x61',
      chainName: 'BSC Testnet',
      nativeCurrency: {
        name: 'Testnet BNB',
        symbol: 'tBNB',
        decimals: 18,
      },
      rpcUrls: [
        'https://bsc.sovryn.app/testnet',
        'https://data-seed-prebsc-2-s3.binance.org:8545/',
        'https://data-seed-prebsc-2-s2.binance.org:8545/',
        'https://data-seed-prebsc-2-s1.binance.org:8545/',
        'https://data-seed-prebsc-1-s3.binance.org:8545/',
        'https://data-seed-prebsc-1-s2.binance.org:8545/',
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
      ],
      blockExplorerUrls: ['https://testnet.bscscan.com'],
    },
  ],
};

export const isAddableNetwork = (chainId: ChainId) => chainId in networks;

export const addNetworkByChainId = (chainId: ChainId) =>
  networks[chainId] && addNetwork(networks[chainId]);

export const switchNetwork = async (chainId: string, params: any) => {
  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (error) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (error.code === 4902) {
      addNetwork(params);
    }
  }
};

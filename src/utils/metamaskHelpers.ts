export const metamaskDefaultChains = [1, 3, 4, 5, 42];

export const addNetwork = (params: any) => {
  const { ethereum } = window as any;

  ethereum
    .request({ method: 'wallet_addEthereumChain', params })
    .catch((error: Error) => console.log(`Error: ${error.message}`));
};

export const addRskMainnet = () =>
  addNetwork([
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
  ]);

export const addRskTestnet = () =>
  addNetwork([
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
  ]);

export const switchNetwork = (params: any) => {
  const { ethereum } = window as any;

  ethereum
    .request({ method: 'wallet_switchEthereumChain', params })
    .catch((error: Error) => console.log(`Error: ${error.message}`));
};

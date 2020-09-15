import { Drizzle, generateStore, IDrizzleOptions } from '@drizzle/store';
import Web3 from 'web3';
import { createWeb3 } from './web3';
import { Asset } from '../../types/asset';
import { AssetsDictionary } from './assets-dictionary';
import { appContracts } from './app-contracts';

export const createDrizzleAssets = (
  assets: Array<Asset>,
  // events?: Array<any>,
) => {
  const web3 = createWeb3();

  const assetList = AssetsDictionary.find(assets);
  const contracts: Array<any> = [];
  const events: { [contractName: string]: Array<string> } = {};

  assetList.forEach(item => {
    contracts.push(
      buildContractData(web3, item.getTokenContractName(), item.tokenContract),
    );
    contracts.push(
      buildContractData(
        web3,
        item.getLendingContractName(),
        item.lendingContract,
      ),
    );
    events[item.getLendingContractName()] = ['Burn', 'Mint'];
  });

  Object.keys(appContracts).forEach(key => {
    const item = appContracts[key];
    contracts.push(
      buildContractData(web3, key, { address: item.address, abi: item.abi }),
    );
    events[key] = item.watchEvents;
  });

  const drizzleOptions: IDrizzleOptions = {
    contracts,
    // events,
    syncAlways: true,
    polls: {
      blocks: 10000,
      accounts: 10000,
    },
    networkWhitelist: [30 /* rsk mainnet */, 31 /* rsk testnet */],
    web3: {
      customProvider: web3,
      fallback: {
        type: 'ws',
        url: process.env.REACT_APP_PUBLIC_NODE as string,
      },
    },
  };
  const drizzleStore = generateStore({ drizzleOptions });

  return new Drizzle(drizzleOptions, drizzleStore);
};

const buildContractData = (
  web3: Web3,
  contractName: string,
  contract: { abi: any; address: string },
) => ({
  contractName: contractName,
  web3Contract: new web3.eth.Contract(contract.abi, contract.address, {
    data: 'deployedBytecode',
  }),
});

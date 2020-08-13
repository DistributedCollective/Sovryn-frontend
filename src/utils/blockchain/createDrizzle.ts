import { Drizzle, generateStore } from '@drizzle/store';
import { createWeb3 } from './web3';
import { Asset } from '../../types/asset';
import { AssetsDictionary } from './assets-dictionary';
import Web3 from 'web3';

export const createDrizzleAssets = (
  assets: Array<Asset>,
  // events?: Array<any>,
) => {
  const web3 = createWeb3();

  const assetList = AssetsDictionary.find(assets);
  const contracts: Array<any> = [];

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
  });

  const options = {
    contracts,
    web3: {
      fallback: {
        type: 'ws',
        url: process.env.REACT_APP_PUBLIC_NODE,
      },
    },
  };
  const drizzleStore = generateStore({ drizzleOptions: options as any });

  return new Drizzle(options as any, drizzleStore);
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

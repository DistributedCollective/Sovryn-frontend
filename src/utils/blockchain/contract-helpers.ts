import { Asset } from 'types/asset';
import { AssetsDictionary } from './assets-dictionary';
import { web3Reader } from './web3';

export const getLendingContract = (asset: Asset) =>
  AssetsDictionary.get(asset).lendingContract;

export const getLendingContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getLendingContractName();

export const getTokenContract = (asset: Asset) =>
  AssetsDictionary.get(asset).tokenContract;

export const getTokenContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getTokenContractName();

export const getWeb3Contract = (address: string, abi: any) => {
  const web3 = web3Reader();
  return new web3.eth.Contract(abi, address);
};

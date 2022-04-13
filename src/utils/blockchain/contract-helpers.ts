import { Asset } from 'types/asset';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { Sovryn } from '../sovryn';
import { ContractName } from '../types/contracts';
import { appContracts } from './app-contracts';

export const getLendingContract = (asset: Asset) =>
  AssetsDictionary.get(asset).lendingContract;

export const getLendingContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getLendingContractName();

export const getTokenContract = (asset: Asset) =>
  AssetsDictionary.get(asset).tokenContract;

export const getTokenLendingContract = (asset: Asset) =>
  AssetsDictionary.get(asset).lendingContract;

export const getTokenContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getTokenContractName();

export const getWeb3Contract = (address: string, abi: any) => {
  const web3 = Sovryn.getWeb3();
  return new web3.eth.Contract(abi, address);
};

export const getContract = (contractName: ContractName) =>
  appContracts[contractName];

export const getContractNameByAddress = (address: string): ContractName => {
  return Object.keys(Sovryn.contracts).find(
    key =>
      Sovryn.contracts[key].options.address.toLowerCase() ===
      address.toLowerCase(),
  ) as ContractName;
};

export const symbolByTokenAddress = (address: string) => {
  return AssetsDictionary.getByTokenContractAddress(address)?.symbol;
};

export const assetByTokenAddress = (address: string): Asset => {
  return AssetsDictionary.getByTokenContractAddress(address)?.asset;
};

export const assetByLoanTokenAddress = (address: string): Asset => {
  return AssetsDictionary.getByLoanContractAddress(address)?.asset;
};

import { Asset } from 'types/asset';
import { AssetsDictionary } from './assets-dictionary';

export const getLendingContract = (asset: Asset) =>
  AssetsDictionary.get(asset).lendingContract;

export const getLendingContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getLendingContractName();

export const getTokenContract = (asset: Asset) =>
  AssetsDictionary.get(asset).tokenContract;

export const getTokenContractName = (asset: Asset) =>
  AssetsDictionary.get(asset).getTokenContractName();

import { Asset } from 'types/asset';
import { ContractName, getContract } from './contracts';

interface AssetValue {
  lending: ContractName;
  token: ContractName;
}

export const assetToContracts: {
  [key in keyof typeof Asset]: AssetValue;
} = {
  BTC: {
    lending: 'LoadContractRBTC',
    token: 'TestTokenRBTC',
  },
  USD: {
    lending: 'LoanContractSUSD',
    token: 'TestTokenSUSD',
  },
};

export const getLendingContract = (asset: Asset) =>
  getContract(assetToContracts[asset].lending);

export const getTokenContract = (asset: Asset) =>
  getContract(assetToContracts[asset].token);

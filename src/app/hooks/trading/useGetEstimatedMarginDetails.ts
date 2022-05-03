import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export interface MarginDetails {
  principal: string;
  collateral: string;
  interestRate: string;
}

export function useGetEstimatedMarginDetails(
  loanContract: Asset,
  leverage: number,
  loanTokenSent: string,
  collateralTokenSent: string,
  collateralToken: Asset,
) {
  return useCacheCallWithValue<MarginDetails>(
    getLendingContractName(loanContract),
    'getEstimatedMarginDetails',
    {
      principal: '0',
      collateral: '0',
      interestRate: '0',
    },
    toWei(String(leverage - 1)),
    loanTokenSent,
    collateralTokenSent,
    getTokenContract(collateralToken).address,
  );
}

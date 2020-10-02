import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { toWei } from 'web3-utils';

export function useGetEstimatedMarginDetails(
  loanContract: Asset,
  leverage: number,
  loanTokenSent: string,
  collateralTokenSent: string,
  collateralToken: Asset,
) {
  return useCacheCallWithValue(
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

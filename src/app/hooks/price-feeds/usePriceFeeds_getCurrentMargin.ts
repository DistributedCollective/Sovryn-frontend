import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

interface CurrentMargin {
  currentMargin: string;
  collateralToLoanRate: string;
}

export function usePriceFeeds_getCurrentMargin(
  loanToken: Asset,
  collateralToken: Asset,
  principal: string,
  collateral: string,
) {
  return useCacheCallWithValue<CurrentMargin>(
    'priceFeed',
    'getCurrentMargin',
    {
      currentMargin: '0',
      collateralToLoanRate: '0',
    },
    getTokenContract(loanToken).address,
    getTokenContract(collateralToken).address,
    principal,
    collateral,
  );
}

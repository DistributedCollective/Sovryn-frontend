import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function usePriceFeeds_queryPrecision(
  loanToken: Asset,
  collateralToken: Asset,
) {
  return useCacheCallWithValue(
    'priceFeed',
    'queryPrecision',
    '0',
    getTokenContract(loanToken).address,
    getTokenContract(collateralToken).address,
  );
}

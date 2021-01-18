import { Asset } from 'types/asset';
import { getTokenContract } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function usePriceFeeds_QueryRate(
  collateralToken: Asset,
  loanToken: Asset,
) {
  return useCacheCallWithValue<{ rate: string; precision: string }>(
    'priceFeed',
    'queryRate',
    {
      rate: '0',
      precision: '0',
    },
    getTokenContract(collateralToken).address,
    getTokenContract(loanToken).address,
  );
}

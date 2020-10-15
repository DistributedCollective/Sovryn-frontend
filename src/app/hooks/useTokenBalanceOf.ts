import { Asset } from 'types/asset';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from './useCacheCallWithValue';
import { useAccount } from './useAccount';

/**
 * Returns balance of a token
 * BTC is wRBTC token and not an actual user's BTC balance.
 * @param asset
 */
export function useTokenBalanceOf(asset: Asset) {
  return useCacheCallWithValue(
    getTokenContractName(asset),
    'balanceOf',
    '0',
    useAccount(),
  );
}

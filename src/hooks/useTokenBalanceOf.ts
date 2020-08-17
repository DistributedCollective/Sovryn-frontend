import { Asset } from 'types/asset';
import { getTokenContractName } from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from './useCacheCallWithValue';
import { useAccount } from './useAccount';

export function useTokenBalanceOf(asset: Asset) {
  const account = useAccount();
  return useCacheCallWithValue(
    getTokenContractName(asset),
    'balanceOf',
    '0',
    account,
  );
}

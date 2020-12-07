import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useReserveStakedBalance(pool: Asset, asset: Asset) {
  return useCacheCallWithValue(
    getAmmContractName(pool),
    'reserveStakedBalance',
    '0',
    getTokenContract(asset).address,
  );
}

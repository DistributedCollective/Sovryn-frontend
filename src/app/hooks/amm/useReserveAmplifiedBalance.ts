import { Asset } from 'types/asset';
import {
  getAmmContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useReserveAmplifiedBalance(pool: Asset, token: Asset) {
  return useCacheCallWithValue(
    getAmmContractName(pool),
    'reserveAmplifiedBalance',
    '0',
    getTokenContract(token).address,
  );
}

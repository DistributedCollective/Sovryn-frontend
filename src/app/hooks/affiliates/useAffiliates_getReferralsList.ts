import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useAffiliates_getReferralsList(address: string) {
  return useCacheCallWithValue('affiliates', 'getReferralsList', '0', address);
}

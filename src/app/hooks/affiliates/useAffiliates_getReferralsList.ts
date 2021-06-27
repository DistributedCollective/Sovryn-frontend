import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useAffiliates_getReferralsList(address: string) {
  return useCacheCallWithValue<string[]>(
    'affiliates',
    'getReferralsList',
    [],
    address,
  );
}

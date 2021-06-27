import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useAffiliates_getAffiliatesUserReferrer(address: string) {
  return useCacheCallWithValue<string>(
    'affiliates',
    'getAffiliatesUserReferrer',
    null,
    address,
  );
}

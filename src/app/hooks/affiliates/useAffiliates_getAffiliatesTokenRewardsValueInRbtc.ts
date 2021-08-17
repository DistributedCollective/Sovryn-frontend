import { useCacheCallWithValue } from '../useCacheCallWithValue';

export function useAffiliates_getAffiliatesTokenRewardsValueInRbtc(
  address: string,
) {
  return useCacheCallWithValue<string>(
    'affiliates',
    'getAffiliatesTokenRewardsValueInRbtc',
    '0',
    address,
  );
}

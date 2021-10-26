import { useAccount } from 'app/hooks/useAccount';
import { useCacheCallWithValue } from 'app/hooks/useCacheCallWithValue';
import { getContract } from 'utils/blockchain/contract-helpers';

export const useGetFeesEarnedClaimAmount = () => {
  const address = useAccount();

  const { value } = useCacheCallWithValue(
    'feeSharingProxy',
    'getAccumulatedFees',
    '0',
    address,
    getContract('RBTC_lending').address,
  );

  return value;
};

import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetLiquidSovClaimAmount = () => {
  const [liquidSovClaimAmount, setLiquidSovClaimAmount] = useState('0');
  const address = useAccount();

  useEffect(() => {
    contractReader
      .call<{ amount: string }>(
        'stakingRewards',
        'getStakerCurrentReward',
        [true],
        address,
      )
      .then(result => setLiquidSovClaimAmount(result.amount))
      .catch(() => setLiquidSovClaimAmount('0'));
  }, [address]);

  return liquidSovClaimAmount;
};

import { useAccount } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetLiquidSovClaimAmount = () => {
  const [liquidSovClaimAmount, setLiquidSovClaimAmount] = useState('0');
  const address = useAccount();

  useEffect(() => {
    contractReader
      .call<string>('stakingRewards', 'getClaimableReward', [true], address)
      .then(result => {
        console.log(result);
        setLiquidSovClaimAmount(result);
      })
      .catch(() => setLiquidSovClaimAmount('0'));
  }, [address]);

  return liquidSovClaimAmount;
};

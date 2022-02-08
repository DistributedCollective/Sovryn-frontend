import { useAccount } from 'app/hooks/useAccount';
import { bignumber } from 'mathjs';
import { useCallback, useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetLiquidSovClaimAmount = () => {
  const [value, setValue] = useState({
    lastWithdrawalInterval: 0,
    amount: '0',
    loading: true,
  });
  const address = useAccount();

  const searchForRewards = useCallback(async () => {
    if (!address) {
      return {
        lastWithdrawalInterval: 0,
        amount: '0',
      };
    }

    const now = Math.ceil(Date.now() / 1000);
    const lockDate = await contractReader
      .call('staking', 'timestampToLockDate', [now])
      .then(Number);

    let checks = 30;
    let amount = 0;
    let lastWithdrawalInterval = 0;

    // If lastWithdrawalInterval > 0 and amount = 0
    // call getStakerCurrentReward(True, lastWithdrawalInterval)
    // Stop when: a) Both lastWithdrawalInterval > 0 and amount > 0 OR b) lastWithdrawalInterval(returned) > currentTimeStamp
    // as additional brake, run at maximum 30 checks
    while (
      !(
        (lastWithdrawalInterval > 0 && amount > 0) ||
        lastWithdrawalInterval === lockDate ||
        checks < 0
      )
    ) {
      const result = await contractReader
        .call<{
          lastWithdrawalInterval: string;
          amount: string;
        }>(
          'stakingRewards',
          'getStakerCurrentReward',
          [true, lastWithdrawalInterval],
          address,
        )
        .then(response => ({
          lastWithdrawalInterval: Number(response.lastWithdrawalInterval),
          amount: bignumber(response.amount).toNumber(),
        }));

      lastWithdrawalInterval = result.lastWithdrawalInterval;
      amount = result.amount;
      checks--;
    }

    return {
      lastWithdrawalInterval,
      amount: bignumber(amount).toString(),
    };
  }, [address]);

  useEffect(() => {
    setValue(prevState => ({ ...prevState, loading: true }));
    searchForRewards()
      .then(({ lastWithdrawalInterval, amount }) =>
        setValue({ lastWithdrawalInterval, amount, loading: false }),
      )
      .catch(() =>
        setValue({ lastWithdrawalInterval: 0, amount: '0', loading: false }),
      );
  }, [searchForRewards]);

  return value;
};

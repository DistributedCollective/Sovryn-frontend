import { useAccount } from 'app/hooks/useAccount';
import { bignumber } from 'mathjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetLiquidSovClaimAmount = () => {
  const timeoutRef = useRef<number>();
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

    const startTime = await contractReader
      .call('stakingRewards', 'startTime', [])
      .then(Number);

    const maxDuration = await contractReader
      .call('stakingRewards', 'maxDuration', [])
      .then(Number);

    const result = await contractReader.call<{
      lastWithdrawalInterval: string;
      amount: string;
    }>('stakingRewards', 'getStakerCurrentReward', [false, 0], address);

    let checks = 30;
    let intervalAmount = 0;
    let lastWithdrawalInterval = 0;
    let restartTime = startTime;

    // Call getStakerCurrentReward(True, restartTime) until either
    // a) lastWithdrawalInterval > 0 and amount > 0 OR b) restartTime >= now
    // as additional brake, run at maximum 30 checks
    while (
      !(
        (lastWithdrawalInterval > 0 && intervalAmount > 0) ||
        restartTime >= now ||
        checks < 0
      )
    ) {
      try {
        const result = await contractReader
          .call<{
            lastWithdrawalInterval: string;
            amount: string;
          }>(
            'stakingRewards',
            'getStakerCurrentReward',
            [true, restartTime],
            address,
          )
          .then(response => ({
            lastWithdrawalInterval: Number(response.lastWithdrawalInterval),
            amount: bignumber(response.amount).toNumber(),
          }));

        if (result.amount > 0) {
          restartTime = lastWithdrawalInterval;
        }

        if (result.amount === 0) {
          restartTime += Number(maxDuration);
        }

        lastWithdrawalInterval = result.lastWithdrawalInterval;
        intervalAmount = result.amount;
        checks--;
      } catch (e) {
        console.error(e);
        break;
      }
    }

    return {
      lastWithdrawalInterval: restartTime,
      amount: bignumber(result.amount).toString(),
    };
  }, [address]);

  const doJob = useCallback(() => {
    setValue(prevState => ({ ...prevState, loading: true }));
    searchForRewards()
      .then(({ lastWithdrawalInterval, amount }) => {
        setValue({ lastWithdrawalInterval, amount, loading: false });
        if (Number(amount) > 0) {
          // make check again in a minute to update shown balance after user withdraws it
          timeoutRef.current = setTimeout(doJob, 60_000);
        }
      })
      .catch(() =>
        setValue({ lastWithdrawalInterval: 0, amount: '0', loading: false }),
      );
  }, [searchForRewards]);

  useEffect(() => {
    doJob();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [doJob]);

  return value;
};

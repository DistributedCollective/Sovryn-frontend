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
    const lockDate = await contractReader
      .call('staking', 'timestampToLockDate', [now])
      .then(Number);

    let checks = 30;
    let amount = 0;
    let lastWithdrawalInterval = 0;
    let restartTime = 0;

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
      try {
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

        if (result.amount > 0) {
          restartTime = lastWithdrawalInterval;
        }

        lastWithdrawalInterval = result.lastWithdrawalInterval;
        amount = result.amount;
        checks--;
      } catch (e) {
        console.error(e);
        break;
      }
    }

    return {
      lastWithdrawalInterval: restartTime,
      amount: bignumber(amount).toString(),
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

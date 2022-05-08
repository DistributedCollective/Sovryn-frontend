import { useEffect, useState, useMemo } from 'react';
import { bignumber } from 'mathjs';
import { VestGroup } from 'app/components/UserAssets/Vesting/types';
import { useAccount, useBlockSync } from '../useAccount';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { Sovryn } from '../../../utils/sovryn';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { Nullable } from 'types';
import { ContractName } from '../../../utils/types/contracts';
import { getVestingAbi } from 'utils/blockchain/requests/vesting';

const TWO_WEEKS = 1209600;

export function useGetUnlockedVesting(
  stakingContractName: ContractName,
  vestingAddress: string,
  vestingType: VestGroup,
) {
  const account = useAccount();
  const syncBlock = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0');
  const [err, setError] = useState<Nullable<string>>(null);
  const isFourYearVest = useMemo(() => vestingType === 'fouryear', [
    vestingType,
  ]);
  const vestABI = useMemo(() => getVestingAbi(vestingType), [vestingType]);

  useEffect(() => {
    const run = async () => {
      let value = '0';
      let end;
      try {
        const startDate = Number(
          await contractReader.callByAddress(
            vestingAddress,
            vestABI,
            'startDate',
            [],
          ),
        );
        const cliff = Number(
          await contractReader.callByAddress(
            vestingAddress,
            vestABI,
            isFourYearVest ? 'CLIFF' : 'cliff',
            [],
          ),
        );
        const allUnlocked = await contractReader.call(
          stakingContractName,
          'allUnlocked',
          [],
        );
        const blockNumber = await Sovryn.getWeb3().eth.getBlockNumber();

        //in the unlikely case that all tokens have been unlocked early, allow to withdraw all of them.
        if (allUnlocked) {
          end = Number(
            await contractReader.callByAddress(
              vestingAddress,
              vestABI,
              'endDate',
              [],
            ),
          );
        } else {
          end = new Date().getTime() / 1e3;
        }

        for (let i = startDate + cliff; i <= end; i += TWO_WEEKS) {
          const stake: string = (await contractReader.call(
            stakingContractName,
            'getPriorUserStakeByDate',
            [vestingAddress, i, blockNumber - 1],
          )) as string;
          value = bignumber(value).add(stake).toFixed(0);
        }
        if (
          isFourYearVest &&
          Math.round(Date.now() / 1e3) <= Number(startDate) + 31449600 // four year vests locked with 1 year cliff. 31449600 = 52 weeks in seconds
        ) {
          value = '0';
        }
      } catch (e) {
        setAmount('0');
        setLoading(false);
        setError(e.message);
      }
      return value;
    };

    if (vestingAddress && vestingAddress !== ethGenesisAddress) {
      setLoading(true);
      run()
        .then(value => setAmount(value))
        .catch(e => {
          console.error(e);
          setAmount('0');
        })
        .finally(() => setLoading(false));
    }
  }, [
    account,
    vestingAddress,
    syncBlock,
    stakingContractName,
    isFourYearVest,
    vestABI,
  ]);

  return { value: amount, loading, error: err };
}

import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import VestingABI from 'utils/blockchain/abi/Vesting.json';
import { useAccount, useBlockSync } from '../useAccount';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { Sovryn } from '../../../utils/sovryn';
import { ethGenesisAddress } from '../../../utils/classifiers';
import { Nullable } from 'types';
import { ContractName } from '../../../utils/types/contracts';

const TWO_WEEKS = 1209600;

export function useGetUnlockedVesting(
  stakingContractName: ContractName,
  vestingAddress: string,
) {
  const account = useAccount();
  const syncBlock = useBlockSync();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('0');
  const [err, setError] = useState<Nullable<string>>(null);
  useEffect(() => {
    const run = async () => {
      let value = '0';
      let end;
      try {
        const startDate = Number(
          await contractReader.callByAddress(
            vestingAddress,
            VestingABI,
            'startDate',
            [],
          ),
        );
        const cliff = Number(
          await contractReader.callByAddress(
            vestingAddress,
            VestingABI,
            'cliff',
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
              VestingABI,
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
  }, [account, vestingAddress, syncBlock, stakingContractName]);

  return { value: amount, loading, error: err };
}

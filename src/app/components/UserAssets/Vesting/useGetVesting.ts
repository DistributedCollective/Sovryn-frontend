import { useAccount } from '../../../hooks/useAccount';
import { useEffect, useState } from 'react';
import { ethGenesisAddress } from '../../../../utils/classifiers';
import { bridgeNetwork } from '../../../pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import { Chain } from '../../../../types';
import stakingAbi from 'utils/blockchain/abi/Staking.json';
import { FullVesting, StakesProp } from './types';

const fillEmptyVesting = (vesting: FullVesting) => ({
  ...vesting,
  balance: '0',
  stakes: { dates: [], stakes: [] },
});

export function useGetVesting(vesting: FullVesting) {
  const account = useAccount();

  const [result, setResult] = useState<FullVesting>(fillEmptyVesting(vesting));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !account ||
      account === ethGenesisAddress ||
      !vesting.vestingContract ||
      vesting.vestingContract === ethGenesisAddress
    ) {
      setResult(fillEmptyVesting(vesting));
      setLoading(false);
    } else {
      setLoading(true);

      const run = async () => {
        // get vesting info
        const mc = [
          {
            address: getContract(vesting.staking).address,
            abi: stakingAbi,
            fnName: 'balanceOf',
            args: [vesting.vestingContract],
            key: 'balance',
            parser: val => val[0].toString(),
          },
          {
            address: getContract(vesting.staking).address,
            abi: stakingAbi,
            fnName: 'getStakes',
            args: [vesting.vestingContract],
            key: 'stakes',
            parser: val => ({
              dates: val[0].map(item => new Date(item.toNumber() * 1000)),
              stakes: val[1].map(item => item.toString()),
            }),
          },
          // will be useful in the future, leaving commented to retrieve data faster for now.
          // {
          //   address: vesting.vestingContract!,
          //   abi: vestingAbi,
          //   fnName: 'cliff',
          //   args: [],
          //   key: `${vesting}/cliff`,
          //   parser: val => val[0].toString(),
          // },
          // {
          //   address: vesting.vestingContract!,
          //   abi: vestingAbi,
          //   fnName: 'duration',
          //   args: [],
          //   key: 'duration',
          //   parser: val => val[0].toString(),
          // },
          // {
          //   address: vesting.vestingContract!,
          //   abi: vestingAbi,
          //   fnName: 'startDate',
          //   args: [],
          //   key: 'startDate',
          //   parser: val => new Date(val[0].toNumber() * 1000),
          // },
          // {
          //   address: vesting.vestingContract!,
          //   abi: vestingAbi,
          //   fnName: 'endDate',
          //   args: [],
          //   key: 'endDate',
          //   parser: val => new Date(val[0].toNumber() * 1000),
          // },
        ];

        const { returnData: info } = await bridgeNetwork.multiCall<{
          balance: string;
          stakes: StakesProp;
        }>(Chain.RSK, mc);

        return {
          ...vesting,
          balance: info.balance || '0',
          stakes: info.stakes || { stakes: [], dates: [] },
        };
      };

      run()
        .then(data => {
          setResult(data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          setResult(fillEmptyVesting(vesting));
          setLoading(false);
        });
    }
  }, [account, vesting]);

  return { value: result, loading };
}

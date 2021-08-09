import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVestedStaking_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [vestedValue, setVestedValue] = useState('0');
  const [teamVestedValue, setTeamVestedValue] = useState('0');
  const [originVestedValue, setOriginVestedValue] = useState('0');
  const [lmVestedValue, setLMVestedValue] = useState('0');
  const [babelFishVestedValue, setBabelFishVestedValue] = useState('0');
  const [error, setError] = useState<any>(null);

  const [vestingContract, setVestingContract] = useState(ethGenesisAddress);
  const [teamVestingContract, setTeamVestingContract] = useState(
    ethGenesisAddress,
  );
  const [originVestingContract, setOriginVestingContract] = useState(
    ethGenesisAddress,
  );
  const [lmVestingContract, setLMVestingContract] = useState(ethGenesisAddress);

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const adr1 = await contractReader.call('vestingRegistry', 'getVesting', [
        address,
      ]);
      const adr2 = await contractReader.call(
        'vestingRegistry',
        'getTeamVesting',
        [address],
      );
      const adr3 = await contractReader.call(
        'vestingRegistryOrigin',
        'getVesting',
        [address],
      );
      const adr4 = await contractReader.call(
        'vestingRegistryLM',
        'getVesting',
        [address],
      );

      if (adr1 !== ethGenesisAddress) {
        const vested = await contractReader.call('staking', 'balanceOf', [
          adr1,
        ]);
        setVestingContract(String(adr1));
        setVestedValue(String(vested));
      }

      if (adr2 !== ethGenesisAddress) {
        const teamVested = await contractReader.call('staking', 'balanceOf', [
          adr2,
        ]);
        setTeamVestingContract(String(adr2));
        setTeamVestedValue(String(teamVested));
      }

      if (adr3 !== ethGenesisAddress) {
        const originVested = await contractReader.call('staking', 'balanceOf', [
          adr3,
        ]);
        setOriginVestingContract(String(adr3));
        setOriginVestedValue(String(originVested));
      }

      if (adr4 !== ethGenesisAddress) {
        const lmVested = await contractReader.call('staking', 'balanceOf', [
          adr4,
        ]);
        setLMVestingContract(String(adr4));
        setLMVestedValue(String(lmVested));
      }

      const adr5 = await contractReader.call('lockedFund', 'getVestedBalance', [
        address,
      ]);

      if (adr5 && adr5 !== '0') {
        const babelFishVested = await contractReader.call<string>(
          'lockedFund',
          'getVestedBalance',
          [adr5],
        );
        setBabelFishVestedValue(String(babelFishVested));
      }

      if (
        adr1 === adr2 &&
        adr2 === adr3 &&
        adr3 === adr4 &&
        adr1 === ethGenesisAddress
      ) {
        setVestingContract(ethGenesisAddress);
        setTeamVestingContract(ethGenesisAddress);
        setOriginVestingContract(ethGenesisAddress);
        setLMVestingContract(ethGenesisAddress);
      }
      setLoading(false);
      setError(null);
    };
    if (address !== ethGenesisAddress) {
      get().catch(e => {
        setError(e);
        setLoading(false);
        setVestingContract(ethGenesisAddress);
      });
    }
  }, [address]);
  return {
    value: bignumber(teamVestedValue)
      .add(vestedValue)
      .add(originVestedValue)
      .add(lmVestedValue)
      .toString(),
    loading,
    error,
    vestingContract,
    vestedValue,
    teamVestedValue,
    teamVestingContract,
    originVestedValue,
    originVestingContract,
    lmVestedValue,
    lmVestingContract,
    babelFishVestedValue,
  };
}

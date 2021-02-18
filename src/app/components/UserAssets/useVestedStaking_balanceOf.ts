import { useEffect, useState } from 'react';
import { bignumber } from 'mathjs';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVestedStaking_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [vestedValue, setVestedValue] = useState('0');
  const [teamVestedValue, setTeamVestedValue] = useState('0');
  const [error, setError] = useState<any>(null);

  const [vestingContract, setVestingContract] = useState(ethGenesisAddress);
  const [teamVestingContract, setTeamVestingContract] = useState(
    ethGenesisAddress,
  );

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

      if (adr1 === adr2 && adr1 === ethGenesisAddress) {
        setVestingContract(ethGenesisAddress);
        setTeamVestingContract(ethGenesisAddress);
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
    value: bignumber(teamVestedValue).add(vestedValue).toString(),
    loading,
    error,
    vestingContract,
    vestedValue,
    teamVestedValue,
    teamVestingContract,
  };
}

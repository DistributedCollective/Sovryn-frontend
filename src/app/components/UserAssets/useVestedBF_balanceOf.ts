import { useEffect, useState } from 'react';
import { contractReader } from '../../../utils/sovryn/contract-reader';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useVestedBF_balanceOf(address: string) {
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState('0');
  const [contract, setContract] = useState(ethGenesisAddress);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    setLoading(true);

    const get = async () => {
      const contractAddress = await contractReader
        .call('vestingRegistryFISH', 'getVesting', [address])
        .catch(reason => setError(reason));

      if (contractAddress !== ethGenesisAddress) {
        const vested = await contractReader
          .call('staking', 'balanceOf', [contractAddress])
          .catch(reason => setError(reason));
        setContract(String(contractAddress));
        setValue(String(vested));
      }

      if (contractAddress === ethGenesisAddress) {
        setContract(ethGenesisAddress);
      }
      setLoading(false);
      setError(null);
    };
    if (address !== ethGenesisAddress) {
      get().catch(e => {
        setError(e);
        setLoading(false);
        setContract(ethGenesisAddress);
      });
    }
  }, [address]);
  return {
    value,
    contract,
    loading,
    error,
  };
}

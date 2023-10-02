import { useListOfUserVestings } from 'app/components/UserAssets/Vesting/useListOfUserVestings';
import { useEffect, useState } from 'react';

const useGetVestingAddresses = () => {
  const { loading, items } = useListOfUserVestings();

  const [vestingAddresses, setVestingAddresses] = useState<string[]>([]);

  useEffect(() => {
    const getVestingContractAddresses = async () => {
      try {
        const vestingContracts: string[] = await Promise.all(
          items.map(async item => item.vestingContract),
        );
        setVestingAddresses(vestingContracts);
      } catch (error) {
        console.error('Error fetching vesting contract addresses:', error);
      }
    };
    if (!loading) {
      getVestingContractAddresses();
    }
  }, [items, loading]);

  return vestingAddresses;
};

export default useGetVestingAddresses;

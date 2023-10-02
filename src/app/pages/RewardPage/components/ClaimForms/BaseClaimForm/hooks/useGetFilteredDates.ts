import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

const useGetFilteredDates = (vestingAddresses: string[]) => {
  const [filteredDates, setFilteredDates] = useState<string[]>([]);

  useEffect(() => {
    const fetchDatesForAddresses = async () => {
      const datesArray: string[] = [];

      for (const address of vestingAddresses) {
        try {
          const res = await contractReader.call('staking', 'getStakes', [
            address,
          ]);
          const dates = res['dates'];
          datesArray.push(...dates);
        } catch (error) {
          console.error('Error fetching dates for address', address, error);
        }
      }
      setFilteredDates(datesArray);
    };

    fetchDatesForAddresses();
  }, [vestingAddresses]);

  return filteredDates;
};

export default useGetFilteredDates;

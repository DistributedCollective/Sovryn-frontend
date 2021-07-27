import { useEffect, useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';

export const useGetTierCount = () => {
  const [tierCount, setTierCount] = useState(0);

  useEffect(() => {
    contractReader
      .call<string>('originsBase', 'getTierCount', [])
      .then(result => setTierCount(parseInt(result)));
  }, []);

  return tierCount;
};

import { useState } from 'react';
import { contractReader } from 'utils/sovryn/contract-reader';
import { useGetTierCount } from './useGetTierCount';

const isActiveSale = (saleStartTimestamp: number, saleEndTimestamp: number) =>
  new Date(saleStartTimestamp * 1000) < new Date() &&
  new Date(saleEndTimestamp * 1000) > new Date();

export const useGetActiveSaleTierId = () => {
  const tierCount = useGetTierCount();
  const [activeTierId, setActiveTierId] = useState(0);

  for (let i = 1; i <= tierCount; i++) {
    if (activeTierId !== 0) {
      continue;
    }

    contractReader.call('originsBase', 'readTierPartA', [i]).then(result => {
      if (isActiveSale(result[3], result[4])) {
        setActiveTierId(i);
      }
    });
  }

  return activeTierId;
};

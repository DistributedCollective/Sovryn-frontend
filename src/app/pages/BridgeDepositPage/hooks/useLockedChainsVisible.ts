import { useMemo } from 'react';
import { Chain } from 'types';
import { NetworkModel } from '../types/network-model';

export const useLockedChainsVisible = (
  networks: NetworkModel[],
  lockedChains: { [key in Chain]: boolean },
) => {
  const lockedChainsVisible = useMemo(
    () =>
      networks.filter(val => val.chain && lockedChains[val.chain] === true)
        .length > 0,
    [lockedChains, networks],
  );

  return lockedChainsVisible;
};

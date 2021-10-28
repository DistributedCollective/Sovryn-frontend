import { useMemo, useCallback } from 'react';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { CrossBridgeAsset } from '../types/cross-bridge-asset';
import { Nullable, Chain } from 'types';

export function useDepositMaintenance() {
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.ETH_BRIDGE]: ethBridgeLocked,
    [States.ETH_BRIDGE_DEPOSIT]: ethBridgeDepositLocked,
    [States.BSC_BRIDGE_DEPOSIT]: bscBridgeDepositLocked,
    [States.BSC_BRIDGE]: bscBridgeLocked,
    [States.BRIDGE_SOV_DEPOSIT]: sovDepositLocked,
    [States.BRIDGE_XUSD_DEPOSIT]: xusdDepositLocked,
    [States.BRIDGE_ETH_DEPOSIT]: ethDepositLocked,
    [States.BRIDGE_BNB_DEPOSIT]: bnbDepositLocked,
  } = checkMaintenances();

  const lockedChains = useMemo(
    () => ({
      [Chain.ETH]: ethBridgeLocked || ethBridgeDepositLocked,
      [Chain.BSC]: bscBridgeLocked || bscBridgeDepositLocked,
    }),
    [
      ethBridgeLocked,
      ethBridgeDepositLocked,
      bscBridgeLocked,
      bscBridgeDepositLocked,
    ],
  );

  const isAssetDepositLocked = useCallback(
    (targetAsset: Nullable<CrossBridgeAsset>) => {
      switch (targetAsset) {
        case CrossBridgeAsset.SOV:
          return sovDepositLocked;
        case CrossBridgeAsset.XUSD:
          return xusdDepositLocked;
        case CrossBridgeAsset.ETH:
          return ethDepositLocked;
        case CrossBridgeAsset.BNB:
          return bnbDepositLocked;
        default:
          return false;
      }
    },
    [sovDepositLocked, xusdDepositLocked, ethDepositLocked, bnbDepositLocked],
  );

  return {
    lockedChains,
    isAssetDepositLocked,
  };
}

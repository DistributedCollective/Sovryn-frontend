import { useMemo, useCallback } from 'react';

import { Chain } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';

export function useWithdrawMaintenance() {
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.ETH_BRIDGE]: ethBridgeLocked,
    [States.BSC_BRIDGE]: bscBridgeLocked,
    [States.ETH_BRIDGE_WITHDRAW]: ethBridgeWithdrawLocked,
    [States.BSC_BRIDGE_WITHDRAW]: bscBridgeWithdrawLocked,
    [States.BRIDGE_SOV_WITHDRAW]: sovWithdrawLocked,
    [States.BRIDGE_XUSD_WITHDRAW]: xusdWithdrawLocked,
    [States.BRIDGE_ETH_WITHDRAW]: ethWithdrawLocked,
    [States.BRIDGE_BNB_WITHDRAW]: bnbWithdrawLocked,
  } = checkMaintenances();

  const lockedChains = useMemo(
    () => ({
      [Chain.ETH]: ethBridgeLocked || ethBridgeWithdrawLocked,
      [Chain.BSC]: bscBridgeLocked || bscBridgeWithdrawLocked,
    }),
    [
      ethBridgeLocked,
      ethBridgeWithdrawLocked,
      bscBridgeLocked,
      bscBridgeWithdrawLocked,
    ],
  );

  const isAssetWithdrawLocked = useCallback(
    (sourceAsset: CrossBridgeAsset | null) => {
      switch (sourceAsset) {
        case CrossBridgeAsset.SOV:
          return sovWithdrawLocked;
        case CrossBridgeAsset.XUSD:
          return xusdWithdrawLocked;
        case CrossBridgeAsset.ETH:
          return ethWithdrawLocked;
        case CrossBridgeAsset.BNB:
          return bnbWithdrawLocked;
        default:
          return false;
      }
    },
    [
      sovWithdrawLocked,
      xusdWithdrawLocked,
      ethWithdrawLocked,
      bnbWithdrawLocked,
    ],
  );

  return {
    lockedChains,
    isAssetWithdrawLocked,
  };
}

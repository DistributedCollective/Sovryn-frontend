import { useMemo } from 'react';

import { Nullable, Chain } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useWithdrawMaintenance } from 'app/pages/BridgeWithdrawPage/hooks/useWithdrawMaintenance';
import { CrossBridgeAsset } from 'app/pages/BridgeDepositPage/types/cross-bridge-asset';

export const useIsBridgeWithdrawLocked = (
  asset: Nullable<CrossBridgeAsset>,
  chain: Nullable<Chain>,
) => {
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const { lockedChains, isAssetWithdrawLocked } = useWithdrawMaintenance();
  const assetWithdrawLocked = isAssetWithdrawLocked(asset);

  const isLocked = useMemo(() => {
    return (
      bridgeLocked || assetWithdrawLocked || (chain && lockedChains[chain])
    );
  }, [bridgeLocked, assetWithdrawLocked, lockedChains, chain]);

  return isLocked;
};

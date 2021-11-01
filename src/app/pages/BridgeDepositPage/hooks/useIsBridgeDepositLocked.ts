import { useMemo } from 'react';

import { Nullable, Chain } from 'types';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { useDepositMaintenance } from 'app/pages/BridgeDepositPage/hooks/useDepositMaintenance';
import { CrossBridgeAsset } from '../types/cross-bridge-asset';

export const useIsBridgeDepositLocked = (
  asset: Nullable<CrossBridgeAsset>,
  chain: Nullable<Chain>,
) => {
  const { checkMaintenance, States } = useMaintenance();
  const bridgeLocked = checkMaintenance(States.BRIDGE);

  const { lockedChains, isAssetDepositLocked } = useDepositMaintenance();
  const assetDepositLocked = isAssetDepositLocked(asset);

  const isLocked = useMemo(() => {
    return bridgeLocked || assetDepositLocked || (chain && lockedChains[chain]);
  }, [bridgeLocked, assetDepositLocked, lockedChains, chain]);

  return isLocked;
};

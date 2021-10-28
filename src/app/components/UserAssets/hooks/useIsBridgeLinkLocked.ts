import { useMemo } from 'react';

import { useMaintenance } from 'app/hooks/useMaintenance';
import { Asset } from 'types';

export const useIsBridgeLinkLocked = (asset: Asset) => {
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.BRIDGE]: bridgeLocked,
    [States.BRIDGE_SOV_DEPOSIT]: sovDepositLocked,
    [States.BRIDGE_SOV_WITHDRAW]: sovWithdrawLocked,
    [States.BRIDGE_ETH_DEPOSIT]: ethDepositLocked,
    [States.BRIDGE_ETH_WITHDRAW]: ethWithdrawLocked,
    [States.BRIDGE_BNB_DEPOSIT]: bnbDepositLocked,
    [States.BRIDGE_BNB_WITHDRAW]: bnbWithdrawLocked,
    [States.BRIDGE_XUSD_DEPOSIT]: xusdDepositLocked,
    [States.BRIDGE_XUSD_WITHDRAW]: xusdWithdrawLocked,
  } = checkMaintenances();

  const assetDepositLocked = useMemo(
    () =>
      bridgeLocked ||
      (asset === Asset.SOV && sovDepositLocked) ||
      (asset === Asset.ETH && ethDepositLocked) ||
      (asset === Asset.BNB && bnbDepositLocked) ||
      (asset === Asset.XUSD && xusdDepositLocked),
    [
      bridgeLocked,
      asset,
      sovDepositLocked,
      ethDepositLocked,
      bnbDepositLocked,
      xusdDepositLocked,
    ],
  );

  const assetWithdrawLocked = useMemo(
    () =>
      bridgeLocked ||
      (asset === Asset.SOV && sovWithdrawLocked) ||
      (asset === Asset.ETH && ethWithdrawLocked) ||
      (asset === Asset.BNB && bnbWithdrawLocked) ||
      (asset === Asset.XUSD && xusdWithdrawLocked),
    [
      bridgeLocked,
      asset,
      sovWithdrawLocked,
      ethWithdrawLocked,
      bnbWithdrawLocked,
      xusdWithdrawLocked,
    ],
  );

  return {
    assetDepositLocked,
    assetWithdrawLocked,
  };
};

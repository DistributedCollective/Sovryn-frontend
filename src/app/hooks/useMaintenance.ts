import { useSelector } from 'react-redux';
import { selectMaintenance } from 'store/global/maintenance-store/selectors';
import { MaintenanceStates } from 'store/global/maintenance-store/types';

// items and values should match those from Maintenance db table
enum States {
  FULL = 'full',
  OPEN_MARGIN_TRADES = 'openMarginTrades',
  ADD_TO_MARGIN_TRADES = 'addToMarginTrades',
  CLOSE_MARGIN_TRADES = 'closeMarginTrades',
  SPOT_TRADES = 'spotTrades',
  SWAP_TRADES = 'swapTrades',
  DEPOSIT_LEND = 'depositLend',
  WITHDRAW_LEND = 'withdrawLend',
  START_BORROW = 'startBorrow',
  STOP_BORROW = 'stopBorrow',
  ADD_LIQUIDITY = 'addLiquidity',
  REMOVE_LIQUIDITY = 'removeLiquidity',
  FASTBTC = 'fastBTC',
  TRANSACK = 'transack',
  //bridge states not needed in dapp
  STAKING = 'staking',
  UNSTAKING = 'unstaking',
  WITHDRAW_FEES = 'withdrawEarnedFees',
  DELEGATE_STAKES = 'delegateStakes',
  DELEGATE_VESTS = 'delegateVests',
  WITHDRAW_VESTS = 'withdrawVests',
  CLAIM_REWARDS = 'claimRewards',
}

type MaintenanceResult = {
  [key in States]: boolean;
};

export function useMaintenance() {
  const maintenanceStates: MaintenanceStates = useSelector(selectMaintenance);

  const checkMaintenance = (name: States): boolean => {
    if (!!process.env.REACT_APP_BYPASS_MAINTENANCE) {
      return false;
    }
    return maintenanceStates[name]?.maintenance_active;
  };

  const checkMaintenances = (): MaintenanceResult => {
    return Object.keys(maintenanceStates).reduce(
      (res, curr) =>
        Object.assign(res, {
          [curr]: checkMaintenance(curr as States),
        }),
      {} as MaintenanceResult,
    );
  };

  return { checkMaintenance, checkMaintenances, States };
}

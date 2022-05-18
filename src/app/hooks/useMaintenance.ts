import { useSelector } from 'react-redux';
import { selectMaintenance } from 'store/global/maintenance-store/selectors';
import { MaintenanceStates } from 'store/global/maintenance-store/types';

// items and values should match those from Maintenance db table
enum States {
  FULL = 'full',
  OPEN_MARGIN_TRADES = 'openMarginTrades',
  ADD_TO_MARGIN_TRADES = 'addToMarginTrades',
  CLOSE_MARGIN_TRADES = 'closeMarginTrades',
  MARGIN_LIMIT = 'openMarginLimit',
  CLOSE_MARGIN_LIMIT = 'closeMarginLimit',
  SPOT_TRADES = 'spotTrades',
  SPOT_LIMIT = 'openSpotLimit',
  CLOSE_SPOT_LIMIT = 'closeSpotLimit',
  SWAP_TRADES = 'swapTrades',
  DEPOSIT_LEND = 'depositLend',
  WITHDRAW_LEND = 'withdrawLend',
  START_BORROW = 'startBorrow',
  STOP_BORROW = 'stopBorrow',
  ADD_LIQUIDITY = 'addLiquidity',
  REMOVE_LIQUIDITY = 'removeLiquidity',
  FASTBTC = 'fastBTC',
  TRANSACK = 'transack',

  BRIDGE = 'bridge',
  ETH_BRIDGE = 'ethBridge',
  BSC_BRIDGE = 'bscBridge',
  ETH_BRIDGE_DEPOSIT = 'ethBridgeDeposit',
  ETH_BRIDGE_WITHDRAW = 'ethBridgeWithdraw',
  BSC_BRIDGE_DEPOSIT = 'bscBridgeDeposit',
  BSC_BRIDGE_WITHDRAW = 'bscBridgeWithdraw',
  BRIDGE_SOV_DEPOSIT = 'bridgeSOVDeposit',
  BRIDGE_SOV_WITHDRAW = 'bridgeSOVWithdraw',
  BRIDGE_XUSD_DEPOSIT = 'bridgeXUSDDeposit',
  BRIDGE_XUSD_WITHDRAW = 'bridgeXUSDWithdraw',
  BRIDGE_ETH_DEPOSIT = 'bridgeETHDeposit',
  BRIDGE_ETH_WITHDRAW = 'bridgeETHWithdraw',
  BRIDGE_BNB_DEPOSIT = 'bridgeBNBDeposit',
  BRIDGE_BNB_WITHDRAW = 'bridgeBNBWithdraw',

  STAKING = 'staking',
  UNSTAKING = 'unstaking',
  WITHDRAW_FEES = 'withdrawEarnedFees',
  DELEGATE_STAKES = 'delegateStakes',
  DELEGATE_VESTS = 'delegateVests',
  WITHDRAW_VESTS = 'withdrawVests',

  CLAIM_REWARDS = 'claimRewards',
  CLAIM_REWARD_SOV = 'claimRewardSov',
  CLAIM_LIQUID_SOV = 'claimLiquidSov',
  CLAIM_FEES_EARNED = 'claimFeesEarned',

  PERPETUALS = 'perpetuals',
  PERPETUALS_ACCOUNT_FUND = 'perpetualsAccountFund',
  PERPETUALS_ACCOUNT_WITHDRAW = 'perpetualsAccountWithdraw',
  PERPETUALS_ACCOUNT_TRANSFER = 'perpetualsAccountTransfer',
  PERPETUALS_TRADE = 'perpetualsTrade',
  PERPETUALS_GSN = 'perpetualsGsn',
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
    return maintenanceStates[name]?.isInMaintenance;
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

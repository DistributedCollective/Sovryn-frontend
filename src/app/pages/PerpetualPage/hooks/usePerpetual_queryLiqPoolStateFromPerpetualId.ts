import { LiqPoolState } from '../utils/perpUtils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';

export const initialLiqPoolState: LiqPoolState = {
  fPnLparticipantsCashCC: 0,
  fAMMFundCashCC: 0,
  fDefaultFundCashCC: 0,
  iPriceUpdateTimeSec: 0,
  fTargetAMMFundSize: 0,
  fTargetDFSize: 0,
  iLastTargetPoolSizeTime: 0,
  iLastFundingTime: 0,
  isRunning: false,
};

export const usePerpetual_queryLiqPoolStateFromPerpetualId = (
  perpetualId: string,
) => {
  const [liqPoolState, setLiqPoolState] = useState(initialLiqPoolState);

  const fetchPoolState = useCallback((poolId: string) => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getLiquidityPool',
        [poolId],
      )
      .then(result => setLiqPoolState(parseLiqPoolState(result)));
  }, []);

  const fetch = useCallback(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getPoolIdByPerpetualId',
        [perpetualId],
      )
      .then(result => {
        fetchPoolState(result);
      });
  }, [perpetualId, fetchPoolState]);

  useEffect(fetch, [fetch]);

  return useMemo(
    () => ({
      refetch: fetch,
      result: liqPoolState,
    }),
    [fetch, liqPoolState],
  );
};

const parseLiqPoolState = (pool: any): LiqPoolState => ({
  fPnLparticipantsCashCC: ABK64x64ToFloat(pool.fPnLparticipantsCashCC),
  fAMMFundCashCC: ABK64x64ToFloat(pool.fAMMFundCashCC),
  fDefaultFundCashCC: ABK64x64ToFloat(pool.fDefaultFundCashCC),
  iPriceUpdateTimeSec: ABK64x64ToFloat(pool.iPriceUpdateTimeSec),
  fTargetAMMFundSize: ABK64x64ToFloat(pool.fTargetAMMFundSize),
  fTargetDFSize: ABK64x64ToFloat(pool.fTargetDFSize),
  iLastTargetPoolSizeTime: ABK64x64ToFloat(pool.iLastTargetPoolSizeTime),
  iLastFundingTime: ABK64x64ToFloat(pool.iLastFundingTime),
  isRunning: pool.isRunning,
});

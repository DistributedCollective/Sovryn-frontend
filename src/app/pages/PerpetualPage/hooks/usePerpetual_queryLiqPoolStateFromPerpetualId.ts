import { LiqPoolState } from '@sovryn/perpetual-swap';
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
      .then(result => setLiqPoolState(parseLiqPoolState(result)))
      .catch(console.error);
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

const parseLiqPoolState = (response: any): LiqPoolState => ({
  fPnLparticipantsCashCC: ABK64x64ToFloat(response[6]),
  fAMMFundCashCC: ABK64x64ToFloat(response[7]),
  fDefaultFundCashCC: ABK64x64ToFloat(response[8]),
  iPriceUpdateTimeSec: ABK64x64ToFloat(response[9]),
  fTargetAMMFundSize: ABK64x64ToFloat(response[10]),
  fTargetDFSize: ABK64x64ToFloat(response[11]),
  iLastTargetPoolSizeTime: ABK64x64ToFloat(response[12]),
  iLastFundingTime: ABK64x64ToFloat(response[13]),
  isRunning: response[1],
});

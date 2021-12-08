import { LiqPoolState } from '../utils/perpUtils';
import { useEffect, useState } from 'react';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils/contractUtils';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { usePerpetual_getLatestTradeId } from './usePerpetual_getLatestTradeId';

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

export const usePerpetual_queryLiqPoolStateFromPerpetualId = (): LiqPoolState => {
  const [liqPoolState, setLiqPoolState] = useState(initialLiqPoolState);
  const [poolId, setPoolId] = useState('0');

  const latestTradeId = usePerpetual_getLatestTradeId();

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getPoolIdByPerpetualId',
        [PERPETUAL_ID],
      )
      .then(result => setPoolId(result));
  }, []);

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getLiquidityPool',
        [poolId],
      )
      .then(result => setLiqPoolState(parseLiqPoolState(result)));
  }, [poolId, latestTradeId]);

  return liqPoolState;
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

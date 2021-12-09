import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { AMMState } from '../utils/perpUtils';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils/contractUtils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { useEffect, useState } from 'react';
import { usePerpetual_getLatestTradeId } from './usePerpetual_getLatestTradeId';

export const initialAmmState: AMMState = {
  L1: 0,
  K2: 0,
  M1: 0,
  M2: 0,
  M3: 0,
  fCurrentTraderExposureEMA: 0,
  indexS2PriceData: 0,
  indexS3PriceData: 0,
  indexS2PriceDataOracle: 0,
  indexS3PriceDataOracle: 0,
  currentMarkPremiumRate: 0,
  currentPremiumRate: 0,
};

export const usePerpetual_queryAmmState = (): AMMState => {
  const [ammState, setAmmState] = useState(initialAmmState);

  const latestTradeId = usePerpetual_getLatestTradeId();

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getAMMState',
        [PERPETUAL_ID],
      )
      .then(result => setAmmState(parseAmmState(result)));
  }, [latestTradeId]);

  return ammState;
};

const parseAmmState = (response: any): AMMState => ({
  L1: ABK64x64ToFloat(response[0]),
  K2: ABK64x64ToFloat(response[1]),
  M1: ABK64x64ToFloat(response[2]),
  M2: ABK64x64ToFloat(response[3]),
  M3: ABK64x64ToFloat(response[4]),
  fCurrentTraderExposureEMA: ABK64x64ToFloat(response[5]),
  indexS2PriceData: ABK64x64ToFloat(response[6]),
  indexS3PriceData: ABK64x64ToFloat(response[7]),
  currentMarkPremiumRate: ABK64x64ToFloat(response[8]),
  currentPremiumRate: ABK64x64ToFloat(response[9]),
  indexS2PriceDataOracle: ABK64x64ToFloat(response[10]),
  indexS3PriceDataOracle: ABK64x64ToFloat(response[11]),
});

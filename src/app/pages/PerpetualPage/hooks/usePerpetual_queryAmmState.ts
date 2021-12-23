import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { AMMState } from '../utils/perpUtils';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { useEffect, useState, useCallback, useMemo } from 'react';

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
  defFundToTargetRatio: 0,
};

export const usePerpetual_queryAmmState = (perpetualId: string) => {
  const [ammState, setAmmState] = useState(initialAmmState);

  const fetch = useCallback(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getAMMState',
        [perpetualId],
      )
      .then(result => setAmmState(parseAmmState(result)));
  }, [perpetualId]);

  useEffect(fetch, [fetch]);

  return useMemo(
    () => ({
      refetch: fetch,
      result: ammState,
    }),
    [fetch, ammState],
  );
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
  indexS2PriceDataOracle: ABK64x64ToFloat(response[10]),
  indexS3PriceDataOracle: ABK64x64ToFloat(response[11]),
  currentMarkPremiumRate: ABK64x64ToFloat(response[8]),
  currentPremiumRate: ABK64x64ToFloat(response[9]),
  defFundToTargetRatio: ABK64x64ToFloat(response[12]),
});

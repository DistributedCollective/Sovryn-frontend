import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { PerpParameters } from '../utils/perpUtils';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { BigNumber } from 'ethers';

export const initialPerpParameters: PerpParameters = {
  poolId: 0,
  oracleS2Addr: '',
  oracleS3Addr: '',

  fInitialMarginRateAlpha: 0,
  fMarginRateBeta: 0,
  fInitialMarginRateCap: 0,
  fOpenInterest: 0,
  fMaintenanceMarginRateAlpha: 0,
  fTreasuryFeeRate: 0,
  fPnLPartRate: 0,
  fReferralRebateRate: 0,
  fLiquidationPenaltyRate: 0,
  fMinimalSpread: 0,
  fMinimalSpreadInStress: 0,
  fLotSizeBC: 0,
  fFundingRateClamp: 0,
  fMarkPriceEMALambda: 0,
  fSigma2: 0,
  fSigma3: 0,
  fRho23: 0,
  // default fund / AMM fund
  fStressReturnS2_0: 0,
  fStressReturnS2_1: 0,
  fStressReturnS3_0: 0,
  fStressReturnS3_1: 0,
  fDFCoverNRate: 0,
  fDFLambda_0: 0,
  fDFLambda_1: 0,
  fAMMTargetDD_0: 0,
  fAMMTargetDD_1: 0,
  fAMMMinSizeCC: 0,
  fMinimalTraderExposureEMA: 0,
  fMaximalTradeSizeBumpUp: 0,
  // funding state
  fCurrentFundingRate: 0,
  fUnitAccumulatedFunding: 0,
};

export const usePerpetual_queryPerpParameters = (perpetualId: string) => {
  const [perpParameters, setPerpParameters] = useState(initialPerpParameters);

  const fetch = useCallback(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getPerpetual',
        [perpetualId],
      )
      .catch(e => console.error(e))
      .then(result => result && setPerpParameters(parsePerpParameter(result)));
  }, [perpetualId]);

  useEffect(fetch, [fetch]);

  return useMemo(
    () => ({
      refetch: fetch,
      result: perpParameters,
    }),
    [fetch, perpParameters],
  );
};

const parsePerpParameter = (response: any): PerpParameters => ({
  fOpenInterest: 0,
  fInitialMarginRateAlpha: ABK64x64ToFloat(response.fInitialMarginRateAlpha),
  fMarginRateBeta: ABK64x64ToFloat(response.fMarginRateBeta),
  fInitialMarginRateCap: ABK64x64ToFloat(response.fInitialMarginRateCap),
  fMaintenanceMarginRateAlpha: ABK64x64ToFloat(
    response.fMaintenanceMarginRateAlpha,
  ),
  fTreasuryFeeRate: ABK64x64ToFloat(response.fTreasuryFeeRate),
  fPnLPartRate: ABK64x64ToFloat(response.fPnLPartRate),
  fReferralRebateRate: ABK64x64ToFloat(response.fReferralRebateRate),
  fLiquidationPenaltyRate: ABK64x64ToFloat(response.fLiquidationPenaltyRate),
  fMinimalSpread: ABK64x64ToFloat(response.fMinimalSpread),
  fMinimalSpreadInStress: ABK64x64ToFloat(response.fMinimalSpreadInStress),
  fLotSizeBC: ABK64x64ToFloat(response.fLotSizeBC),
  fFundingRateClamp: ABK64x64ToFloat(response.fFundingRateClamp),
  fMarkPriceEMALambda: ABK64x64ToFloat(response.fMarkPriceEMALambda),
  fSigma2: ABK64x64ToFloat(response.fSigma2),
  fSigma3: ABK64x64ToFloat(response.fSigma3),
  fRho23: ABK64x64ToFloat(response.fRho23),
  // default fund / AMM fund
  fStressReturnS2_0: ABK64x64ToFloat(response.fStressReturnS2[0]),
  fStressReturnS2_1: ABK64x64ToFloat(response.fStressReturnS2[1]),
  fStressReturnS3_0: ABK64x64ToFloat(response.fStressReturnS3[0]),
  fStressReturnS3_1: ABK64x64ToFloat(response.fStressReturnS3[1]),
  fDFCoverNRate: ABK64x64ToFloat(response.fDFCoverNRate),
  fDFLambda_0: ABK64x64ToFloat(response.fDFLambda[0]),
  fDFLambda_1: ABK64x64ToFloat(response.fDFLambda[1]),
  fAMMTargetDD_0: ABK64x64ToFloat(response.fAMMTargetDD[0]),
  fAMMTargetDD_1: ABK64x64ToFloat(response.fAMMTargetDD[1]),
  fAMMMinSizeCC: ABK64x64ToFloat(response.fAMMMinSizeCC),
  fMinimalTraderExposureEMA: ABK64x64ToFloat(
    response.fMinimalTraderExposureEMA,
  ),
  fMaximalTradeSizeBumpUp: ABK64x64ToFloat(response.fMaximalTradeSizeBumpUp),
  fCurrentFundingRate: ABK64x64ToFloat(response.fCurrentFundingRate),
  fUnitAccumulatedFunding: ABK64x64ToFloat(response.fUnitAccumulatedFunding),

  poolId: response.poolId,
  oracleS2Addr: response.oracleS2Addr,
  oracleS3Addr: response.oracleS3Addr,
});

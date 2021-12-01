import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { PerpParameters } from '../utils/perpUtils';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils/contractUtils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';

export const initialPerpParameters: PerpParameters = {
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
  fIncentiveSpread: 0,
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

export const usePerpetual_queryPerpParameters = (): PerpParameters => {
  const [perpParameters, setPerpParameters] = useState(initialPerpParameters);

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getPerpetual',
        [PERPETUAL_ID],
      )
      .catch(e => console.error(e))
      .then(result => result && setPerpParameters(parsePerpParameter(result)));
  }, []);

  return perpParameters;
};

const parsePerpParameter = (response: any): PerpParameters => ({
  fCurrentFundingRate: ABK64x64ToFloat(response[9]),
  fUnitAccumulatedFunding: ABK64x64ToFloat(response[10]),
  fOpenInterest: ABK64x64ToFloat(response[12]),
  fInitialMarginRateAlpha: ABK64x64ToFloat(response[16]),
  fMarginRateBeta: ABK64x64ToFloat(response[17]),
  fInitialMarginRateCap: ABK64x64ToFloat(response[18]),
  fMaintenanceMarginRateAlpha: ABK64x64ToFloat(response[19]),
  fTreasuryFeeRate: ABK64x64ToFloat(response[20]),
  fPnLPartRate: ABK64x64ToFloat(response[21]),
  fReferralRebateRate: ABK64x64ToFloat(response[22]),
  fLiquidationPenaltyRate: ABK64x64ToFloat(response[23]),
  fMinimalSpread: ABK64x64ToFloat(response[24]),
  fIncentiveSpread: ABK64x64ToFloat(response[25]),
  fLotSizeBC: ABK64x64ToFloat(response[26]),
  fFundingRateClamp: ABK64x64ToFloat(response[27]),
  fMarkPriceEMALambda: ABK64x64ToFloat(response[28]),
  fSigma2: ABK64x64ToFloat(response[29]),
  fSigma3: ABK64x64ToFloat(response[30]),
  fRho23: ABK64x64ToFloat(response[31]),
  fStressReturnS2_0: ABK64x64ToFloat(response[33][0]),
  fStressReturnS2_1: ABK64x64ToFloat(response[33][1]),
  fStressReturnS3_0: ABK64x64ToFloat(response[34][0]),
  fStressReturnS3_1: ABK64x64ToFloat(response[34][1]),
  fDFCoverNRate: ABK64x64ToFloat(response[35]),
  fDFLambda_0: ABK64x64ToFloat(response[36][0]),
  fDFLambda_1: ABK64x64ToFloat(response[36][1]),
  fAMMTargetDD_0: ABK64x64ToFloat(response[37][0]),
  fAMMTargetDD_1: ABK64x64ToFloat(response[37][1]),
  fAMMMinSizeCC: ABK64x64ToFloat(response[38]),
  fMinimalTraderExposureEMA: ABK64x64ToFloat(response[39]),
  fMaximalTradeSizeBumpUp: ABK64x64ToFloat(response[41]),
});

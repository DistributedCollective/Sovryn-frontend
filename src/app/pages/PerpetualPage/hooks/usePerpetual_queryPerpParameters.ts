import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { PerpParameters } from '../temporaryUtils';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';

const initialPerpParameters: PerpParameters = {
  fInitialMarginRateAlpha: 0,
  fMarginRateBeta: 0,
  fInitialMarginRateCap: 0,
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
  fDFCoverN: 0,
  fDFLambda_0: 0,
  fDFLambda_1: 0,
  fAMMTargetDD: 0,
  fAMMMinSizeCC: 0,
  fMinimalTraderExposureEMA: 0,
  fMaximalTradeSizeBumpUp: 0,
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
      .catch(e => console.log(e))
      .then(result => result && setPerpParameters(parsePerpParameter(result)));
  }, []);

  return perpParameters;
};

const parsePerpParameter = (response: any): PerpParameters => ({
  fInitialMarginRateAlpha: ABK64x64ToFloat(response[18]),
  fMarginRateBeta: ABK64x64ToFloat(response[19]),
  fInitialMarginRateCap: ABK64x64ToFloat(response[20]),
  fMaintenanceMarginRateAlpha: ABK64x64ToFloat(response[21]),
  fTreasuryFeeRate: ABK64x64ToFloat(response[22]),
  fPnLPartRate: ABK64x64ToFloat(response[23]),
  fReferralRebateRate: ABK64x64ToFloat(response[24]),
  fLiquidationPenaltyRate: ABK64x64ToFloat(response[25]),
  fMinimalSpread: ABK64x64ToFloat(response[26]),
  fIncentiveSpread: ABK64x64ToFloat(response[27]),
  fLotSizeBC: ABK64x64ToFloat(response[28]),
  fFundingRateClamp: ABK64x64ToFloat(response[29]),
  fMarkPriceEMALambda: ABK64x64ToFloat(response[30]),
  fSigma2: ABK64x64ToFloat(response[31]),
  fSigma3: ABK64x64ToFloat(response[32]),
  fRho23: ABK64x64ToFloat(response[33]),
  fStressReturnS2_0: ABK64x64ToFloat(response[35][0]),
  fStressReturnS2_1: ABK64x64ToFloat(response[35][1]),
  fStressReturnS3_0: ABK64x64ToFloat(response[36][0]),
  fStressReturnS3_1: ABK64x64ToFloat(response[36][1]),
  fDFCoverN: ABK64x64ToFloat(response[37]),
  fDFLambda_0: ABK64x64ToFloat(response[38][0]),
  fDFLambda_1: ABK64x64ToFloat(response[38][1]),
  fAMMTargetDD: ABK64x64ToFloat(response[39]),
  fAMMMinSizeCC: ABK64x64ToFloat(response[40]),
  fMinimalTraderExposureEMA: ABK64x64ToFloat(response[41]),
  fMaximalTradeSizeBumpUp: ABK64x64ToFloat(response[43]),
});

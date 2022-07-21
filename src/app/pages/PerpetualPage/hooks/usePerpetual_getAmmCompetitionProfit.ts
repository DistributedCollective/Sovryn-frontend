import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import {
  bridgeNetwork,
  MultiCallData,
  MultiCallResult,
} from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useCallback, useMemo, useState } from 'react';
import { getContract } from 'utils/blockchain/contract-helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { PERPETUAL_CHAIN } from '../types';
import { usePerpetual_queryLiqPoolId } from './usePerpetual_queryLiqPoolId';

const pair = PerpetualPairDictionary.get(PerpetualPairType.BTCUSD);
const gnosisSafeAddress = '0xC12742a5b12F76622350fB7558cc2B4A9c7de8e0';

export const usePerpetual_getAmmCompetitionProfit = () => {
  const [multiCallResult, setMultiCallResult] = useState<
    MultiCallResult | undefined
  >(undefined);
  const { result: poolId } = usePerpetual_queryLiqPoolId(pair.id);

  const multiCallData: MultiCallData[] = useMemo(
    () => [
      {
        abi: getContract('perpetualManager').abi,
        address: getContract('perpetualManager').address,
        fnName: 'getLiquidityPool',
        key: 'pnlParticipantFundCash',
        args: [poolId],
        parser: value =>
          value?.[0] ? ABK64x64ToFloat(value?.[0]?.[5] || 0) : 0,
      },
      {
        abi: getContract('perpetuals_lpShareToken').abi,
        address: getContract('perpetuals_lpShareToken').address,
        fnName: 'totalSupply',
        key: 'lpShareTokenTotalSupply',
        args: [],
        parser: value => (value?.[0] ? numberFromWei(value[0].toString()) : 0),
      },
      {
        abi: getContract('perpetuals_lpShareToken').abi,
        address: getContract('perpetuals_lpShareToken').address,
        fnName: 'balanceOf',
        key: 'lpShareTokenBalanceOf',
        args: [gnosisSafeAddress],
        parser: value => (value?.[0] ? numberFromWei(value[0].toString()) : 0),
      },
    ],
    [poolId],
  );

  const getMultiCallResult = useCallback(() => {
    bridgeNetwork
      .multiCall(PERPETUAL_CHAIN, multiCallData)
      .then(result => setMultiCallResult(result))
      .catch(console.error);
  }, [multiCallData]);

  const result = useMemo(() => {
    if (!multiCallResult || !multiCallResult.returnData) {
      return 0;
    }

    const {
      lpShareTokenBalanceOf,
      lpShareTokenTotalSupply,
      pnlParticipantFundCash,
    } = multiCallResult.returnData;

    return (
      (lpShareTokenBalanceOf / lpShareTokenTotalSupply) * pnlParticipantFundCash
    );
  }, [multiCallResult]);

  return {
    result,
    refetch: getMultiCallResult,
  };
};

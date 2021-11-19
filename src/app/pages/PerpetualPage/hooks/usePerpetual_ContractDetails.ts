import { useEffect, useState } from 'react';
import { Nullable } from 'types';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { useBlockSync } from '../../../hooks/useAccount';
import { getIndexPrice, getMarkPrice } from '../utils/perpUtils';
import { usePerpetual_queryAmmState } from './usePerpetual_queryAmmState';
import { usePerpetual_queryPerpParameters } from './usePerpetual_queryPerpParameters';

export type PerpetualContractDetailsData = {
  markPrice: number;
  indexPrice: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  lotSize: number;
  minTradeAmount: number;
};

export const usePerpetual_ContractDetails = (pair: PerpetualPair) => {
  const blockId = useBlockSync();
  const [data, setData] = useState<Nullable<PerpetualContractDetailsData>>();

  const ammState = usePerpetual_queryAmmState();
  const perpetualParameters = usePerpetual_queryPerpParameters();

  useEffect(
    () =>
      setData({
        markPrice: getMarkPrice(ammState),
        indexPrice: getIndexPrice(ammState),
        volume24h: 16348900, // TODO: Implement later, we don't have a util function for it yet
        openInterest: 57466600, // TODO: Implement later, we don't have a util function for it yet
        fundingRate: perpetualParameters.fCurrentFundingRate,
        lotSize: perpetualParameters.fLotSizeBC,
        minTradeAmount: perpetualParameters.fLotSizeBC,
      }),
    [
      blockId,
      ammState,
      perpetualParameters.fCurrentFundingRate,
      perpetualParameters.fLotSizeBC,
    ],
  );

  return data;
};

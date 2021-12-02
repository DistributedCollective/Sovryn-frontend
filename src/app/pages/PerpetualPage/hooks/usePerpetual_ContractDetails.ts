import { Bar } from 'app/components/TradingChart/datafeed';
import { useContext, useEffect, useState } from 'react';
import { Nullable } from 'types';
import { useBlockSync } from '../../../hooks/useAccount';
import { makeApiRequest } from '../components/TradingChart/helpers';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { PERPETUAL_ID } from '../utils/contractUtils';
import { getIndexPrice, getMarkPrice } from '../utils/perpUtils';
import { CandleDuration } from './graphql/useGetCandles';

export type PerpetualContractDetailsData = {
  markPrice: number;
  indexPrice: number;
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  lotSize: number;
  minTradeAmount: number;
};

export const usePerpetual_ContractDetails = () => {
  const blockId = useBlockSync();
  const [volume24h, setVolume24h] = useState(0);
  const [data, setData] = useState<Nullable<PerpetualContractDetailsData>>();

  const { ammState, perpetualParameters } = useContext(PerpetualQueriesContext);

  useEffect(() => {
    const get24hVolume = async () => {
      const timestampNow = new Date().getTime() / 1000;
      const timestampYesterday = Math.ceil(timestampNow - 24 * 3600);

      const data: Bar[] = await makeApiRequest(
        CandleDuration.D_1,
        PERPETUAL_ID,
        timestampYesterday,
        1,
        true,
      );

      if (data && data[0]?.volume) {
        setVolume24h(data[0]?.volume);
      }
    };

    get24hVolume().catch(console.error);
  }, []);

  useEffect(
    () =>
      setData({
        markPrice: getMarkPrice(ammState),
        indexPrice: getIndexPrice(ammState),
        volume24h: volume24h,
        openInterest: perpetualParameters.fOpenInterest,
        fundingRate: perpetualParameters.fCurrentFundingRate,
        lotSize: perpetualParameters.fLotSizeBC,
        minTradeAmount: perpetualParameters.fLotSizeBC,
      }),
    [
      blockId,
      ammState,
      perpetualParameters.fCurrentFundingRate,
      perpetualParameters.fLotSizeBC,
      perpetualParameters.fOpenInterest,
      volume24h,
    ],
  );

  return data;
};

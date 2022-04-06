import { Bar } from 'app/components/TradingChart/datafeed';
import { useContext, useEffect, useState, useMemo } from 'react';
import { Nullable } from 'types';
import { makeApiRequest } from '../components/TradingChart/helpers';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { CandleDuration } from './graphql/useGetCandles';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useApolloClient } from '@apollo/client';
import { usePerpetual_getCurrentPairId } from './usePerpetual_getCurrentPairId';

export type PerpetualContractDetailsData = {
  volume24h: number;
  openInterest: number;
  fundingRate: number;
  lotSize: number;
  minTradeAmount: number;
};

export const usePerpetual_ContractDetails = (pairType: PerpetualPairType) => {
  const [volume24h, setVolume24h] = useState(0);
  const [data, setData] = useState<Nullable<PerpetualContractDetailsData>>();

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { ammState, perpetualParameters, lotSize } = perpetuals[currentPairId];
  const client = useApolloClient();

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  useEffect(() => {
    const get24hVolume = async () => {
      const timestampYesterday = Date.now() - 24 * 3600 * 1000;

      const data: Bar[] = await makeApiRequest(
        client,
        CandleDuration.H_1,
        pair.id,
        Math.ceil(timestampYesterday / 1000),
        24,
        true,
      );

      if (data) {
        let total = 0;
        for (let i = 0; i < data.length; i++) {
          // make sure to only use candles that are within the last
          if (data[i] && data[i].time > timestampYesterday) {
            total += data[i].volume || 0;
          }
        }
        setVolume24h(total);
      }
    };

    get24hVolume().catch(console.error);
    const intervalId = setInterval(
      () => get24hVolume().catch(console.error),
      5 * 60 * 1000, // 5 minutes
    );

    return () => clearInterval(intervalId);
  }, [pair.id, client]);

  useEffect(
    () =>
      setData({
        volume24h: volume24h,
        openInterest: perpetualParameters.fOpenInterest,
        fundingRate: perpetualParameters.fCurrentFundingRate,
        lotSize,
        minTradeAmount: perpetualParameters.fLotSizeBC,
      }),
    [
      ammState,
      lotSize,
      perpetualParameters.fCurrentFundingRate,
      perpetualParameters.fLotSizeBC,
      perpetualParameters.fOpenInterest,
      volume24h,
    ],
  );

  return data;
};

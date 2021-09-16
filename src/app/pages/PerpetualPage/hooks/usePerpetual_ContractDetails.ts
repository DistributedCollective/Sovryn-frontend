import { useEffect, useState } from 'react';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import { useBlockSync } from '../../../hooks/useAccount';

export type PerpetualContractDetailsData = {
  indexPrice: number;
  volume24h: number;
  openInterest: number;
  fundingRate4h: number;
  contractValue: number;
  lotSize: number;
  minTradeAmount: number;
};

const placeholderFetch = async (
  pair: PerpetualPair,
  blockId: number,
): Promise<PerpetualContractDetailsData> => {
  console.warn(
    'PlaceholderFetch used by usePerpetual_ContractDetails! NOT IMPLEMENTED YET!',
  );

  return new Promise(resolve =>
    resolve({
      indexPrice: 40000,
      volume24h: 16348900,
      openInterest: 57466600,
      fundingRate4h: 0.0001,
      contractValue: 10,
      lotSize: 100,
      minTradeAmount: 100,
    }),
  );
};

export const usePerpetual_ContractDetails = (pair: PerpetualPair) => {
  const blockId = useBlockSync();
  const [data, setData] = useState<PerpetualContractDetailsData | null>();

  useEffect(() => {
    // TODO: implement ContractDetails data fetching
    placeholderFetch(pair, blockId).then(data => {
      setData(data);
    });
  }, [pair, blockId]);

  return data;
};

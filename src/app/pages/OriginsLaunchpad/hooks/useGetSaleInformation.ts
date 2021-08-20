import { useEffect, useState } from 'react';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { DepositType, ISaleInformation, VerificationType } from '../types';

const timestampToString = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

export const useGetSaleInformation = (tierId: number) => {
  const [saleInfo, setSaleInfo] = useState<ISaleInformation>({
    minAmount: '0',
    maxAmount: '0',
    remainingTokens: 0,
    saleEnd: '',
    depositRate: 1,
    participatingWallets: '0',
    depositToken: Asset.RBTC,
    depositType: DepositType.RBTC,
    verificationType: VerificationType.None,
    totalSaleAllocation: 0,
  });

  useEffect(() => {
    contractReader
      .call('originsBase', 'readTierPartA', [tierId])
      .then(result => {
        setSaleInfo(prevValue => ({
          ...prevValue,
          minAmount: result['_minAmount'],
          maxAmount: result['_maxAmount'],
          remainingTokens: result['_remainingTokens'],
          saleStart: result['_saleStartTS'],
          saleEnd: timestampToString(result['_saleEnd']),
          depositRate: result['_depositRate'],
        }));
      });
  }, [tierId]);

  useEffect(() => {
    contractReader
      .call<string>('originsBase', 'getParticipatingWalletCountPerTier', [
        tierId,
      ])
      .then(result =>
        setSaleInfo(prevValue => ({
          ...prevValue,
          participatingWallets: result,
        })),
      );
  }, [tierId]);

  useEffect(() => {
    contractReader
      .call('originsBase', 'readTierPartB', [tierId])
      .then(result => {
        setSaleInfo(prevValue => ({
          ...prevValue,
          depositToken:
            result['_depositType'] === DepositType.RBTC
              ? Asset.RBTC
              : assetByTokenAddress(result['_depositToken']),
          depositType: result['_depositType'],
          verificationType: result['_verificationType'],
        }));
      });
  }, [tierId]);

  useEffect(() => {
    contractReader
      .call<number>('originsBase', 'getTotalTokenAllocationPerTier', [tierId])
      .then(result => {
        setSaleInfo(prevValue => ({
          ...prevValue,
          totalSaleAllocation: result,
        }));
      });
  }, [tierId]);

  return saleInfo;
};

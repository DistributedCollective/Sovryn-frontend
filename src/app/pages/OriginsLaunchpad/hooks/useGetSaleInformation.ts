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
  });

  useEffect(() => {
    contractReader
      .call('originsBase', 'readTierPartA', [tierId])
      .then(result => {
        setSaleInfo(prevValue => ({
          ...prevValue,
          minAmount: result[0],
          maxAmount: result[1],
          remainingTokens: result[2],
          saleStart: result[3],
          saleEnd: timestampToString(result[4]),
          depositRate: result[9],
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
            result[1] === DepositType.RBTC
              ? Asset.RBTC
              : assetByTokenAddress(result[0]),
          depositType: result[1],
          verificationType: result[2],
        }));
      });
  }, [tierId]);

  return saleInfo;
};

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { DepositType, ISaleInformation, VerificationType } from '../types';
import { selectTransactions } from 'store/global/transactions-store/selectors';

const timestampToString = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
  });

export const useGetSaleInformation = (tierId: number) => {
  const account = useAccount();
  const transactions = useSelector(selectTransactions);
  const [saleInfo, setSaleInfo] = useState<ISaleInformation>({
    minAmount: '0',
    maxAmount: '0',
    remainingTokens: 0,
    saleStart: '',
    saleEnd: '-',
    period: '',
    depositRate: 1,
    participatingWallets: '0',
    depositToken: Asset.RBTC,
    depositType: DepositType.RBTC,
    verificationType: VerificationType.None,
    totalSaleAllocation: 0,
    totalReceived: '0',
    yourTotalDeposit: '0',
    isClosed: false,
  });

  const saleEndDate = () => {
    const { isClosed, saleStart, period } = saleInfo;
    if (isClosed) {
      return 'Sale Closed';
    }
    if (saleStart && period) {
      return timestampToString(Number(saleStart) + Number(period));
    }
    return '-';
  };

  useEffect(() => {
    contractReader.call('MINTPresale', 'totalRaised', []).then(result =>
      setSaleInfo(preValue => ({
        ...preValue,
        totalReceived: result as string,
      })),
    );
  }, [transactions]);

  useEffect(() => {
    if (account) {
      contractReader
        .call('MINTPresale', 'contributors', [account])
        .then(result =>
          setSaleInfo(preValue => ({
            ...preValue,
            yourTotalDeposit: result as string,
          })),
        );
    }
  }, [account, transactions]);

  useEffect(() => {
    contractReader
      .call<string>('MINTPresale', 'contributorsCounter', [])
      .then(result =>
        setSaleInfo(prevValue => ({
          ...prevValue,
          participatingWallets: result,
        })),
      );
  }, [transactions]);

  useEffect(() => {
    contractReader.call<boolean>('MINTPresale', 'isClosed', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        isClosed: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('MINTPresale', 'openDate', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        saleStart: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('MINTPresale', 'period', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        period: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader
      .call('originsBase', 'readTierPartA', [tierId])
      .then(result => {
        setSaleInfo(prevValue => ({
          ...prevValue,
          minAmount: result['_minAmount'],
          maxAmount: result['_maxAmount'],
          remainingTokens: result['_remainingTokens'],
          depositRate: result['_depositRate'],
        }));
      });
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

  return {
    ...saleInfo,
    saleEnd: saleEndDate(),
  };
};

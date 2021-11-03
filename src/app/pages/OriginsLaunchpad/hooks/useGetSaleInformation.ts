import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { timestampToDateString } from 'utils/dateHelpers';
import { ISaleInformation } from '../types';
import { selectTransactions } from 'store/global/transactions-store/selectors';

export const useGetSaleInformation = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const transactions = useSelector(selectTransactions);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [partsPerMillion, setPartPerMillion] = useState(1);
  const [saleInfo, setSaleInfo] = useState<ISaleInformation>({
    saleStart: '',
    saleEnd: '-',
    period: '',
    depositToken: Asset.RBTC,
    depositRate: 1,
    participatingWallets: '0',
    totalReceived: '0',
    yourTotalDeposit: '0',
    isClosed: false,
  });

  const depositRate = useMemo(() => exchangeRate / partsPerMillion, [
    exchangeRate,
    partsPerMillion,
  ]);

  const saleEndDate = useMemo(() => {
    const { isClosed, saleStart, period } = saleInfo;
    if (isClosed) {
      return t(
        translations.originsLaunchpad.saleDay.buyStep.buyInformationLabels
          .saleClosed,
      );
    }
    if (saleStart && period) {
      return timestampToDateString(Number(saleStart) + Number(period));
    }
    return '-';
  }, [saleInfo, t]);

  useEffect(() => {
    contractReader.call<string>('MYNTPresale', 'totalRaised', []).then(result =>
      setSaleInfo(preValue => ({
        ...preValue,
        totalReceived: result,
      })),
    );
  }, [transactions]);

  useEffect(() => {
    if (account) {
      contractReader
        .call<string>('MYNTPresale', 'contributors', [account])
        .then(result =>
          setSaleInfo(preValue => ({
            ...preValue,
            yourTotalDeposit: result,
          })),
        );
    }
  }, [account, transactions]);

  useEffect(() => {
    contractReader
      .call<string>('MYNTPresale', 'contributorsCounter', [])
      .then(result =>
        setSaleInfo(prevValue => ({
          ...prevValue,
          participatingWallets: result,
        })),
      );
  }, [transactions]);

  useEffect(() => {
    contractReader.call<boolean>('MYNTPresale', 'isClosed', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        isClosed: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('MYNTPresale', 'openDate', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        saleStart: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('MYNTPresale', 'period', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        period: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('MYNT_ctrl', 'contributionToken', [])
      .then(result => {
        setSaleInfo(preValue => ({
          ...preValue,
          depositToken: assetByTokenAddress(result),
        }));
      });
  }, []);

  useEffect(() => {
    contractReader
      .call<number>('MYNTPresale', 'exchangeRate', [])
      .then(result => {
        setExchangeRate(result);
      });
  }, []);

  useEffect(() => {
    contractReader.call<number>('MYNTPresale', 'PPM', []).then(result => {
      setPartPerMillion(result);
    });
  }, []);

  return {
    ...saleInfo,
    saleEnd: saleEndDate,
    depositRate,
  };
};

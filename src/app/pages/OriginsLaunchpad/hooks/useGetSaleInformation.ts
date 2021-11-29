import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from 'locales/i18n';
import { useBlockSync, useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { timestampToDateString } from 'utils/dateHelpers';
import { ISaleInformation } from '../types';

export const useGetSaleInformation = () => {
  const { t } = useTranslation();
  const account = useAccount();
  const blockSync = useBlockSync();
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
    contractReader.call<string>('ZEROPresale', 'totalRaised', []).then(result =>
      setSaleInfo(preValue => ({
        ...preValue,
        totalReceived: result,
      })),
    );
  }, [blockSync]);

  useEffect(() => {
    if (account) {
      contractReader
        .call<string>('ZEROPresale', 'contributors', [account])
        .then(result =>
          setSaleInfo(preValue => ({
            ...preValue,
            yourTotalDeposit: result,
          })),
        );
    }
  }, [account, blockSync]);

  useEffect(() => {
    contractReader
      .call<string>('ZEROPresale', 'contributorsCounter', [])
      .then(result =>
        setSaleInfo(prevValue => ({
          ...prevValue,
          participatingWallets: result,
        })),
      );
  }, [blockSync]);

  useEffect(() => {
    contractReader.call<boolean>('ZEROPresale', 'isClosed', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        isClosed: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('ZEROPresale', 'openDate', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        saleStart: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader.call<string>('ZEROPresale', 'period', []).then(result => {
      setSaleInfo(preValue => ({
        ...preValue,
        period: result,
      }));
    });
  }, []);

  useEffect(() => {
    contractReader
      .call<string>('ZERO_ctrl', 'contributionToken', [])
      .then(result => {
        setSaleInfo(preValue => ({
          ...preValue,
          depositToken: assetByTokenAddress(result),
        }));
      });
  }, []);

  useEffect(() => {
    contractReader
      .call<number>('ZEROPresale', 'exchangeRate', [])
      .then(result => {
        setExchangeRate(result);
      });
  }, []);

  useEffect(() => {
    contractReader.call<number>('ZEROPresale', 'PPM', []).then(result => {
      setPartPerMillion(result);
    });
  }, []);

  return {
    ...saleInfo,
    saleEnd: saleEndDate,
    depositRate,
  };
};

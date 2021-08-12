import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { TradingVolumeData } from 'app/containers/StatsPage/types';
import { useInterval } from 'app/hooks/useInterval';
import axios, { Canceler } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { Title, VolumeValue } from './styled';
import { translations } from 'locales/i18n';

interface ITradingVolumeProps {
  tvlLoading: boolean;
  tvlValueBtc?: number;
  tvlValueUsd?: number;
  refreshInterval?: number;
}

export const TradingVolume: React.FC<ITradingVolumeProps> = ({
  tvlLoading,
  tvlValueBtc,
  tvlValueUsd,
  refreshInterval = 300000,
}) => {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [data, setData] = useState<TradingVolumeData>();
  const [loading, setLoading] = useState(false);
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    setLoading(true);
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/trading-volume', { cancelToken })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url]);

  useInterval(() => {
    getData();
  }, refreshInterval);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tw-rounded-20px tw-bg-black md:tw-mr-12 tw-flex tw-py-5">
      <div className="tw-px-14 tw-py-6 tw-text-center tw-w-1/2 tw-border-r tw-border-white">
        <Title>{t(translations.landingPage.tradingVolume.tvlTitle)}</Title>

        <div>
          {tvlLoading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {tvlValueBtc?.toFixed(4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </VolumeValue>
          )}

          {tvlLoading ? (
            <SkeletonRow />
          ) : (
            <>
              ≈{' '}
              <span className="tw-tracking-wider">
                {tvlValueUsd?.toLocaleString('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="tw-px-14 tw-py-6 tw-text-center tw-w-1/2">
        <Title>
          {t(translations.landingPage.tradingVolume.dayVolumeTitle)}
        </Title>

        <div>
          {loading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {data?.total.btc.twentyFourHours.toFixed(4)}{' '}
              {t(translations.landingPage.tradingVolume.btc)}
            </VolumeValue>
          )}

          {loading ? (
            <SkeletonRow />
          ) : (
            <>
              ≈{' '}
              <span className="tw-tracking-wider">
                {data?.total.usd.twentyFourHours.toLocaleString('en', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                {t(translations.landingPage.tradingVolume.usd)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

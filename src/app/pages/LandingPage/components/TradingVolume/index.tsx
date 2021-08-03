import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { TradingVolumeData } from 'app/containers/StatsPage/types';
import { useInterval } from 'app/hooks/useInterval';
import axios, { Canceler } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { VolumeValue } from './styled';
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
  refreshInterval = 30000,
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
    <div className="tw-rounded-20px tw-bg-black tw-mr-12 tw-flex">
      <div className="tw-px-14 tw-py-11 tw-text-center tw-w-1/2">
        <div className="tw-text-2xl tw-font-semibold tw-tracking-normal tw-uppercase tw-mb-6">
          {t(translations.landingPage.tradingVolume.tvlTitle)}
        </div>

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
              <span>
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

      <div className="tw-px-14 tw-py-11 tw-text-center tw-w-1/2">
        <div className="tw-text-2xl tw-font-semibold tw-tracking-normal tw-uppercase tw-mb-6">
          {t(translations.landingPage.tradingVolume.dayVolumeTitle)}
        </div>

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
              <span>
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

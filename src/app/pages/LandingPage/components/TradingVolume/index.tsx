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
  refreshInterval?: number;
}

export const TradingVolume: React.FC<ITradingVolumeProps> = ({
  refreshInterval = 30000,
}) => {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [data, setData] = useState<TradingVolumeData>();
  const [loading, setLoading] = useState(false);
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
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
    <div>
      <div className="tw-text-2xl tw-font-semibold tw-tracking-normal tw-uppercase tw-mb-6">
        {t(translations.landingPage.tradingVolume.title)}
      </div>
      <div className="tw-flex">
        <div className="tw-mr-20">
          <div className="tw-font-extralight tw-mb-2.5">
            {t(translations.landingPage.tradingVolume.btc)}
          </div>
          {loading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {data?.total.btc.twentyFourHours.toFixed(4)}
            </VolumeValue>
          )}
        </div>

        <div>
          <div className="tw-font-extralight tw-mb-2.5">
            {t(translations.landingPage.tradingVolume.usd)}
          </div>
          {loading ? (
            <SkeletonRow />
          ) : (
            <VolumeValue>
              {data?.total.usd.twentyFourHours.toLocaleString('en', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </VolumeValue>
          )}
        </div>
      </div>
    </div>
  );
};

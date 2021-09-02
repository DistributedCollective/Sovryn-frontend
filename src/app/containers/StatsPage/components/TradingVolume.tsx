import React, { useState, useCallback, useRef } from 'react';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { TradingVolumeData } from '../types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useInterval } from 'app/hooks/useInterval';

interface Props {
  rate: number;
}

export function TradingVolume(props: Props) {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TradingVolumeData>();
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

  useInterval(getData, props.rate * 1e3, { immediate: true });

  const rowData = [
    {
      title: t(translations.statsPage.titles.hourVolumne),
      col1: `${data && data.total.btc.twentyFourHours.toFixed(4)} ${t(
        translations.statsPage.titles.btc,
      )}`,
      col2: `${
        data &&
        data.total.usd.twentyFourHours.toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      } ${t(translations.statsPage.titles.usd)}`,
    },
    // {
    //   title: t(translations.statsPage.titles.allVolumne),
    //   col1: `${data && data.total.btc.allTime.toFixed(4)} ${t(
    //     translations.statsPage.titles.btc,
    //   )}`,
    //   col2: `${
    //     data &&
    //     data.total.usd.allTime.toLocaleString('en', {
    //       minimumFractionDigits: 2,
    //       maximumFractionDigits: 2,
    //     })
    //   } ${t(translations.statsPage.titles.usd)}`,
    // },
  ];

  const rows = rowData.map((row, key) => (
    <div
      key={key}
      className="sovryn-border tw-flex tw-flex-col md:tw-flex-row tw-mb-4 tw-mt-2 tw-overflow-hidden"
    >
      <div className="tw-w-full">
        <div className="tw-text-center tw-p-4">
          <h3>
            <div className="tw-p-4 tw-text-center tw-w-full">{row.title}</div>
          </h3>
        </div>
      </div>
      <div className="tw-w-full tw-bg-gray-3 tw-border tw-border-black tw-border-t-0 tw-border-b-0">
        <div className="tw-text-center tw-p-4">
          <h3>
            {loading ? (
              <SkeletonRow />
            ) : (
              <div className="tw-p-4 tw-text-center tw-w-full">{row.col1}</div>
            )}
          </h3>
        </div>
      </div>
      <div className="tw-w-full tw-bg-gray-3 ">
        <div className="tw-text-center tw-p-4">
          <h3>
            {loading ? (
              <SkeletonRow />
            ) : (
              <div className="tw-p-4 tw-text-center tw-w-full">{row.col2}</div>
            )}
          </h3>
        </div>
      </div>
    </div>
  ));

  return <div>{rows}</div>;
}

TradingVolume.defaultProps = {
  rate: 30,
};

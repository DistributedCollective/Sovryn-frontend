import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    <div key={key} className="row sovryn-border mb-3 mt-2">
      <div className="md:tw-w-1/3 tw-w-full">
        <div className="text-center p-3">
          <h3>
            <div className="p-3 text-center w-100">{row.title}</div>
          </h3>
        </div>
      </div>
      <div className="md:tw-w-1/3 tw-w-full bg-secondary border border-black border-top-0 border-bottom-0">
        <div className="text-center p-3">
          <h3>
            {loading ? (
              <SkeletonRow />
            ) : (
              <div className="p-3 text-center w-100">{row.col1}</div>
            )}
          </h3>
        </div>
      </div>
      <div className="md:tw-w-1/3 tw-w-full bg-secondary ">
        <div className="text-center p-3">
          <h3>
            {loading ? (
              <SkeletonRow />
            ) : (
              <div className="p-3 text-center w-100">{row.col2}</div>
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

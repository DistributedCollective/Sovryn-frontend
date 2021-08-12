import React, { useState, useCallback, useRef } from 'react';
import axios, { Canceler } from 'axios';
import { useInterval } from 'app/hooks/useInterval';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { TvlData } from '../types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  rate: number;
}

export function TVL(props: Props) {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TvlData>();

  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/tvl', {
        cancelToken,
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url]);

  useInterval(getData, props.rate * 1e3, { immediate: true });

  const rowData = [
    {
      contract: t(translations.statsPage.tvl.protocol),
      btcValue: data?.tvlProtocol?.totalBtc || 0,
      usdValue: data?.tvlProtocol?.totalUsd || 0,
    },
    {
      contract: t(translations.statsPage.tvl.lend),
      btcValue: data?.tvlLending?.totalBtc || 0,
      usdValue: data?.tvlLending?.totalUsd || 0,
    },
    {
      contract: t(translations.statsPage.tvl.amm),
      btcValue: data?.tvlAmm?.totalBtc || 0,
      usdValue: data?.tvlAmm?.totalUsd || 0,
    },
    {
      contract: t(translations.statsPage.tvl.staked),
      btcValue: data?.tvlStaking?.totalBtc || 0,
      usdValue: data?.tvlStaking?.totalUsd || 0,
    },
    {
      contract: t(translations.statsPage.tvl.total),
      btcValue: data?.total_btc || 0,
      usdValue: data?.total_usd || 0,
    },
  ];

  const rows = rowData.map((row, key) =>
    loading ||
    !(
      row.btcValue &&
      Number(row.btcValue) > 0 &&
      row.usdValue &&
      Number(row.usdValue) > 0
    ) ? (
      <tr key={key}>
        <td>{row.contract}</td>
        <td>
          <SkeletonRow />
        </td>
        <td>
          <SkeletonRow />
        </td>
      </tr>
    ) : (
      <tr
        key={key}
        className={`${
          row.contract === 'Total' ? 'tw-font-bold tw-border-t' : ''
        }`}
      >
        <td>{row.contract}</td>
        <td>
          {row.btcValue?.toLocaleString('en', {
            maximumFractionDigits: 4,
            minimumFractionDigits: 4,
          }) || <div className="bp3-skeleton">&nbsp;</div>}
        </td>
        <td>
          {row.usdValue?.toLocaleString('en', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          }) || <div className="bp3-skeleton">&nbsp;</div>}
        </td>
      </tr>
    ),
  );

  return (
    <div>
      <table className="tw-w-full">
        <thead>
          <tr>
            <th className="">{t(translations.statsPage.tvl.type)}</th>
            <th className="">{t(translations.statsPage.tvl.btc)}</th>
            <th className="">{t(translations.statsPage.tvl.usd)}</th>
          </tr>
        </thead>
        <tbody className="tw-mt-12">{rows}</tbody>
      </table>
    </div>
  );
}

TVL.defaultProps = {
  rate: 30,
};

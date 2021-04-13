import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { TvlData } from '../types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

export function TVL() {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TvlData>();

  useEffect(() => {
    axios
      .get(url + '/tvl')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url]);

  const rowData = [
    {
      contract: t(translations.statsPage.tvl.protocol),
      btcValue: data?.tvlProtocol.totalBtc,
      usdValue: data?.tvlProtocol.totalUsd,
    },
    {
      contract: t(translations.statsPage.tvl.lend),
      btcValue: data?.tvlLending.totalBtc,
      usdValue: data?.tvlLending.totalUsd,
    },
    {
      contract: t(translations.statsPage.tvl.amm),
      btcValue: data?.tvlAmm.totalBtc,
      usdValue: data?.tvlAmm.totalUsd,
    },
    {
      contract: t(translations.statsPage.tvl.total),
      btcValue: data?.total_btc,
      usdValue: data?.total_usd,
    },
  ];

  const rows = rowData.map((row, key) => (
    <>
      {loading ? (
        <SkeletonRow key={key} />
      ) : (
        <tr
          key={key}
          className={`${
            row.contract === 'Total' ? 'font-weight-bold border-top' : ''
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
      )}
    </>
  ));

  return (
    <div>
      <table className="w-100">
        <thead>
          <tr>
            <th className="">{t(translations.statsPage.tvl.type)}</th>
            <th className="">{t(translations.statsPage.tvl.btc)}</th>
            <th className="">{t(translations.statsPage.tvl.usd)}</th>
          </tr>
        </thead>
        <tbody className="mt-5">{rows}</tbody>
      </table>
    </div>
  );
}

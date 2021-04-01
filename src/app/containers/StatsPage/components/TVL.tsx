import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { TvlData } from '../types';

export function TVL() {
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
      contract: 'Protocol Contract',
      btcValue:
        data &&
        data?.tvlProtocol.btc_total +
          data?.tvlProtocol.usd_total * (1 / data?.btc_doc_rate) +
          data?.tvlProtocol.bpro_total * data?.bpro_btc_rate,
      usdValue:
        data &&
        data?.tvlProtocol.usd_total +
          data?.tvlProtocol.btc_total * data?.btc_doc_rate +
          data?.tvlProtocol.bpro_total * data?.bpro_doc_rate,
    },
    {
      contract: 'Lending Contracts',
      btcValue:
        data &&
        data?.tvlLending.btc_total +
          data?.tvlLending.usd_total * (1 / data?.btc_doc_rate) +
          data?.tvlLending.bpro_total * data?.bpro_btc_rate,
      usdValue:
        data &&
        data?.tvlLending.usd_total +
          data?.tvlLending.btc_total * data?.btc_doc_rate +
          data?.tvlLending.bpro_total * data?.bpro_doc_rate,
    },
    {
      contract: 'Amm Contracts',
      btcValue:
        data &&
        data?.tvlAmm.btc_total +
          data?.tvlAmm.usd_total * (1 / data?.btc_doc_rate) +
          data?.tvlAmm.bpro_total * data?.bpro_btc_rate,
      usdValue:
        data &&
        data?.tvlAmm.usd_total +
          data?.tvlAmm.btc_total * data?.btc_doc_rate +
          data?.tvlAmm.bpro_total * data?.bpro_doc_rate,
    },
    {
      contract: 'Total',
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
            })}
          </td>
          <td>
            {row.usdValue?.toLocaleString('en', {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
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
            <th className="">Contract Type</th>
            <th className="">Value (BTC)</th>
            <th className="">Value (USD)</th>
          </tr>
        </thead>
        <tbody className="mt-5">{rows}</tbody>
      </table>
    </div>
  );
}

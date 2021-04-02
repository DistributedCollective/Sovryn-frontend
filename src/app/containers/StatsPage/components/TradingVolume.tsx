import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { TradingVolumeData } from '../types';

export function TradingVolume() {
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TradingVolumeData>();

  useEffect(() => {
    axios
      .get(url + '/trading-volume')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url]);

  const rowData = [
    {
      title: '24 Hour Volume',
      col1: `${data && data.total.btc.twentyFourHours.toFixed(4)} BTC`,
      col2: `${
        data &&
        data.total.usd.twentyFourHours.toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      } USD`,
    },
    {
      title: 'All Time Volume',
      col1: `${data && data.total.btc.allTime.toFixed(4)} BTC`,
      col2: `${
        data &&
        data.total.usd.allTime.toLocaleString('en', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      } USD`,
    },
  ];

  const rows = rowData.map((row, key) => (
    <div key={key} className="row sovryn-border mb-3">
      <div className="col-4">
        <div className="text-center p-3">
          <h3>
            <div className="p-3 text-center w-100">{row.title}</div>
          </h3>
        </div>
      </div>
      <div className="col-4 bg-secondary border border-black">
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
      <div className="col-4 bg-secondary ">
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

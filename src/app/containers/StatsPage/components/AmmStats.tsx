import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { AmmBalanceRow } from '../types';
import { formatNumber } from '../utils';

export function AmmStats() {
  const assets = ['DOC', 'USDT', 'BPRO'];

  return (
    <div>
      <table className="w-100">
        <thead>
          <tr>
            <th className="">Pool</th>
            <th className="">Asset</th>
            <th className="text-right">24 Hour Volume</th>
            <th className="text-right">24 Hour Fees</th>
            <th className="text-right">All Time Volume</th>
            <th className="text-right">All Time Fees</th>
          </tr>
        </thead>
        <tbody className="mt-5">
          {assets.map((item, key) => (
            <Row key={key} asset={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Row(props) {
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AmmBalanceRow>();

  useEffect(() => {
    axios
      .get(`${url}/amm/pool-balance/${props.asset}`)
      .then(res => {
        console.log(res);
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url, props.asset]);

  const decimals = {
    BTC: 4,
    BPRO: 4,
    USDT: 2,
    DOC: 2,
  };

  return (
    <>
      {loading && <SkeletonRow />}
      {data && (
        <>
          <tr></tr>
        </>
      )}
    </>
  );
}

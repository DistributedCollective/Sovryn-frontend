import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { AmmBalanceRow } from '../types';
import { formatNumber } from '../utils';
import { Asset } from 'types/asset';

export function AmmBalance() {
  const assets = [Asset.DOC, Asset.USDT, Asset.BPRO];

  return (
    <div>
      <table className="w-100">
        <thead>
          <tr>
            <th className="">Pool</th>
            <th className="">Asset</th>
            <th className="text-right">Staked Balance</th>
            <th className="text-right">Contract Balance</th>
            <th className="text-right">Imbalance</th>
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
          <tr>
            <td className="font-weight-bold">{data.ammPool}</td>
            <td>{data.ammPool}</td>
            <td className="text-right">
              {formatNumber(
                data.stakedBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="text-right">
              {formatNumber(
                data.contractBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="text-right">
              {formatNumber(data.tokenDelta, decimals[data.ammPool]) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
          </tr>
          <tr className="border-bottom">
            <td></td>
            <td>BTC</td>
            <td className="text-right">
              {formatNumber(data.stakedBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="text-right">
              {formatNumber(data.contractBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="text-right">
              {formatNumber(data.btcDelta, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );
}

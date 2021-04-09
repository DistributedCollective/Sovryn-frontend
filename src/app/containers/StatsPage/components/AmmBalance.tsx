import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { AmmBalanceRow } from '../types';
import { formatNumber } from '../utils';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';

export function AmmBalance() {
  const assets = [Asset.DOC, Asset.USDT, Asset.BPRO];
  const { t } = useTranslation();
  return (
    <div>
      <table className="w-100">
        <thead>
          <tr>
            <th className="">{t(translations.statsPage.ammpool.pool)}</th>
            <th className="">{t(translations.statsPage.asset)}</th>
            <th className="text-right">
              {t(translations.statsPage.ammpool.stakedBalance)}
            </th>
            <th className="text-right">
              {t(translations.statsPage.ammpool.contractBalance)}
            </th>
            <th className="text-right">
              {t(translations.statsPage.ammpool.imBalance)}
            </th>
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
              {formatNumber(data.stakedBalanceToken, decimals[data.ammPool])}
            </td>
            <td className="text-right">
              {formatNumber(data.contractBalanceToken, decimals[data.ammPool])}
            </td>
            <td className="text-right">
              {formatNumber(data.tokenDelta, decimals[data.ammPool])}
            </td>
          </tr>
          <tr className="border-bottom">
            <td></td>
            <td>BTC</td>
            <td className="text-right">
              {formatNumber(data.stakedBalanceBtc, decimals.BTC)}
            </td>
            <td className="text-right">
              {formatNumber(data.contractBalanceBtc, decimals.BTC)}
            </td>
            <td className="text-right">
              {formatNumber(data.btcDelta, decimals.BTC)}
            </td>
          </tr>
        </>
      )}
    </>
  );
}

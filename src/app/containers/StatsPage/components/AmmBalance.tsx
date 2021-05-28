import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { AmmBalanceRow } from '../types';
import { formatNumber } from '../utils';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'app/hooks/useInterval';
import { AssetSymbolRenderer } from '../../../components/AssetSymbolRenderer';

interface Props {
  rate: number;
}

export function AmmBalance(props: Props) {
  const assets = [
    Asset.SOV,
    Asset.USDT,
    Asset.ETH,
    Asset.DOC,
    Asset.MOC,
    Asset.BPRO,
  ];
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
            <Row key={key} asset={item} rate={props.rate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

AmmBalance.defaultProps = {
  rate: 30,
};

function Row(props) {
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AmmBalanceRow>();
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(`${url}/amm/pool-balance/${props.asset}`, { cancelToken })
      .then(res => {
        console.log(res);
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url, props.asset]);

  useInterval(() => {
    getData();
  }, props.rate * 1e3);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <td />
            <td>
              <AssetSymbolRenderer asset={Asset.RBTC} />
            </td>
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

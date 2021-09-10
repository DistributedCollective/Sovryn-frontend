import React, { useCallback, useRef, useState } from 'react';
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
import { LiquidityPoolDictionary } from '../../../../utils/dictionaries/liquidity-pool-dictionary';

interface Props {
  rate: number;
}

export function AmmBalance(props: Props) {
  const { t } = useTranslation();
  const assets = LiquidityPoolDictionary.pairTypeList();
  return (
    <div>
      <table className="tw-w-full">
        <thead>
          <tr>
            <th className="">{t(translations.statsPage.ammpool.pool)}</th>
            <th className="">{t(translations.statsPage.asset)}</th>
            <th className="tw-text-right">
              {t(translations.statsPage.ammpool.stakedBalance)}
            </th>
            <th className="tw-text-right">
              {t(translations.statsPage.ammpool.contractBalance)}
            </th>
            <th className="tw-text-right">
              {t(translations.statsPage.ammpool.imBalance)}
            </th>
          </tr>
        </thead>
        <tbody className="tw-mt-12">
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
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url, props.asset]);

  useInterval(getData, props.rate * 1e3, { immediate: true });

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
            <td className="tw-font-bold">{data.ammPool}</td>
            <td>{data.ammPool}</td>
            <td className="tw-text-right">
              {formatNumber(
                data.stakedBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="tw-text-right">
              {formatNumber(
                data.contractBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="tw-text-right">
              {formatNumber(data.tokenDelta, decimals[data.ammPool]) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
          </tr>
          <tr className="tw-border-b">
            <td />
            <td>
              <AssetSymbolRenderer asset={Asset.RBTC} />
            </td>
            <td className="tw-text-right">
              {formatNumber(data.stakedBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="tw-text-right">
              {formatNumber(data.contractBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="tw-text-right">
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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from '../../../../../utils/classifiers';
import { SkeletonRow } from '../../../../components/Skeleton/SkeletonRow';
import { formatNumber } from 'app/containers/StatsPage/utils';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'app/hooks/useInterval';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { LiquidityPoolDictionary } from '../../../../../utils/dictionaries/liquidity-pool-dictionary';
import { AmmBalanceRow } from 'app/containers/StatsPage/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

interface Props {
  rate: number;
}

export function AmmBalance(props: Props) {
  const { t } = useTranslation();
  const assets = LiquidityPoolDictionary.pairTypeList();

  return (
    <div className="tw-mt-12">
      <div className="tw-font-semibold tw-mb-6">
        {t(translations.landingPage.ammpool.title)}
      </div>

      <div className="tw-mt-7 tw-overflow-auto">
        <table
          className="tw-text-left tw-border-separate tw-w-full sovryn-table"
          style={{ borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th>{t(translations.landingPage.ammpool.pool)}</th>
              <th>{t(translations.landingPage.ammpool.asset)}</th>
              <th className="tw-text-right">
                {t(translations.landingPage.ammpool.stakedBalance)}
              </th>
              <th className="tw-text-right">
                {t(translations.landingPage.ammpool.contractBalance)}
              </th>
              <th className="tw-text-right">
                {t(translations.landingPage.ammpool.imBalance)}
              </th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {assets.map((item, i) => (
              <Row key={item} asset={item} rate={props.rate} />
            ))}
          </tbody>
        </table>
      </div>
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
  const logo = AssetsDictionary.get(props.asset).logoSvg;
  const rbtcLogo = AssetsDictionary.get(Asset.RBTC).logoSvg;

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

  if (props.hide) return null;

  return (
    <>
      {loading && <SkeletonRow />}
      {data && (
        <>
          <tr>
            <td>
              <span className="tw-flex tw-items-center">
                <img
                  className="tw-z-10"
                  style={{ width: '40px' }}
                  src={logo}
                  alt=""
                />
                <img
                  className="tw-mr-2 tw--ml-4"
                  style={{ width: '40px' }}
                  src={rbtcLogo}
                  alt=""
                />
              </span>
            </td>
            <td>
              <div>{data.ammPool}</div>
              <div>
                <AssetSymbolRenderer asset={Asset.RBTC} />
              </div>
            </td>
            <td className="tw-text-right">
              <div>
                {formatNumber(
                  data.stakedBalanceToken,
                  decimals[data.ammPool],
                ) || <div className="bp3-skeleton">&nbsp;</div>}
              </div>
              <div>
                {formatNumber(data.stakedBalanceBtc, decimals.BTC) || (
                  <div className="bp3-skeleton">&nbsp;</div>
                )}
              </div>
            </td>
            <td className="tw-text-right">
              <div>
                {formatNumber(
                  data.contractBalanceToken,
                  decimals[data.ammPool],
                ) || <div className="bp3-skeleton">&nbsp;</div>}
              </div>
              <div>
                <div>
                  {formatNumber(data.contractBalanceBtc, decimals.BTC) || (
                    <div className="bp3-skeleton">&nbsp;</div>
                  )}
                </div>
                <div>
                  {formatNumber(data.btcDelta, decimals.BTC) || (
                    <div className="bp3-skeleton">&nbsp;</div>
                  )}
                </div>
              </div>
            </td>
            <td className="tw-text-right">
              {formatNumber(data.tokenDelta, decimals[data.ammPool]) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );
}

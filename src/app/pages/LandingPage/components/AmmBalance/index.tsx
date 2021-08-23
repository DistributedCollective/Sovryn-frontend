import React, { useCallback, useRef, useState } from 'react';
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
import arrowForward from 'assets/images/arrow_forward.svg';
import { useHistory } from 'react-router-dom';
import { useFetch } from 'app/hooks/useFetch';

interface Props {
  rate: number;
}

export function AmmBalance(props: Props) {
  const { t } = useTranslation();
  const history = useHistory();
  const assets = LiquidityPoolDictionary.pairTypeList();
  const { value: ammData } = useFetch(
    `${backendUrl[currentChainId]}/amm/apy/all`,
  );

  return (
    <div className="tw-mt-24">
      <div className="tw-font-semibold tw-mb-8 tw-flex tw-items-center">
        {t(translations.landingPage.ammpool.title)}
        <img
          className="tw-h-4 tw-ml-3 tw-cursor-pointer"
          src={arrowForward}
          alt="amm"
          onClick={() => history.push('/yield-farm')}
        />
      </div>

      <div className="tw-mt-7 tw-overflow-auto">
        <table
          className="tw-text-left tw-border-separate tw-w-full sovryn-table tw-min-w-150"
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
                {t(translations.landingPage.ammpool.apy)}
              </th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {assets.map((item, i) => (
              <Row
                key={item}
                asset={item}
                rate={props.rate}
                ammData={ammData}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

AmmBalance.defaultProps = {
  rate: 60,
};

const decimals = {
  BTC: 4,
  BPRO: 4,
  USDT: 2,
  DOC: 2,
};

function Row(props) {
  const history = useHistory();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AmmBalanceRow>();
  const cancelDataRequest = useRef<Canceler>();
  const assetDetails = AssetsDictionary.get(props.asset);
  const rbtcLogo = AssetsDictionary.get(Asset.RBTC).logoSvg;
  const pool = LiquidityPoolDictionary.get(props.asset);

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

  useInterval(
    () => {
      getData();
    },
    props.rate * 1e3,
    { immediate: true },
  );

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
                  src={assetDetails.logoSvg}
                  alt=""
                />
                <img
                  className="tw-mr-2 tw--ml-4"
                  style={{ width: '40px' }}
                  src={rbtcLogo}
                  alt=""
                />
                <div>
                  <AssetSymbolRenderer asset={assetDetails.asset} />
                </div>
              </span>
            </td>
            <td>
              <div>
                <AssetSymbolRenderer asset={assetDetails.asset} />
              </div>
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
              </div>
            </td>
            <td
              onClick={() => {
                history.push({
                  pathname: '/yield-farm',
                  state: {
                    asset: props.asset,
                  },
                });
              }}
              className="tw-text-right tw-font-semibold tw-text-gold tw-cursor-pointer"
            >
              {pool.getVersion() === 1 &&
                !isNaN(data?.yesterdayApy[0]?.apy) && (
                  <div>{formatNumber(data?.yesterdayApy[0]?.apy, 2)} %</div>
                )}

              {pool.getVersion() === 2 && (
                <>
                  {!isNaN(data?.yesterdayApy[0]?.apy) && (
                    <div>{formatNumber(data?.yesterdayApy[0]?.apy, 2)} %</div>
                  )}
                  {!isNaN(data?.yesterdayApy[1]?.apy) && (
                    <div>{formatNumber(data?.yesterdayApy[1]?.apy, 2)} %</div>
                  )}
                </>
              )}
            </td>
          </tr>
        </>
      )}
    </>
  );
}

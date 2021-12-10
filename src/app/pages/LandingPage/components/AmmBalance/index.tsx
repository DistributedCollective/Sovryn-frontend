import React, { useCallback, useRef, useState } from 'react';
import axios, { Canceler } from 'axios';
import { backendUrl, currentChainId } from '../../../../../utils/classifiers';
import { SkeletonRow } from '../../../../components/Skeleton/SkeletonRow';
import { formatNumber } from 'app/containers/StatsPage/utils';
import { translations } from 'locales/i18n';
import { useTranslation } from 'react-i18next';
import { useInterval } from 'app/hooks/useInterval';
import { AssetSymbolRenderer } from '../../../../components/AssetSymbolRenderer';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { AmmBalanceRow } from 'app/containers/StatsPage/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import arrowForward from 'assets/images/arrow_forward.svg';
import { useHistory } from 'react-router-dom';
import { useFetch } from 'app/hooks/useFetch';
import { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface IAmmBalanceProps {
  rate?: number;
}

export const AmmBalance: React.FC<IAmmBalanceProps> = ({ rate = 60 }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const pools = LiquidityPoolDictionary.list();
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
          className="tw-text-left tw-border-separate tw-w-full sovryn-table"
          style={{ borderSpacing: 0 }}
        >
          <thead>
            <tr>
              <th className="tw-text-left tw-min-w-40">
                {t(translations.landingPage.ammpool.pool)}
              </th>
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
            {pools.map(item => (
              <Row key={item.key} pool={item} rate={rate} ammData={ammData} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const decimals = {
  BTC: 4,
  BPRO: 4,
  USDT: 2,
  DOC: 2,
};

interface IRowProps {
  pool: AmmLiquidityPool;
  rate: number;
  ammData: any;
  hide?: boolean;
}

const Row: React.FC<IRowProps> = ({ pool, rate, ammData, hide = false }) => {
  const history = useHistory();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AmmBalanceRow>();
  const cancelDataRequest = useRef<Canceler>();
  const primaryAssetDetails = AssetsDictionary.get(pool.assetA);
  const secondaryAssetDetails = AssetsDictionary.get(pool.assetB);

  const getData = useCallback(() => {
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(`${url}/amm/pool-balance/${pool.assetA}`, { cancelToken })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url, pool]);

  useInterval(
    () => {
      getData();
    },
    rate * 1e3,
    { immediate: true },
  );

  if (hide) {
    return null;
  }

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
                  src={primaryAssetDetails.logoSvg}
                  alt=""
                />
                <img
                  className="tw-mr-2 tw--ml-4"
                  style={{ width: '40px' }}
                  src={secondaryAssetDetails.logoSvg}
                  alt=""
                />
                <div>
                  <AssetSymbolRenderer asset={pool.assetA} />
                </div>
              </span>
            </td>
            <td>
              <div>
                <AssetSymbolRenderer asset={pool.assetA} />
              </div>
              <div>
                <AssetSymbolRenderer asset={pool.assetB} />
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
                    asset: pool.key,
                  },
                });
              }}
              className="tw-text-right tw-font-semibold tw-text-gold tw-cursor-pointer"
            >
              {pool.converterVersion === 1 &&
                !isNaN(data?.yesterdayApy[0]?.apy) && (
                  <div>{formatNumber(data?.yesterdayApy[0]?.apy, 2)} %</div>
                )}

              {pool.converterVersion === 2 && (
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
};

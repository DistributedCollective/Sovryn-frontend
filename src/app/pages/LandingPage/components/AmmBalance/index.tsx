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
import { Pagination } from 'app/components/Pagination';

interface Props {
  rate: number;
}

const PAGE_LIMIT = 4;

export function AmmBalance(props: Props) {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const assets = LiquidityPoolDictionary.pairTypeList();

  const onPageChanged = data => {
    setCurrentPage(data.currentPage);
  };

  return (
    <div>
      <div className="tw-text-base tw-tracking-wider">
        {t(translations.landingPage.ammpool.title)}
      </div>

      <div className="tw-mt-7 tw-overflow-auto">
        <table
          className="tw-text-left tw-w-full tw-border-separate"
          style={{ borderSpacing: 12 }}
        >
          <thead>
            <tr>
              <th>{t(translations.landingPage.ammpool.pool)}</th>
              <th>{t(translations.landingPage.ammpool.asset)}</th>
              <th>{t(translations.landingPage.ammpool.stakedBalance)}</th>
              <th>{t(translations.landingPage.ammpool.contractBalance)}</th>
              <th>{t(translations.landingPage.ammpool.imBalance)}</th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {assets.map((item, i) => (
              <Row
                hide={
                  i < (currentPage - 1) * PAGE_LIMIT ||
                  i >= currentPage * PAGE_LIMIT
                }
                key={item}
                asset={item}
                rate={props.rate}
              />
            ))}
          </tbody>
        </table>
        {assets.length > 0 && (
          <Pagination
            className="tw--mt-6"
            totalRecords={assets.length}
            pageLimit={PAGE_LIMIT}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
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

  if (props.hide) return null;

  return (
    <>
      {loading && <SkeletonRow />}
      {data && (
        <>
          <tr>
            <td rowSpan={2}>
              <img
                className="tw-inline tw-mr-1"
                style={{ height: '30px' }}
                src={logo}
                alt=""
              />

              {data.ammPool}
            </td>
            <td className="tw-pt-3">{data.ammPool}</td>
            <td className="tw-pt-3">
              {formatNumber(
                data.stakedBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="tw-pt-3">
              {formatNumber(
                data.contractBalanceToken,
                decimals[data.ammPool],
              ) || <div className="bp3-skeleton">&nbsp;</div>}
            </td>
            <td className="tw-pt-3">
              {formatNumber(data.tokenDelta, decimals[data.ammPool]) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
          </tr>
          <tr>
            <td className="tw-pb-3">
              <AssetSymbolRenderer asset={Asset.RBTC} />
            </td>
            <td className="tw-pb-3">
              {formatNumber(data.stakedBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="tw-pb-3">
              {formatNumber(data.contractBalanceBtc, decimals.BTC) || (
                <div className="bp3-skeleton">&nbsp;</div>
              )}
            </td>
            <td className="tw-pb-3">
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

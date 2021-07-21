import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { backendUrl, currentChainId } from 'utils/classifiers';
import axios, { Canceler } from 'axios';
import { useInterval } from 'app/hooks/useInterval';
import { TvlData } from 'app/containers/StatsPage/types';
import { DataRow } from './DataRow';

interface ITotalValueLockedProps {
  refreshInterval?: number;
}

export const TotalValueLocked: React.FC<ITotalValueLockedProps> = ({
  refreshInterval = 30000,
}) => {
  const { t } = useTranslation();
  const url = backendUrl[currentChainId];
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TvlData>();

  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(() => {
    setLoading(true);
    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + '/tvl', {
        cancelToken,
      })
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [url]);

  useInterval(() => {
    getData();
  }, refreshInterval);

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rowCoreData = useMemo(
    () => [
      {
        contract: t(translations.statsPage.tvl.protocol),
        btcValue: data?.tvlProtocol?.totalBtc || 0,
        usdValue: data?.tvlProtocol?.totalUsd || 0,
      },
      {
        contract: t(translations.statsPage.tvl.lend),
        btcValue: data?.tvlLending?.totalBtc || 0,
        usdValue: data?.tvlLending?.totalUsd || 0,
      },
      {
        contract: t(translations.statsPage.tvl.amm),
        btcValue: data?.tvlAmm?.totalBtc || 0,
        usdValue: data?.tvlAmm?.totalUsd || 0,
      },
    ],
    [data, t],
  );

  const subtotalBtcValue = useMemo(
    () =>
      rowCoreData
        .map(item => item.btcValue)
        .reduce((acc, currentValue) => (acc += currentValue), 0),
    [rowCoreData],
  );

  const subtotalUsdValue = useMemo(
    () =>
      rowCoreData
        .map(item => item.usdValue)
        .reduce((acc, currentValue) => (acc += currentValue), 0),
    [rowCoreData],
  );

  return (
    <div className="tw-w-10/12 tw-mx-auto">
      <div className="tw-uppercase tw-font-semibold tw-mb-12">
        {t(translations.landingPage.tvl.title)}
      </div>

      <table className="tw-text-left tw-w-full">
        <thead className="tw-h-20">
          <tr>
            <th className="tw-font-semibold">
              {t(translations.landingPage.tvl.type)}
            </th>
            <th className="tw-font-semibold">
              {t(translations.landingPage.tvl.btc)}
            </th>
            <th className="tw-font-semibold">
              {t(translations.landingPage.tvl.usd)}
            </th>
          </tr>
        </thead>
        <tbody className="mt-5">
          {rowCoreData.map(row => (
            <DataRow
              contractName={row.contract}
              btcValue={row.btcValue}
              usdValue={row.usdValue}
              loading={loading}
            />
          ))}

          <DataRow
            contractName={t(translations.landingPage.tvl.subtotal)}
            btcValue={subtotalBtcValue}
            usdValue={subtotalUsdValue}
            loading={loading}
            className="tw-border-t tw-border-white"
            contractClassName="tw-text-white"
          />

          <tr className="tw-h-8" />

          <DataRow
            contractName={t(translations.landingPage.tvl.staked)}
            btcValue={data?.tvlStaking.totalBtc || 0}
            usdValue={data?.tvlStaking.totalUsd || 0}
            loading={loading}
          />
          <DataRow
            contractName={t(translations.landingPage.tvl.total)}
            btcValue={data?.total_btc || 0}
            usdValue={data?.total_usd || 0}
            loading={loading}
            className="tw-border-t tw-border-white tw-font-semibold"
            contractClassName="tw-text-white tw-uppercase"
          />
        </tbody>
      </table>
    </div>
  );
};

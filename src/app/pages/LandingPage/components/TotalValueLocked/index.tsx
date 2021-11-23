import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { TvlData } from 'app/containers/StatsPage/types';
import { DataRow } from './DataRow';

interface ITotalValueLockedProps {
  loading: boolean;
  data?: TvlData;
}

export const TotalValueLocked: React.FC<ITotalValueLockedProps> = ({
  loading,
  data,
}) => {
  const { t } = useTranslation();

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
    <div className="tw-my-24">
      <div className="tw-uppercase tw-font-semibold tw-mb-8">
        {t(translations.landingPage.tvl.title)}
      </div>

      <table
        className="tw-text-left tw-w-full sovryn-table tw-border-separate"
        style={{ borderSpacing: '0 10px' }}
      >
        <thead>
          <tr>
            <th className="tw-font-semibold tw-border-b tw-border-sov-white">
              {t(translations.landingPage.tvl.type)}
            </th>
            <th className="tw-font-semibold tw-text-right tw-border-b tw-border-sov-white">
              {t(translations.landingPage.tvl.btc)}
            </th>
            <th className="tw-font-semibold tw-text-right tw-border-b tw-border-sov-white">
              {t(translations.landingPage.tvl.usd)}
            </th>
          </tr>
        </thead>
        <tbody className="mt-5">
          {rowCoreData.map((row, i) => (
            <DataRow
              key={row.contract}
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
            className="tw-border-t tw-border-b tw-border-sov-white tw-border-opacity-30 tw-font-semibold"
            contractClassName="tw-text-sov-white tw-border-t tw-border-opacity-30 tw-border-b tw-border-sov-white"
          />

          <DataRow
            contractName={t(translations.landingPage.tvl.staked)}
            btcValue={data?.tvlStaking?.totalBtc || 0}
            usdValue={data?.tvlStaking?.totalUsd || 0}
            loading={loading}
          />
          <DataRow
            contractName={t(translations.landingPage.tvl.subProtocol)}
            btcValue={data?.tvlSubprotocols?.totalBtc || 0}
            usdValue={data?.tvlSubprotocols?.totalUsd || 0}
            loading={loading}
          />
          <DataRow
            contractName={t(translations.landingPage.tvl.total)}
            btcValue={data?.total_btc || 0}
            usdValue={data?.total_usd || 0}
            loading={loading}
            className="tw-border-t tw-border-b tw-border-sov-white tw-font-semibold tw-text-lg"
            contractClassName="tw-text-sov-white tw-uppercase tw-border-t tw-border-b tw-border-sov-white tw-text-lg"
          />
        </tbody>
      </table>
    </div>
  );
};

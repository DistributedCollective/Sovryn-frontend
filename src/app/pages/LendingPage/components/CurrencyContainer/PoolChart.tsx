import React, { useEffect, useState, useMemo } from 'react';

import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import { LendingPool } from 'utils/models/lending-pool';
import { databaseRpcNodes } from 'utils/classifiers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  pool: LendingPool;
}

interface DataItem {
  date: Date;
  supply_apr: number;
  supply: number;
}

export function PoolChart(props: Props) {
  const { t } = useTranslation();
  const { chainId } = useSelector(selectWalletProvider);
  const [data, setData] = useState([]);
  const asset = props.pool.getAsset();

  useEffect(() => {
    fetch(databaseRpcNodes[chainId], {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'custom_getLoanTokenHistory',
        params: [
          {
            address: getLendingContract(asset).address,
          },
        ],
      }),
    })
      .then(e => e.json().then())
      .then(e => {
        setData(e.slice(-28)); //last 7 days of data in 6hr chunks
      })
      .catch(console.error);
  }, [asset, chainId, props.pool]);

  const supplyApr: [number, number][] = useMemo(
    () =>
      (data as any[]).map(i => [Date.parse(i.timestamp), i.supply_apr / 1e8]),
    [data],
  );

  const totalLiq: [number, number][] = useMemo(
    () => (data as any[]).map(i => [Date.parse(i.timestamp), i.supply / 1e8]),
    [data],
  );

  const tooltipFormatter = function (this: any) {
    const d = new Date(this.x);
    return this.points?.reduce(
      function (s, point) {
        return `${s}<br/>${point.series.name}: ${point.y.toFixed(3)}${
          point.series.userOptions?.tooltip?.valueSuffix
        }`;
      },
      `<span class='tw-font-bold'>
        ${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()} ${String(
        d.getUTCHours(),
      ).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC
        </span>`,
    );
  };

  return (
    <>
      <ComparisonChart
        key={data.length}
        primaryData={{
          name: t(translations.lendingPage.poolChart.apy, { asset }),
          color: getAssetColor(asset),
          numDecimals: 3,
          suffix: '%',
          data: supplyApr,
        }}
        totalData={{
          name: t(translations.lendingPage.poolChart.totalLiquidity),
          color: '#ACACAC',
          data: totalLiq,
          numDecimals: 3,
          suffix: `${asset}`,
        }}
        tooltipFormatter={tooltipFormatter}
      />
    </>
  );
}

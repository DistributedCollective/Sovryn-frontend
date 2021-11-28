import React, { useEffect, useState, useMemo } from 'react';

import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import { Spinner } from 'app/components/Spinner';
import { LendingPool } from 'utils/models/lending-pool';
import { abbreviateNumber } from 'utils/helpers';
import { databaseRpcNodes, currentChainId } from 'utils/classifiers';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface Props {
  pool: LendingPool;
}

interface DataItem {
  timestamp: string;
  supply_apr: number;
  supply: number;
}

const getUTCDateString = (date: Date): string => {
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()} ${String(date.getUTCHours()).padStart(
    2,
    '0',
  )}:${String(date.getUTCMinutes()).padStart(2, '0')} UTC`;
};

const tooltipFormatter = function (this: any) {
  return this.points?.reduce(function (s, point) {
    const tooltipSuffix = point.series.userOptions?.tooltip?.valueSuffix;
    return `${s}<br/>${point.series.name}: 
      <span class='tw-font-bold'>
        ${
          point.y < 1000
            ? point.y.toFixed(3)
            : abbreviateNumber(Math.round(point.y), 3)
        }${tooltipSuffix !== '%' ? ' ' : ''}${tooltipSuffix}
      </span>`;
  }, getUTCDateString(new Date(this.x)));
};

export function PoolChart(props: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<DataItem[]>([]);
  const asset = props.pool.getAsset();

  useEffect(() => {
    fetch(databaseRpcNodes[currentChainId], {
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
  }, [asset, props.pool]);

  const supplyApr: [number, number][] = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), i.supply_apr / 1e8]),
    [data],
  );

  const totalLiq: [number, number][] = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), i.supply / 1e8]),
    [data],
  );

  return (
    <>
      {data.length ? (
        <ComparisonChart
          key={asset}
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
          margin={[30, 85, 30, 45]}
          tooltipFormatter={tooltipFormatter}
        />
      ) : (
        <Spinner />
      )}
    </>
  );
}

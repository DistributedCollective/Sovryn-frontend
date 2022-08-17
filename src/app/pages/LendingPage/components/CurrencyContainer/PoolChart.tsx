import React, { useMemo } from 'react';
import ComparisonChart from 'app/components/FinanceV2Components/ComparisonChart';
import { getAssetColor } from 'app/components/FinanceV2Components/utils/getAssetColor';
import { Spinner } from 'app/components/Spinner';
import { LendingPool } from 'utils/models/lending-pool';
import { abbreviateNumber } from 'utils/helpers';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useGetLendingHistory } from 'app/hooks/lending/useGetLendingHistory';

interface IPoolChartProps {
  pool: LendingPool;
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

export const PoolChart: React.FC<IPoolChartProps> = ({ pool }) => {
  const { t } = useTranslation();
  const asset = pool.getAsset();
  const data = useGetLendingHistory(pool);

  const supplyApr: [number, number][] = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), Number(i.supply_apr)]),
    [data],
  );

  const totalLiq: [number, number][] = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), Number(i.supply)]),
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
};

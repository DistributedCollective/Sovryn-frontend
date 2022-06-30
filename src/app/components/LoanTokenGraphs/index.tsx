import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { LendingPool } from 'utils/models/lending-pool';
import ComparisonChart from '../ComparisonChart';
import { useGetLendingHistory } from 'app/hooks/lending/useGetLendingHistory';
import { BarsGraphProps } from './types';

interface ILoanTokenGraphsProps {
  lendingPool: LendingPool;
}

export const LoanTokenGraphs: React.FC<ILoanTokenGraphsProps> = ({
  lendingPool,
}) => {
  const data = useGetLendingHistory(lendingPool);

  if (!data.length) {
    return null;
  }

  return (
    <ParentSize>
      {({ width }) => <BarsGraph width={width} data={data} />}
    </ParentSize>
  );
};

function BarsGraph({ width, data }: BarsGraphProps) {
  const { t } = useTranslation();
  const height = 150;

  const supplyApr = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), Number(i.supply_apr)]),
    [data],
  );

  const borrowApr = useMemo(
    () => data.map(i => [Date.parse(i.timestamp), Number(i.borrow_apr)]),
    [data],
  );

  const tooltipFormatter = function (this: any) {
    const d = new Date(this.x);
    return this.points?.reduce(
      function (s, point) {
        return `${s}<br/>${point.series.name}: ${point.y.toFixed(2)}%`;
      },
      `<span class='tw-font-bold'>
        ${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()} ${String(
        d.getUTCHours(),
      ).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC
        </span>`,
    );
  };

  return width < 10 ? null : (
    <div className="tw-relative" style={{ width, height }}>
      <ComparisonChart
        height={height}
        datasetPrimary={{
          type: 'areaspline',
          name: t(translations.lend.currency.lendArp),
          color: '#FFAC3E',
          data: supplyApr,
        }}
        datasetSecondary={{
          type: 'areaspline',
          name: t(translations.lend.currency.borrowArp),
          color: 'white',
          data: borrowApr,
        }}
        tooltipFormatter={tooltipFormatter}
      />
    </div>
  );
}

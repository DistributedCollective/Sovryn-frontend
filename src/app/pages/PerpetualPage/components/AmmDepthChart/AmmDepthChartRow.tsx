import classNames from 'classnames';
import React from 'react';
import { toNumberFormat } from 'utils/display-text/format';
import { AmmDepthChartDataEntry } from '../../hooks/usePerpetual_AmmDepthChart';

type AmmDepthChartRowProps = {
  type: 'long' | 'short';
  row: AmmDepthChartDataEntry;
  maxTotal: number;
};

export const AmmDepthChartRow: React.FC<AmmDepthChartRowProps> = ({
  type,
  row,
  maxTotal,
}) => (
  <tr key={row.price}>
    <td
      className={classNames(
        'tw-px-2 tw-py-1 tw-text-right tw-rounded-l',
        type === 'short' ? 'tw-text-trade-short' : 'tw-text-trade-long',
      )}
    >
      {toNumberFormat(row.price, 1)}
    </td>
    <td className="tw-px-2 tw-py-1 tw-text-right">
      {toNumberFormat(Math.abs(row.deviation), 2, 2)}%
    </td>
    <td className="tw-relative tw-px-2 tw-py-1 tw-text-right tw-rounded-r">
      <span
        className={classNames(
          'tw-absolute tw-h-5 tw-top-1 tw-left-0 tw-opacity-25 tw-rounded tw-transition-all tw-duration-300',
          type === 'short' ? 'tw-bg-trade-short' : 'tw-bg-trade-long',
        )}
        style={{ width: (row.amount / maxTotal) * 100 + '%' }}
      />
      <span className="tw-relative tw-z-10">
        {toNumberFormat(row.amount, 3)}
      </span>
    </td>
  </tr>
);

import classNames from 'classnames';
import React, { useMemo } from 'react';
import { toNumberFormat } from 'utils/display-text/format';
import { AmmDepthChartDataEntry } from '../../hooks/usePerpetual_AmmDepthChart';

type AmmDepthChartRowProps = {
  type: 'long' | 'short';
  row: AmmDepthChartDataEntry;
  isOddRow: boolean;
  maxTotal: number;
};

export const AmmDepthChartRow: React.FC<AmmDepthChartRowProps> = ({
  type,
  row,
  maxTotal,
  isOddRow,
}) => {
  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );

  return (
    <tr key={row.price}>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right tw-font-semibold tw-rounded-l',
          type === 'short' ? 'tw-text-trade-short' : 'tw-text-trade-long',
          backgroundClassName,
        )}
      >
        {toNumberFormat(row.price, 1)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {toNumberFormat(Math.abs(row.deviation), 2, 0)}%
      </td>
      <td
        className={classNames(
          'tw-relative tw-px-4 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
        )}
      >
        <span
          className={classNames(
            'tw-absolute tw-h-full tw-top-0 tw-left-0 tw-opacity-25 tw-rounded tw-transition-all tw-duration-300',
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
};

import classNames from 'classnames';
import React, { useMemo } from 'react';
import { RecentTradesDataEntry, TradeType } from '../../types';
import { getPriceChangeImage, getPriceColor } from './utils';

type IRecentTradesTableRowProps = {
  row: RecentTradesDataEntry;
  isOddRow: boolean;
};

export const RecentTradesTableRow: React.FC<IRecentTradesTableRowProps> = ({
  row,
  isOddRow,
}) => {
  const priceChangeImage = useMemo(() => getPriceChangeImage(row.priceChange), [
    row.priceChange,
  ]);
  const priceColor = useMemo(() => getPriceColor(row.priceChange), [
    row.priceChange,
  ]);

  return (
    <tr
      key={row.price}
      className={classNames(
        row.type === TradeType.SELL
          ? 'tw-text-trade-short'
          : 'tw-text-trade-long',
        isOddRow && 'tw-bg-gray-3',
        'tw-h-6',
      )}
    >
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right tw-font-semibold tw-flex',
          isOddRow && 'tw-rounded-l',
          priceColor && priceColor,
        )}
      >
        {priceChangeImage ? (
          <img
            className="tw-inline-block tw-w-2.5 tw-mr-1"
            src={priceChangeImage}
            alt="price change arrow"
          />
        ) : (
          <span className="tw-mr-3.5" />
        )}

        {row.price}
      </td>
      <td className="tw-px-4 tw-py-1 tw-text-right">{row.size}</td>
      <td className="tw-px-4 tw-py-1 tw-text-right">{row.time}</td>
      <td
        className={classNames(
          'tw-relative tw-px-4 tw-py-1 tw-text-right',
          isOddRow && 'tw-rounded-r',
        )}
      >
        {row.type === 'buy' ? 'B' : 'S'}
      </td>
    </tr>
  );
};

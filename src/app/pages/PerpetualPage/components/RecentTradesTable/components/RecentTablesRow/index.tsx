import classNames from 'classnames';
import React, { useMemo } from 'react';
import { RecentTradesDataEntry, TradeType } from '../../types';
import { getPriceChangeImage, getPriceColor } from './utils';

type RecentTradesTableRowProps = {
  row: RecentTradesDataEntry;
  pricePrecision: number;
  sizePrecision: number;
  isOddRow: boolean;
};

export const RecentTradesTableRow: React.FC<RecentTradesTableRowProps> = ({
  row,
  pricePrecision,
  sizePrecision,
  isOddRow,
}) => {
  const priceChangeImage = useMemo(() => getPriceChangeImage(row.priceChange), [
    row.priceChange,
  ]);
  const priceColor = useMemo(() => getPriceColor(row.priceChange), [
    row.priceChange,
  ]);

  const backgroundClassName = isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1';

  return (
    <tr
      key={row.price}
      className={classNames(
        'tw-h-6',
        row.type === TradeType.SELL
          ? 'tw-text-trade-short'
          : 'tw-text-trade-long',
      )}
    >
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right tw-font-semibold tw-rounded-l',
          backgroundClassName,
          priceColor,
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

        {row.price.toFixed(pricePrecision)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {row.size.toFixed(sizePrecision)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {row.time}
      </td>
      <td
        className={classNames(
          'tw-relative tw-px-4 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
        )}
      >
        {row.type === 'buy' ? 'B' : 'S'}
      </td>
    </tr>
  );
};

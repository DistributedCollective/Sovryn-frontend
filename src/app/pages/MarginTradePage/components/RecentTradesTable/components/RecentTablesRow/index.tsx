import classNames from 'classnames';
import React, { useMemo } from 'react';
import { weiToNumberFormat } from 'utils/display-text/format';
import { RecentTradesDataEntry, TradePriceChange } from '../../types';
import { getPriceChangeImage, getPriceColor } from './utils';
import dayjs from 'dayjs';
import { LoadableValue } from 'app/components/LoadableValue';
import { weiTo18 } from 'utils/blockchain/math-helpers';

type RecentTradesTableRowProps = {
  row: RecentTradesDataEntry;
  isOddRow: boolean;
  quoteToken: string;
  priceChange: TradePriceChange;
};

export const RecentTradesTableRow: React.FC<RecentTradesTableRowProps> = ({
  row,
  isOddRow,
  quoteToken,
  priceChange,
}) => {
  const priceChangeImage = useMemo(() => getPriceChangeImage(priceChange), [
    priceChange,
  ]);
  const priceColor = useMemo(() => getPriceColor(priceChange), [priceChange]);

  const backgroundClassName = isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1';

  const isLong = useMemo(() => row.loanToken === quoteToken, [
    row.loanToken,
    quoteToken,
  ]);

  return (
    <tr
      key={row.entryPrice}
      className={classNames(
        'tw-h-6',
        isLong ? 'tw-text-trade-long' : 'tw-text-trade-short',
      )}
    >
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-left tw-font-semibold tw-rounded-l tw-whitespace-nowrap',
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
        <LoadableValue
          loading={false}
          value={weiToNumberFormat(row.entryPrice, 1)}
          tooltip={weiTo18(row.entryPrice)}
        />
      </td>
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-right',
          backgroundClassName,
          priceColor,
        )}
      >
        <LoadableValue
          loading={false}
          value={weiToNumberFormat(row.positionSize, 3)}
          tooltip={weiTo18(row.positionSize)}
        />
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
          priceColor,
        )}
      >
        {dayjs(Number(row.timestamp) * 1e3).format('L')}
      </td>
      <td
        className={classNames(
          'tw-relative tw-pr-4 tw-pl-0 tw-py-1 tw-text-right tw-rounded-r',
          backgroundClassName,
          priceColor,
        )}
      >
        {isLong ? 'L' : 'S'}
      </td>
    </tr>
  );
};

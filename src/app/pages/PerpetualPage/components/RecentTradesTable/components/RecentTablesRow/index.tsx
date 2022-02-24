import classNames from 'classnames';
import React, { useMemo } from 'react';
import { RecentTradesDataEntry, TradeType } from '../../types';
import { getPriceChangeImage, getPriceColor } from '../../utils';
import { LinkToExplorer } from '../../../../../../components/LinkToExplorer';
import { PERPETUAL_CHAIN_ID } from '../../../../types';
import { toNumberFormat } from '../../../../../../../utils/display-text/format';

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
  const typeColor = useMemo(
    () =>
      row.type === TradeType.SELL
        ? 'tw-text-trade-short'
        : 'tw-text-trade-long',
    [row.type],
  );

  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );

  return (
    <tr key={row.price} className={classNames('tw-h-6', typeColor)}>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right tw-font-semibold tw-rounded-l',
          backgroundClassName,
          priceColor,
        )}
      >
        <div className="tw-flex tw-flex-row tw-align-center tw-justify-between">
          {priceChangeImage ? (
            <img
              className="tw-inline-block tw-w-2.5 tw-mr-1"
              src={priceChangeImage}
              alt="price change arrow"
            />
          ) : (
            <span className="tw-mr-3.5" />
          )}

          <span>{toNumberFormat(row.price, pricePrecision)}</span>
        </div>
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        {toNumberFormat(row.size, sizePrecision)}
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        <LinkToExplorer
          className={classNames(
            'tw-underline hover:tw-no-underline',
            typeColor,
          )}
          txHash={row.id}
          text={row.time}
          chainId={PERPETUAL_CHAIN_ID}
        />
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

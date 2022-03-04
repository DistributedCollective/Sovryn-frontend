import classNames from 'classnames';
import React, { useMemo } from 'react';
import { RecentTradesDataEntry, TradeType } from '../../types';
import { getPriceChangeImage } from '../../utils';
import { LinkToExplorer } from '../../../../../../components/LinkToExplorer';
import { PERPETUAL_CHAIN_ID } from '../../../../types';
import { toNumberFormat } from '../../../../../../../utils/display-text/format';

type RecentTradesTableRowProps = {
  row: RecentTradesDataEntry;
  pricePrecision: number;
  sizePrecision: number;
};

export const RecentTradesTableRow: React.FC<RecentTradesTableRowProps> = ({
  row,
  pricePrecision,
  sizePrecision,
}) => {
  const typeColor = useMemo(
    () =>
      row.type === TradeType.SELL
        ? 'tw-text-trade-short'
        : 'tw-text-trade-long',
    [row.type],
  );

  const priceChangeImage = useMemo(
    () => getPriceChangeImage(row.priceChange, typeColor),
    [row.priceChange, typeColor],
  );

  return (
    <tr key={row.price} className={classNames('tw-h-6', typeColor)}>
      <td className="tw-py-1 tw-text-right tw-rounded-l">
        <div className="tw-flex tw-flex-row tw-align-center tw-justify-between">
          {priceChangeImage ? priceChangeImage : <span className="tw-mr-3.5" />}

          <span>{toNumberFormat(row.price, pricePrecision)}</span>
        </div>
      </td>
      <td className="tw-pl-1 tw-py-1 tw-text-right">
        {toNumberFormat(row.size, sizePrecision)}
      </td>
      <td className="tw-py-1 tw-text-right">
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
    </tr>
  );
};

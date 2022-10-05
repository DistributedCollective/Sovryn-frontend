import classNames from 'classnames';
import React, { useMemo } from 'react';
import dayjs from 'dayjs';
import { AssetDetails } from 'utils/models/asset-details';
import { RecentSwapsDataEntry } from 'types/trading-pairs';
import { areAddressesEqual } from 'utils/helpers';
import { AssetValue } from '../AssetValue';
import { AssetValueMode } from '../AssetValue/types';

type RecentSwapRowProps = {
  row: RecentSwapsDataEntry;
  isOddRow: boolean;
  baseAssetDetails: AssetDetails;
  quoteAssetDetails: AssetDetails;
};

export const RecentSwapRow: React.FC<RecentSwapRowProps> = ({
  row,
  isOddRow,
  baseAssetDetails,
  quoteAssetDetails,
}) => {
  const backgroundClassName = useMemo(
    () => (isOddRow ? 'tw-bg-gray-3' : 'tw-bg-gray-1'),
    [isOddRow],
  );
  const isBuy = useMemo(
    () =>
      !areAddressesEqual(
        row._fromToken.id,
        baseAssetDetails.getTokenContractAddress(),
      ),
    [baseAssetDetails, row._fromToken.id],
  );

  const size = useMemo(() => (isBuy ? row._return : row._amount), [
    isBuy,
    row._amount,
    row._return,
  ]);

  const price = useMemo(
    () =>
      isBuy
        ? Number(row._amount) / Number(row._return)
        : Number(row._return) / Number(row._amount),
    [isBuy, row._amount, row._return],
  );

  return (
    <tr
      key={row.transaction.id}
      className={classNames(
        'tw-h-6',
        isBuy ? 'tw-text-trade-long' : 'tw-text-trade-short',
      )}
    >
      <td
        className={classNames(
          'tw-pl-4 tw-py-1 tw-text-left tw-font-semibold tw-rounded-l tw-whitespace-nowrap',
          backgroundClassName,
        )}
      >
        <AssetValue
          value={Number(price)}
          mode={AssetValueMode.auto}
          minDecimals={quoteAssetDetails.displayDecimals}
          maxDecimals={quoteAssetDetails.displayDecimals}
          useTooltip
        />
      </td>
      <td
        className={classNames(
          'tw-pl-2 tw-py-1 tw-text-right',
          backgroundClassName,
        )}
      >
        <AssetValue
          value={Number(size)}
          mode={AssetValueMode.auto}
          minDecimals={baseAssetDetails.displayDecimals}
          maxDecimals={baseAssetDetails.displayDecimals}
          useTooltip
        />
      </td>
      <td
        className={classNames(
          'tw-px-4 tw-pt-1 tw-text-right tw-text-tiny',
          backgroundClassName,
        )}
      >
        {dayjs(Number(row.timestamp) * 1e3)
          .utc()
          .format('YY/MM/DD HH:mm')}
      </td>
    </tr>
  );
};

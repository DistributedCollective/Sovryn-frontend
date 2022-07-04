import {
  DisplayDate,
  SeparatorType,
} from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { numberToPercent } from 'utils/display-text/format';
import { FundingPaymentsEntry } from '../../hooks/usePerpetual_FundingPayments';
import { getCollateralName } from '../../utils/renderUtils';

type FundingPaymentsRowProps = {
  item: FundingPaymentsEntry;
};

const formatTimestampDifference = (timestamp: number) => {
  const date = new Date(timestamp * 1000);

  const days = Math.floor(timestamp / (60 * 60 * 24))
    .toString()
    .padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${days}:${hours}:${minutes}:${seconds}`;
};

export const FundingPaymentsRow: React.FC<FundingPaymentsRowProps> = ({
  item,
}) => {
  const collateralAsset = useMemo(
    () => getCollateralName(item.pair.collateralAsset),
    [item.pair.collateralAsset],
  );

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={item.datetime}
          separator={SeparatorType.Dash}
          useUTC
        />
      </td>
      <td>{item.pair.name}</td>
      <td>{collateralAsset}</td>
      <td
        className={classNames(
          bignumber(item.received).greaterThan(0)
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          value={item.received}
          minDecimals={2}
          maxDecimals={10}
          assetString={collateralAsset}
          mode={AssetValueMode.auto}
          showPositiveSign
        />
      </td>
      <td>{numberToPercent(item.rate, 4)}</td>
      <td>
        {formatTimestampDifference(parseFloat(item.timeSinceLastPayment))}
      </td>
    </tr>
  );
};

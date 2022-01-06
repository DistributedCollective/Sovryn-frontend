import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
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
  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);
  const collateralAsset = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{pair.name}</td>
      <td>{collateralAsset}</td>
      <td
        className={classNames(
          bignumber(item.payment).greaterThan(0)
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          value={item.payment}
          minDecimals={2}
          maxDecimals={10}
          assetString={pair.baseAsset}
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

import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import React, { useMemo } from 'react';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { FundingPaymentsEntry } from '../../hooks/usePerpetual_FundingPayments';

type FundingPaymentsRowProps = {
  item: FundingPaymentsEntry;
};

export const FundingPaymentsRow: React.FC<FundingPaymentsRowProps> = ({
  item,
}) => {
  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{pair.name}</td>
      <td>{pair.collateralAsset}</td>
      <td
        className={classNames(
          bignumber(item.payment).greaterThan(0)
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          value={item.payment}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
          showPositiveSign
        />
      </td>
      <td>{item.rate}%</td>
      <td>{item.timeSinceLastPayment}</td>
    </tr>
  );
};

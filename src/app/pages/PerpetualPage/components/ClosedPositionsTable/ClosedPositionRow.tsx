import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { TradingPosition } from 'types/trading-position';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { ClosedPositionEntry } from '../../hooks/usePerpetual_ClosedPositions';

type ClosedPositionRowProps = {
  item: ClosedPositionEntry;
};

export const ClosedPositionRow: React.FC<ClosedPositionRowProps> = ({
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
          item.position === TradingPosition.LONG
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          value={item.positionSize}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
          showPositiveSign
        />
      </td>
      <td
        className={classNames(
          item.realizedPnl.baseValue > 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <>
          <AssetValue
            minDecimals={2}
            maxDecimals={6}
            className="tw-block"
            value={item.realizedPnl.baseValue}
            assetString={pair.baseAsset}
            mode={AssetValueMode.auto}
            showPositiveSign
          />
          <AssetValue
            className="tw-block"
            value={item.realizedPnl.quoteValue}
            assetString={pair.quoteAsset}
            isApproximation
            showPositiveSign
          />
        </>
      </td>
    </tr>
  );
};

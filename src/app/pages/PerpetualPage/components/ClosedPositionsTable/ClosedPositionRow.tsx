import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import React, { useMemo } from 'react';
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

  const sizeRange = useMemo(
    () => (
      <>
        {item.positionSizeMin !== 0 && (
          <AssetValue
            className={
              item.positionSizeMin < 0
                ? 'tw-text-trade-short'
                : 'tw-text-trade-long'
            }
            value={item.positionSizeMin}
            assetString={pair.baseAsset}
            minDecimals={0}
            maxDecimals={6}
            mode={AssetValueMode.auto}
            showPositiveSign
          />
        )}
        {item.positionSizeMin !== 0 && item.positionSizeMax !== 0 ? (
          <span className="tw-mx-2">–</span>
        ) : null}
        {item.positionSizeMax !== 0 && (
          <AssetValue
            className={
              item.positionSizeMax < 0
                ? 'tw-text-trade-short'
                : 'tw-text-trade-long'
            }
            value={item.positionSizeMax}
            assetString={pair.baseAsset}
            minDecimals={0}
            maxDecimals={6}
            mode={AssetValueMode.auto}
            showPositiveSign
          />
        )}
      </>
    ),
    [pair.baseAsset, item.positionSizeMin, item.positionSizeMax],
  );

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{pair.name}</td>
      <td>{pair.collateralAsset}</td>
      <td>{sizeRange}</td>
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

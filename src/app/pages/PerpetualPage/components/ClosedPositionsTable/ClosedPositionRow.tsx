import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import classNames from 'classnames';
import React, { useMemo } from 'react';
import { ClosedPositionEntry } from '../../hooks/usePerpetual_ClosedPositions';
import { getCollateralName } from '../../utils/renderUtils';

type ClosedPositionRowProps = {
  item: ClosedPositionEntry;
};

export const ClosedPositionRow: React.FC<ClosedPositionRowProps> = ({
  item,
}) => {
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
            assetString={item?.pair?.baseAsset}
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
            assetString={item?.pair?.baseAsset}
            minDecimals={0}
            maxDecimals={6}
            mode={AssetValueMode.auto}
            showPositiveSign
          />
        )}
      </>
    ),
    [item?.pair?.baseAsset, item.positionSizeMin, item.positionSizeMax],
  );

  const collateralName = useMemo(
    () => getCollateralName(item.pair.collateralAsset),
    [item.pair.collateralAsset],
  );

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{item?.pair?.name}</td>
      <td>{collateralName}</td>
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
            assetString={item?.pair?.baseAsset}
            mode={AssetValueMode.auto}
            showPositiveSign
          />
          <AssetValue
            className="tw-block"
            value={item.realizedPnl.quoteValue}
            assetString={item?.pair?.quoteAsset}
            isApproximation
            showPositiveSign
          />
        </>
      </td>
    </tr>
  );
};

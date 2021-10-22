import React from 'react';
import { numberToPercent, toNumberFormat } from 'utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { OpenPositionEntry } from '../../hooks/usePerpetual_OpenPositions';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../components/AssetValue';

interface IOpenPositionRowProps {
  item: OpenPositionEntry;
}

export function OpenPositionRow({ item }: IOpenPositionRowProps) {
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
    [States.ADD_TO_MARGIN_TRADES]: addToMarginLocked,
  } = checkMaintenances();
  // TODO: implement maintenance stops for actions!

  const pair = PerpetualPairDictionary.get(item.pair as PerpetualPairType);

  if (pair === undefined) return null;

  return (
    <tr>
      <td
        className={classNames(
          item.position > 0 ? 'tw-text-trade-long' : 'tw-text-trade-short',
        )}
      >
        {pair.name}
      </td>
      <td
        className={classNames(
          'tw-text-right',
          item.position > 0 ? 'tw-text-trade-long' : 'tw-text-trade-short',
        )}
      >
        <AssetValue value={item.position} assetString={pair.longAsset} />
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell">
        <AssetValue value={item.value} assetString={pair.shortAsset} />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        <AssetValue value={item.entryPrice} assetString={pair.longAsset} />
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell">
        <AssetValue value={item.markPrice} assetString={pair.longAsset} />
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell tw-text-trade-short">
        <AssetValue
          value={item.liquidationPrice}
          assetString={pair.longAsset}
        />
      </td>
      <td className="tw-text-right">
        <AssetValue value={item.margin} assetString={pair.shortAsset} />
        {` (${toNumberFormat(item.leverage, 2)}x)`}
      </td>
      <td
        className={classNames(
          item.unrealized.shortValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <div className="tw-flex tw-flex-row tw-items-center">
          <div className="tw-mr-2">
            <AssetValue
              className="tw-block"
              value={item.unrealized.shortValue}
              assetString={pair.shortAsset}
            />
            <AssetValue
              className="tw-block"
              value={item.unrealized.longValue}
              assetString={pair.longAsset}
              isApproximation
            />
          </div>
          <div>
            ({item.unrealized.roe > 0 ? '+' : ''}
            {numberToPercent(item.unrealized.roe, 1)})
          </div>
        </div>
      </td>
      <td
        className={classNames(
          'tw-hidden 2xl:tw-table-cell',
          item.realized.shortValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          className="tw-block"
          value={item.realized.shortValue}
          assetString={pair.shortAsset}
        />
        <AssetValue
          className="tw-block"
          value={item.realized.longValue}
          assetString={pair.longAsset}
          isApproximation
        />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
          {/* TODO: implement OpenPosition Actions */}
        </div>
      </td>
    </tr>
  );
}

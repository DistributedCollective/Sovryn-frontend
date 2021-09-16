import React from 'react';
import { TradingPosition } from 'types/trading-position';
import { numberToPercent } from 'utils/display-text/format';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { OpenPositionEntry } from '../../hooks/usePerpetual_OpenPositions';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpatual-pair-dictionary';
import { PerpetualPair } from '../../../../../utils/models/perpetual-pair';
import classNames from 'classnames';

interface IOpenPositionRowProps {
  item: OpenPositionEntry;
}

export function OpenPositionRow({ item }: IOpenPositionRowProps) {
  const { checkMaintenances, States } = useMaintenance();
  const {
    [States.CLOSE_MARGIN_TRADES]: closeTradesLocked,
    [States.ADD_TO_MARGIN_TRADES]: addToMarginLocked,
  } = checkMaintenances();

  const pair = PerpetualPairDictionary.get(item.pair as PerpetualPairType);
  const type = item.position > 0 ? TradingPosition.LONG : TradingPosition.SHORT;

  const isLong = type === TradingPosition.LONG;

  if (pair === undefined) return null;

  return (
    <tr>
      <td
        className={classNames(
          isLong ? 'tw-text-trade-long' : 'tw-text-trade-short',
        )}
      >
        {pair.chartSymbol}
      </td>
      <td
        className={classNames(
          'tw-hidden xl:tw-table-cell',
          isLong ? 'tw-text-trade-long' : 'tw-text-trade-short',
        )}
      >
        {item.position} <AssetRenderer asset={pair.longAsset} />
      </td>
      <td className="tw-hidden xl:tw-table-cell">
        {item.value} <AssetRenderer asset={pair.shortAsset} />
      </td>
      <td className="tw-hidden md:tw-table-cell">
        {item.entryPrice} <AssetRenderer asset={pair.longAsset} />
      </td>
      <td className="tw-hidden md:tw-table-cell">
        {item.markPrice} <AssetRenderer asset={pair.longAsset} />
      </td>
      <td className="tw-hidden md:tw-table-cell tw-text-trade-short">
        {item.liquidationPrice} <AssetRenderer asset={pair.longAsset} />
      </td>
      <td className="tw-hidden md:tw-table-cell">
        {item.margin} <AssetRenderer asset={pair.shortAsset} />
        {` (${item.leverage.toPrecision(3)}x)`}
      </td>
      <td
        className={classNames(
          'tw-hidden md:tw-table-cell',
          item.unrealized?.[0] >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <div className="tw-block">
          <div>
            {item.unrealized?.[0]} <AssetRenderer asset={pair.shortAsset} />
          </div>
          <div>
            {item.unrealized?.[1]} <AssetRenderer asset={pair.longAsset} />
          </div>
        </div>
        <div>
          ({item.unrealized?.[2] > 0 ? '+' : ''}
          {numberToPercent(item.unrealized?.[2], 1)})
        </div>
      </td>
      <td
        className={classNames(
          'tw-hidden md:tw-table-cell',
          item.unrealized?.[0] >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <div className="tw-block">
          <div>
            {item.realized?.[0]} <AssetRenderer asset={pair.shortAsset} />
          </div>
          <div>
            {item.realized?.[1]} <AssetRenderer asset={pair.longAsset} />
          </div>
        </div>
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start"></div>
      </td>
    </tr>
  );
}

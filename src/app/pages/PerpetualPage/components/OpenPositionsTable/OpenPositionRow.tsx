import React, { useCallback } from 'react';
import { numberToPercent, toNumberFormat } from 'utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { OpenPositionEntry } from '../../hooks/usePerpetual_OpenPositions';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../components/AssetValue';
import { translations } from '../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../slice';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PerpetualTradeType,
} from '../../types';
import { TradingPosition } from '../../../../../types/trading-position';

interface IOpenPositionRowProps {
  item: OpenPositionEntry;
}

export function OpenPositionRow({ item }: IOpenPositionRowProps) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const inMaintenance = checkMaintenance(States.PERPETUAL_TRADES);
  // TODO: implement maintenance stops for actions!

  const pair = PerpetualPairDictionary.get(item.pair as PerpetualPairType);

  const onOpenEditSize = useCallback(() => {
    const trade: PerpetualTrade = {
      id: item.id,
      pairType: item.pair as PerpetualPairType,
      tradeType: item.type as PerpetualTradeType,
      position: item.position as TradingPosition,
      slippage: item.slippage,
      amount: item.amount,
      collateral: pair.collaterals[0],
      leverage: item.leverage,
    };
    dispatch(actions.setModal(PerpetualPageModals.EDIT_POSITION_SIZE, trade));
  }, [item, pair, dispatch]);

  if (pair === undefined) return null;

  return (
    <tr>
      <td>{pair.name}</td>
      <td
        className={classNames(
          'tw-text-right',
          item.position === TradingPosition.LONG
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue value={item.amount} assetString={pair.longAsset} />
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
          {inMaintenance ? (
            <div>{t(translations.common.maintenance)}</div>
          ) : (
            <button
              className="tw-text-primary tw-text-sm tw-font-medium"
              onClick={onOpenEditSize}
            >
              {t(translations.perpetualPage.openPositionsTable.editSize)}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

import React, { useCallback, useMemo } from 'react';
import { toNumberFormat } from 'utils/display-text/format';
import { OpenPositionEntry } from '../../../hooks/usePerpetual_OpenPositions';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../../components/AssetValue';
import { translations } from '../../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../../slice';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PERPETUAL_SLIPPAGE_DEFAULT,
  PerpetualTradeType,
} from '../../../types';
import { TradingPosition } from '../../../../../../types/trading-position';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { toWei } from '../../../../../../utils/blockchain/math-helpers';
import { ErrorBadge } from 'app/components/Form/ErrorBadge';
import { usePerpetual_isTradingInMaintenance } from '../../../hooks/usePerpetual_isTradingInMaintenance';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { TableRowAction } from '../../TableRowAction';

type OpenPositionRowProps = {
  item: OpenPositionEntry;
};

export const OpenPositionRow: React.FC<OpenPositionRowProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const inMaintenance = usePerpetual_isTradingInMaintenance();

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const onOpenTradeModal = useCallback(
    (modal: PerpetualPageModals) => {
      const trade: PerpetualTrade = {
        id: item.id,
        pairType: item.pairType,
        tradeType: item.type || PerpetualTradeType.MARKET,
        position: item.position || TradingPosition.LONG,
        slippage: PERPETUAL_SLIPPAGE_DEFAULT,
        amount: item.amount ? toWei(Math.abs(item.amount)) : '0',
        collateral: pair.collateralAsset,
        leverage: item.leverage || 0,
        entryPrice: item.entryPrice ? toWei(item.entryPrice) : '0',
        averagePrice: item.averagePrice ? toWei(item.averagePrice) : '0',
      };
      dispatch(actions.setModal(modal, trade));
    },
    [item, pair, dispatch],
  );

  const onEditLeverage = useCallback(
    () => onOpenTradeModal(PerpetualPageModals.EDIT_LEVERAGE),
    [onOpenTradeModal],
  );

  const onEditMargin = useCallback(
    () => onOpenTradeModal(PerpetualPageModals.EDIT_MARGIN),
    [onOpenTradeModal],
  );

  const onCloseTrade = useCallback(
    () => onOpenTradeModal(PerpetualPageModals.CLOSE_POSITION),
    [onOpenTradeModal],
  );

  const isEmptyPosition = useMemo(() => !item.amount || item.amount === 0, [
    item.amount,
  ]);

  if (pair === undefined) {
    return null;
  }

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
        {item.amount && // typescript can't infer from !isEmptyPosition that item.amount has to exist
          !isEmptyPosition && (
            <AssetValue
              value={item.amount}
              assetString={pair.baseAsset}
              mode={AssetValueMode.auto}
              showPositiveSign
            />
          )}
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        {item.entryPrice && (
          <AssetValue value={item.entryPrice} assetString={pair.quoteAsset} />
        )}
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell">
        {item.liquidationPrice && (
          <AssetValue
            value={item.liquidationPrice}
            assetString={pair.quoteAsset}
          />
        )}
      </td>
      <td className="tw-text-right">
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.margin}
          assetString={collateralName}
          mode={AssetValueMode.auto}
        />
        {item.leverage ? ` (${toNumberFormat(item.leverage, 2)}x)` : null}
      </td>
      <td
        className={classNames({
          'tw-text-trade-long':
            item.unrealized && item.unrealized.baseValue > 0,
          'tw-text-trade-short':
            item.unrealized && item.unrealized.baseValue < 0,
        })}
      >
        {item.unrealized && (
          <div className="tw-flex tw-flex-row tw-items-center">
            <div className="tw-mr-2">
              <AssetValue
                className="tw-block"
                minDecimals={0}
                maxDecimals={10}
                value={item.unrealized.baseValue}
                assetString={pair.baseAsset}
                mode={AssetValueMode.auto}
                showPositiveSign
              />
              <AssetValue
                className="tw-block"
                minDecimals={2}
                maxDecimals={2}
                value={item.unrealized.quoteValue}
                assetString={pair.quoteAsset}
                mode={AssetValueMode.auto}
                isApproximation
                showPositiveSign
              />
            </div>
          </div>
        )}
      </td>
      <td
        className={classNames('tw-hidden 2xl:tw-table-cell', {
          'tw-text-trade-long': item.realized && item.realized.baseValue > 0,
          'tw-text-trade-short': item.realized && item.realized.baseValue < 0,
        })}
      >
        {item.realized && (
          <>
            <AssetValue
              className="tw-block"
              minDecimals={0}
              maxDecimals={10}
              value={item.realized.baseValue}
              assetString={pair.baseAsset}
              mode={AssetValueMode.auto}
              showPositiveSign
            />
            <AssetValue
              className="tw-block"
              minDecimals={2}
              maxDecimals={2}
              value={item.realized.quoteValue}
              assetString={pair.quoteAsset}
              mode={AssetValueMode.auto}
              isApproximation
              showPositiveSign
            />
          </>
        )}
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
          {inMaintenance ? (
            <ErrorBadge
              content={<>{t(translations.maintenance.perpetualsTrade)}</>}
            />
          ) : (
            <>
              <TableRowAction
                label={t(
                  translations.perpetualPage.openPositionsTable.editLeverage,
                )}
                tooltip={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .editLeverage,
                )}
                onClick={onEditLeverage}
                dataActionId="perps-tables-openPositions-action-edit-leverage"
              />
              <TableRowAction
                label={t(
                  translations.perpetualPage.openPositionsTable.editMargin,
                )}
                tooltip={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .editMargin,
                )}
                onClick={onEditMargin}
                dataActionId="perps-tables-openPositions-action-edit-margin"
              />

              <TableRowAction
                label={t(
                  translations.perpetualPage.openPositionsTable.editClose,
                )}
                tooltip={t(
                  translations.perpetualPage.openPositionsTable.tooltips
                    .editClose,
                )}
                onClick={onCloseTrade}
                dataActionId="perps-tables-openPositions-action-close-trade"
              />
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

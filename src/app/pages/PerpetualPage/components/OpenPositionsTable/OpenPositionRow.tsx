import React, { useCallback, useMemo } from 'react';
import { numberToPercent, toNumberFormat } from 'utils/display-text/format';
import { useMaintenance } from 'app/hooks/useMaintenance';
import { OpenPositionEntry } from '../../hooks/usePerpetual_OpenPositions';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../components/AssetValue';
import { translations } from '../../../../../locales/i18n';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions } from '../../slice';
import {
  PerpetualPageModals,
  PerpetualTrade,
  PERPETUAL_SLIPPAGE_DEFAULT,
} from '../../types';
import { TradingPosition } from '../../../../../types/trading-position';
import { toWei } from 'web3-utils';

type OpenPositionRowProps = {
  item: OpenPositionEntry;
};

export const OpenPositionRow: React.FC<OpenPositionRowProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const isMaintenance = checkMaintenance(States.PERPETUAL_TRADES);

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  const onOpenTradeModal = useCallback(
    (modal: PerpetualPageModals) => {
      const trade: PerpetualTrade = {
        id: item.id,
        pairType: item.pairType,
        tradeType: item.type,
        position: item.position,
        slippage: PERPETUAL_SLIPPAGE_DEFAULT,
        amount: toWei(item.amount.toPrecision(18)),
        collateral: pair.collateralAsset,
        leverage: item.leverage,
      };
      dispatch(actions.setModal(modal, trade));
    },
    [item, pair, dispatch],
  );

  const onEditSize = useCallback(
    () => onOpenTradeModal(PerpetualPageModals.EDIT_POSITION_SIZE),
    [onOpenTradeModal],
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
    () => onOpenTradeModal(PerpetualPageModals.TRADE_CLOSE),
    [onOpenTradeModal],
  );

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
        <AssetValue value={item.amount} assetString={pair.baseAsset} />
      </td>
      <td className="tw-text-right tw-hidden md:tw-table-cell">
        {item.entryPrice && (
          <AssetValue value={item.entryPrice} assetString={pair.quoteAsset} />
        )}
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell">
        <AssetValue value={item.markPrice} assetString={pair.quoteAsset} />
      </td>
      <td className="tw-text-right tw-hidden xl:tw-table-cell">
        <AssetValue
          value={item.liquidationPrice}
          assetString={pair.quoteAsset}
        />
      </td>
      <td className="tw-text-right">
        <AssetValue value={item.margin} assetString={pair.baseAsset} />
        {` (${toNumberFormat(item.leverage, 2)}x)`}
      </td>
      <td
        className={classNames(
          item.unrealized.baseValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <div className="tw-flex tw-flex-row tw-items-center">
          <div className="tw-mr-2">
            <AssetValue
              className="tw-block"
              value={item.unrealized.baseValue}
              assetString={pair.baseAsset}
            />
            <AssetValue
              className="tw-block"
              value={item.unrealized.quoteValue}
              assetString={pair.quoteAsset}
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
          item.realized.baseValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        <AssetValue
          className="tw-block"
          value={item.realized.baseValue}
          assetString={pair.baseAsset}
        />
        <AssetValue
          className="tw-block"
          value={item.realized.quoteValue}
          assetString={pair.quoteAsset}
          isApproximation
        />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-end xl:tw-justify-around 2xl:tw-justify-start">
          {isMaintenance ? (
            <div>{t(translations.common.maintenance)}</div>
          ) : (
            <>
              <button
                className="tw-mr-8 tw-text-primary tw-text-sm tw-font-medium"
                onClick={onEditSize}
              >
                {t(translations.perpetualPage.openPositionsTable.editSize)}
              </button>
              <button
                className="tw-mr-8 tw-text-primary tw-text-sm tw-font-medium"
                onClick={onEditLeverage}
              >
                {t(translations.perpetualPage.openPositionsTable.editLeverage)}
              </button>
              <button
                className="tw-mr-8 tw-text-primary tw-text-sm tw-font-medium"
                onClick={onEditMargin}
              >
                {t(translations.perpetualPage.openPositionsTable.editMargin)}
              </button>
              <button
                className="tw-mr-8 tw-text-primary tw-text-sm tw-font-medium"
                onClick={onCloseTrade}
              >
                {t(translations.perpetualPage.openPositionsTable.editClose)}
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

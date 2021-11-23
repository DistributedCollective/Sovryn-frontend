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
  PerpetualTradeType,
} from '../../types';
import { TradingPosition } from '../../../../../types/trading-position';
import { toWei } from 'web3-utils';
import { AssetValueMode } from '../../../../components/AssetValue/types';
import { usePerpetual_closePosition } from '../../hooks/usePerpetual_closePosition';
import { TxStatus } from '../../../../../store/global/transactions-store/types';

type OpenPositionRowProps = {
  item: OpenPositionEntry;
};

export const OpenPositionRow: React.FC<OpenPositionRowProps> = ({ item }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { checkMaintenance, States } = useMaintenance();
  const isMaintenance = checkMaintenance(States.PERPETUAL_TRADES);
  const { status, closePosition } = usePerpetual_closePosition();

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  const onOpenTradeModal = useCallback(
    (modal: PerpetualPageModals) => {
      const trade: PerpetualTrade = {
        id: item.id,
        pairType: item.pairType,
        tradeType: item.type || PerpetualTradeType.MARKET,
        position: item.position || TradingPosition.LONG,
        slippage: PERPETUAL_SLIPPAGE_DEFAULT,
        amount: item.amount ? toWei(Math.abs(item.amount).toPrecision(8)) : '0',
        collateral: pair.collateralAsset,
        leverage: item.leverage || 0,
        entryPrice: item.entryPrice || 0,
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
    () => (!status || status === TxStatus.NONE) && closePosition(),
    [status, closePosition],
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
        {item.markPrice && (
          <AssetValue value={item.markPrice} assetString={pair.quoteAsset} />
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
        <AssetValue value={item.margin} assetString={pair.baseAsset} />
        {item.leverage ? ` (${toNumberFormat(item.leverage, 2)}x)` : null}
      </td>
      <td
        className={classNames(
          item.unrealized && item.unrealized.baseValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        {item.unrealized && (
          <div className="tw-flex tw-flex-row tw-items-center">
            <div className="tw-mr-2">
              <AssetValue
                className="tw-block"
                minDecimals={2}
                maxDecimals={4}
                value={item.unrealized.baseValue}
                assetString={pair.baseAsset}
                mode={AssetValueMode.auto}
                showPositiveSign
              />
              <AssetValue
                className="tw-block"
                value={item.unrealized.quoteValue}
                assetString={pair.quoteAsset}
                isApproximation
                showPositiveSign
              />
            </div>
            <div>
              ({item.unrealized.roe > 0 ? '+' : ''}
              {numberToPercent(item.unrealized.roe, 1)})
            </div>
          </div>
        )}
      </td>
      <td
        className={classNames(
          'tw-hidden 2xl:tw-table-cell',
          item.realized && item.realized.baseValue >= 0
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        {item.realized && (
          <>
            <AssetValue
              className="tw-block"
              minDecimals={2}
              maxDecimals={4}
              value={item.realized.baseValue}
              assetString={pair.baseAsset}
              mode={AssetValueMode.auto}
              showPositiveSign
            />
            <AssetValue
              className="tw-block"
              value={item.realized.quoteValue}
              assetString={pair.quoteAsset}
              isApproximation
              showPositiveSign
            />
          </>
        )}
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
                className={classNames(
                  'tw-mr-8 tw-text-primary tw-text-sm tw-font-medium',
                  isEmptyPosition && 'tw-opacity-25 tw-cursor-not-allowed',
                )}
                onClick={onEditLeverage}
                disabled={isEmptyPosition}
              >
                {t(translations.perpetualPage.openPositionsTable.editLeverage)}
              </button>
              <button
                className={classNames(
                  'tw-mr-8 tw-text-primary tw-text-sm tw-font-medium',
                  isEmptyPosition && 'tw-opacity-25 tw-cursor-not-allowed',
                )}
                onClick={onEditMargin}
                disabled={isEmptyPosition}
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

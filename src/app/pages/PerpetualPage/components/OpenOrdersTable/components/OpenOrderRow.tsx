import React, { useCallback, useMemo } from 'react';
import { PerpetualPairDictionary } from '../../../../../../utils/dictionaries/perpetual-pair-dictionary';
import classNames from 'classnames';
import { AssetValue } from '../../../../../components/AssetValue';
import { useTranslation } from 'react-i18next';
import { AssetValueMode } from '../../../../../components/AssetValue/types';
import { getCollateralName } from 'app/pages/PerpetualPage/utils/renderUtils';
import { OpenOrderEntry } from 'app/pages/PerpetualPage/hooks/usePerpetual_OpenOrders';
import {
  DisplayDate,
  SeparatorType,
} from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import {
  PerpetualTradeType,
  PERPETUAL_CHAIN_ID,
  PerpetualPageModals,
} from 'app/pages/PerpetualPage/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { prettyTx } from 'utils/helpers';
import { translations } from 'locales/i18n';
import { TableRowAction } from '../../TableRowAction';
import { actions } from '../../../slice';
import { useDispatch } from 'react-redux';
import {
  PerpetualTxMethod,
  PerpetualTxCancelLimitOrder,
} from '../../TradeDialog/types';
import { toWei } from '../../../../../../utils/blockchain/math-helpers';
import { TradingPosition } from '../../../../../../types/trading-position';

type OpenOrderRowProps = {
  item: OpenOrderEntry;
};

export const OpenOrderRow: React.FC<OpenOrderRowProps> = ({ item }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  const collateralName = useMemo(
    () => getCollateralName(pair.collateralAsset),
    [pair.collateralAsset],
  );

  const onCancelOrder = useCallback(() => {
    const transactions: PerpetualTxCancelLimitOrder[] = [
      {
        method: PerpetualTxMethod.cancelLimitOrder,
        pair: item.pairType,
        digest: item.id,
        tx: null,
      },
    ];

    dispatch(
      actions.setModal(PerpetualPageModals.TRADE_REVIEW, {
        origin: PerpetualPageModals.CANCEL_ORDER,
        trade: {
          id: item.id,
          pairType: item.pairType,
          tradeType: item.orderType,
          position:
            item.orderSize > 0 ? TradingPosition.LONG : TradingPosition.SHORT,
          amount: toWei(Math.abs(item.orderSize)),
          entryPrice: toWei(item.limitPrice),
          limit: toWei(item.limitPrice),
          collateral: pair.collateralAsset,
          leverage: -1,
          slippage: 0,
        },
        transactions: transactions,
      }),
    );
  }, [pair, item, dispatch]);

  const orderTypeTranslation = useMemo(() => {
    const tradeDirection = t(
      translations.perpetualPage.openOrdersTable.orderTypes[
        item?.orderSize > 0 ? 'buy' : 'sell'
      ],
    );

    if (item.orderType === PerpetualTradeType.STOP) {
      return `${t(
        translations.perpetualPage.openOrdersTable.orderTypes.stop,
      )} ${tradeDirection}`;
    }

    return `${t(
      translations.perpetualPage.openOrdersTable.orderTypes.limit,
    )} ${tradeDirection}`;
  }, [item, t]);

  return (
    <tr>
      <td>
        <DisplayDate
          timestamp={item.createdAt || Math.floor(Date.now() / 1e3).toString()}
          separator={SeparatorType.Dash}
        />
      </td>
      <td>{pair.name}</td>
      <td
        className={classNames({
          'tw-text-trade-long': item.orderSize > 0,
          'tw-text-trade-short': item.orderSize < 0,
        })}
      >
        {orderTypeTranslation}
      </td>
      <td>{collateralName}</td>
      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={6}
          value={item.orderSize}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={2}
          value={item.limitPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>

      <td>
        <AssetValue
          minDecimals={2}
          maxDecimals={2}
          value={item.triggerPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <DisplayDate
          timestamp={item.expiry || Math.floor(Date.now() / 1e3).toString()}
          separator={SeparatorType.Dash}
        />
      </td>
      <td>
        <LinkToExplorer
          className="tw-text-sov-white tw-underline"
          txHash={item.id}
          text={prettyTx(item.id)}
          chainId={PERPETUAL_CHAIN_ID}
        />
      </td>
      <td>
        <TableRowAction
          label={t(translations.perpetualPage.openOrdersTable.cancel)}
          tooltip={t(
            translations.perpetualPage.openOrdersTable.tooltips.cancel,
          )}
          onClick={onCancelOrder}
        />
      </td>
    </tr>
  );
};

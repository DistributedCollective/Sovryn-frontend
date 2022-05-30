import React, { useMemo } from 'react';
import {
  OrderHistoryEntry,
  OrderState,
} from '../../hooks/usePerpetual_OrderHistory';
import {
  DisplayDate,
  SeparatorType,
} from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import classNames from 'classnames';
import { TradingPosition } from 'types/trading-position';
import { PerpetualTradeType, PERPETUAL_CHAIN_ID } from '../../types';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { prettyTx } from 'utils/helpers';
import { getCollateralName } from '../../utils/renderUtils';
import { Asset } from 'types';

const tradeTypeTranslations: { [key in PerpetualTradeType]: string } = {
  [PerpetualTradeType.MARKET]:
    translations.perpetualPage.orderHistoryTable.tableData.market,
  [PerpetualTradeType.LIMIT]:
    translations.perpetualPage.orderHistoryTable.tableData.limit,
  [PerpetualTradeType.STOP]:
    translations.perpetualPage.orderHistoryTable.tableData.stop,
  [PerpetualTradeType.LIQUIDATION]:
    translations.perpetualPage.orderHistoryTable.tableData.liquidation,
};

const tradingPositionTranslations: { [key in TradingPosition]: string } = {
  [TradingPosition.LONG]:
    translations.perpetualPage.orderHistoryTable.tableData.buy,
  [TradingPosition.SHORT]:
    translations.perpetualPage.orderHistoryTable.tableData.sell,
};

type OrderHistoryRowProps = {
  item: OrderHistoryEntry;
};

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({
  item: {
    position,
    tradeType,
    datetime,
    pair,
    execPrice,
    orderId,
    orderSize,
    orderState,
    triggerPrice,
    limitPrice,
  },
}) => {
  const { t } = useTranslation();

  const typeText = useMemo(() => {
    if (position === undefined) {
      return t(tradeTypeTranslations[tradeType]);
    }

    return `${t(tradeTypeTranslations[tradeType])} ${t(
      tradingPositionTranslations[position],
    )}`;
  }, [t, tradeType, position]);

  const shouldHideExecPrice = useMemo(
    () =>
      ([PerpetualTradeType.LIMIT, PerpetualTradeType.STOP].includes(
        tradeType,
      ) &&
        [OrderState.Opened, OrderState.Cancelled].includes(orderState)) ||
      !execPrice,
    [execPrice, orderState, tradeType],
  );

  const shouldHideTriggerPrice = useMemo(
    () =>
      tradeType !== PerpetualTradeType.STOP ||
      !triggerPrice ||
      triggerPrice === '0',
    [tradeType, triggerPrice],
  );

  return (
    <tr>
      <td>
        <DisplayDate timestamp={datetime} separator={SeparatorType.Dash} />
      </td>
      <td>{pair?.name}</td>
      <td
        className={classNames({
          'tw-text-trade-long': position === TradingPosition.LONG,
          'tw-text-trade-short': position === TradingPosition.SHORT,
        })}
      >
        {typeText}
      </td>
      <td>{orderState}</td>
      <td>{getCollateralName(pair?.collateralAsset || Asset.BTCS)}</td>
      <td>
        <AssetValue
          value={orderSize}
          assetString={pair?.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        {shouldHideTriggerPrice ? (
          <span>–</span>
        ) : (
          <AssetValue
            value={triggerPrice!} // shouldHideTriggerPrice checks if triggerPrice exists so this is safe
            assetString={pair?.quoteAsset}
            mode={AssetValueMode.auto}
          />
        )}
      </td>
      <td>
        {limitPrice && (
          <AssetValue
            minDecimals={0}
            maxDecimals={2}
            value={limitPrice}
            assetString={pair?.quoteAsset}
            mode={AssetValueMode.auto}
          />
        )}
      </td>
      <td>
        {shouldHideExecPrice ? (
          <span>–</span>
        ) : (
          <AssetValue
            minDecimals={0}
            maxDecimals={2}
            value={execPrice!} // shouldHideExecPrice checks if execPrice exists so this is safe
            assetString={pair?.quoteAsset}
            mode={AssetValueMode.auto}
          />
        )}
      </td>
      <td>
        {orderId && (
          <LinkToExplorer
            className="tw-text-sov-white tw-underline"
            txHash={orderId}
            text={prettyTx(orderId)}
            chainId={PERPETUAL_CHAIN_ID}
          />
        )}
      </td>
    </tr>
  );
};

import React, { useMemo } from 'react';
import { OrderHistoryEntry } from '../../hooks/usePerpetual_OrderHistory';
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
    execSize,
    execPrice,
    orderId,
    orderSize,
    orderState,
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
        <AssetValue
          value={execSize}
          assetString={pair?.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        {execPrice && (
          <AssetValue
            minDecimals={0}
            maxDecimals={2}
            value={execPrice}
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

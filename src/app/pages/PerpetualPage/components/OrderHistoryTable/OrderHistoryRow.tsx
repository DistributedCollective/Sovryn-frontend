import React, { useMemo } from 'react';
import { OrderHistoryEntry } from '../../hooks/usePerpetual_OrderHistory';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
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

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ item }) => {
  const { t } = useTranslation();

  const typeText = useMemo(() => {
    if (item.position === undefined) {
      return t(tradeTypeTranslations[item.tradeType]);
    }

    return `${t(tradeTypeTranslations[item.tradeType])} ${t(
      tradingPositionTranslations[item.position],
    )}`;
  }, [t, item.tradeType, item.position]);

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{item?.pair?.name}</td>
      <td
        className={classNames({
          'tw-text-trade-long': item.position === TradingPosition.LONG,
          'tw-text-trade-short': item.position === TradingPosition.SHORT,
        })}
      >
        {typeText}
      </td>
      <td>{item.orderState}</td>
      <td>{getCollateralName(item?.pair?.collateralAsset || Asset.BTCS)}</td>
      <td>
        <AssetValue
          value={item.orderSize}
          assetString={item?.pair?.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        {item.limitPrice && (
          <AssetValue
            minDecimals={0}
            maxDecimals={2}
            value={item.limitPrice}
            assetString={item?.pair?.quoteAsset}
            mode={AssetValueMode.auto}
          />
        )}
      </td>
      <td>
        <AssetValue
          value={item.execSize}
          assetString={item?.pair?.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        {item.execPrice && (
          <AssetValue
            minDecimals={0}
            maxDecimals={2}
            value={item.execPrice}
            assetString={item?.pair?.quoteAsset}
            mode={AssetValueMode.auto}
          />
        )}
      </td>
      <td>
        {item.orderId && (
          <LinkToExplorer
            className="tw-text-sov-white tw-underline"
            txHash={item.orderId}
            text={prettyTx(item.orderId)}
            chainId={PERPETUAL_CHAIN_ID}
          />
        )}
      </td>
    </tr>
  );
};

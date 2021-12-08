import React, { useMemo } from 'react';
import { PerpetualPairDictionary } from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
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
import { currentChainId } from 'utils/classifiers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useSelector } from 'react-redux';

type OrderHistoryRowProps = {
  item: OrderHistoryEntry;
};

export const OrderHistoryRow: React.FC<OrderHistoryRowProps> = ({ item }) => {
  const { t } = useTranslation();

  const { bridgeChainId } = useSelector(selectWalletProvider);

  const pair = useMemo(() => PerpetualPairDictionary.get(item.pairType), [
    item.pairType,
  ]);

  return (
    <tr>
      <td>
        <DisplayDate timestamp={item.datetime} />
      </td>
      <td>{pair.name}</td>
      <td
        className={classNames(
          item.position === TradingPosition.LONG
            ? 'tw-text-trade-long'
            : 'tw-text-trade-short',
        )}
      >
        {`${
          item.tradeType === PerpetualTradeType.MARKET
            ? t(translations.perpetualPage.orderHistoryTable.tableData.market)
            : t(translations.perpetualPage.orderHistoryTable.tableData.limit)
        } ${
          item.position === TradingPosition.LONG
            ? t(translations.perpetualPage.orderHistoryTable.tableData.buy)
            : t(translations.perpetualPage.orderHistoryTable.tableData.sell)
        }`}
      </td>
      <td>{item.orderState}</td>
      <td>{pair.collateralAsset}</td>
      <td>
        <AssetValue
          value={item.orderSize}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          minDecimals={0}
          maxDecimals={2}
          value={item.limitPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          value={item.execSize}
          assetString={pair.baseAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <AssetValue
          minDecimals={0}
          maxDecimals={2}
          value={item.execPrice}
          assetString={pair.quoteAsset}
          mode={AssetValueMode.auto}
        />
      </td>
      <td>
        <LinkToExplorer
          className="tw-text-sov-white tw-underline"
          txHash={item.orderId}
          text={prettyTx(item.orderId)}
          chainId={PERPETUAL_CHAIN_ID}
        />
      </td>
    </tr>
  );
};

import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { usePerpetual_RecentTradesTable } from '../../hooks/usePerpetual_RecentTradesTable';
import styles from './index.module.scss';
import { RecentTradesTableRow } from './components/RecentTablesRow/index';
import { RecentTradesDataEntry, TradePriceChange, TradeType } from './types';
import { useGetRecentTrades } from '../../hooks/graphql/useGetRecentTrades';
import { weiTo2 } from 'utils/blockchain/math-helpers';
import {
  subscription as bscSubscription,
  decodeTradeLogs,
} from '../../utils/bscWebsocket';
import { getContract } from 'utils/blockchain/contract-helpers';

// const WebSocket = require('ws');
// const url = 'ws://localhost:8080';

const address = getContract('perpetualManager').address.toLowerCase();
const subscription = bscSubscription(address, ['Trade']);

type RecentTradesTableProps = {
  pair: PerpetualPair;
};

const formatTradeData = (data: any[]): RecentTradesDataEntry[] => {
  const parsedData: RecentTradesDataEntry[] = data.map((trade, index) => {
    const prevTrade = index !== data.length - 1 ? data[index + 1] : data[index];
    console.log(prevTrade);
    return {
      id: index.toString(),
      price: parseFloat(weiTo2(trade.price)),
      priceChange:
        parseFloat(prevTrade.price) === parseFloat(trade.price)
          ? TradePriceChange.NO_CHANGE
          : parseFloat(prevTrade.price) > parseFloat(trade.price)
          ? TradePriceChange.UP
          : TradePriceChange.DOWN,
      size: Math.abs(parseFloat(weiTo2(trade.tradeAmount))),
      time: new Date(parseInt(trade.blockTimestamp) * 1e3)
        .toTimeString()
        .slice(0, 8),
      type: trade.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
    };
  });
  return parsedData;
};

export const RecentTradesTable: React.FC<RecentTradesTableProps> = ({
  pair,
}) => {
  const { data: newData, error, loading } = useGetRecentTrades(pair.id);
  const [trades, setTrades] = useState<RecentTradesDataEntry[]>([]);

  useEffect(() => {
    if (newData) {
      const parsedData = formatTradeData(newData.trades);
      setTrades(parsedData);
    }

    if (error) {
      console.error(error);
    }
  }, [newData, error]);

  subscription.on('connected', () => {
    console.log('[recentTrades] bsc websocket connected');
  });

  return (
    <table className={styles.recentTradesTable}>
      <thead className="tw-bg-black tw-sticky tw-top-0 tw-z-10">
        <tr>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.perpetualPage.recentTrades.price}
              components={[
                <AssetSymbolRenderer assetString={pair.quoteAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-w-4/12 tw-pr-4 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.perpetualPage.recentTrades.size}
              components={[
                <AssetSymbolRenderer assetString={pair.baseAsset} />,
              ]}
            />
          </th>
          <th className="tw-h-6 tw-pr-4 tw-pb-1 tw-text-right">
            <Trans
              i18nKey={translations.perpetualPage.recentTrades.time}
              components={[
                <AssetSymbolRenderer assetString={pair.baseAsset} />,
              ]}
            />
          </th>
          <th />
        </tr>
      </thead>
      <tbody>
        {trades &&
          trades.map((item, index) => (
            <RecentTradesTableRow
              key={item.id}
              row={item}
              isOddRow={index % 2 === 0}
            />
          ))}
      </tbody>
    </table>
  );
};

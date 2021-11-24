import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { translations } from 'locales/i18n';
import React, { useEffect, useState, useContext } from 'react';
import { Trans } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
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
import SocketContext from './context';

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
  const { trades: wsTrades } = useContext(SocketContext);

  useEffect(() => {
    console.log('[socketProvider]: trades state changed', wsTrades);
  }, [wsTrades]);

  useEffect(() => {
    if (newData) {
      const parsedData = formatTradeData(newData.trades);
      setTrades(parsedData);
    }

    if (error) {
      console.error(error);
    }
  }, [newData, error]);

  useEffect(() => {
    if (!loading) {
      subscription.on('connected', () => {
        console.log('[recentTrades] bsc websocket connected');
      });

      subscription.on('data', data => {
        // console.log('[recentTrades] messageReceived', data);
        if (trades.length > 0) {
          const decoded = decodeTradeLogs(data.data, [data.topics[1]]);
          const prevTrade = trades[0];
          const price = parseFloat(weiTo2(decoded.price));
          const parsedTrade: RecentTradesDataEntry = {
            id: data.transactionHash,
            type:
              decoded.tradeAmount[0] === '-' ? TradeType.SELL : TradeType.BUY,
            priceChange:
              prevTrade.price === price
                ? TradePriceChange.NO_CHANGE
                : prevTrade.price > price
                ? TradePriceChange.UP
                : TradePriceChange.DOWN,
            price: price,
            size: Math.abs(parseFloat(weiTo2(decoded.tradeAmount))),
            time: new Date().toTimeString().slice(0, 8),
          };
          // console.log(parsedTrade);
          trades.unshift(parsedTrade);
        }
      });
    }
  }, [loading, trades]);

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

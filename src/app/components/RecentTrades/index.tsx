import React, { useMemo } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Asset } from 'types';
import { MarginTrades } from './MarginTrades';
import { SwapTrades } from './SwapTrades';

export enum RecentTradeTypes {
  MARGIN = 'margin',
  SWAP = 'swap',
}

interface IRecentTradesProps {
  baseToken: Asset;
  quoteToken: Asset;
  type?: RecentTradeTypes;
}

const getDisplay = (type: RecentTradeTypes, baseToken, quoteToken) => {
  switch (type) {
    case RecentTradeTypes.SWAP:
      return <SwapTrades baseToken={baseToken} quoteToken={quoteToken} />;
    case RecentTradeTypes.MARGIN:
      return <MarginTrades baseToken={baseToken} quoteToken={quoteToken} />;
    default:
      return <SwapTrades baseToken={baseToken} quoteToken={quoteToken} />;
  }
};

export const RecentTrades: React.FC<IRecentTradesProps> = ({
  baseToken,
  quoteToken,
  type = RecentTradeTypes.SWAP,
}) => {
  const tradeDisplay = useMemo(() => getDisplay(type, baseToken, quoteToken), [
    type,
    baseToken,
    quoteToken,
  ]);
  return (
    <div
      className={classNames(
        styles.table,
        'tw-w-full tw-text-xs tw-leading-tight tw-overflow-y-auto tw-overflow-x-hidden',
      )}
    >
      {tradeDisplay}
    </div>
  );
};

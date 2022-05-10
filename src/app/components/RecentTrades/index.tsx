import React, { useMemo } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { Asset } from 'types';
import { MarginTrades } from './MarginTrades';
import { SwapTrades } from './SwapTrades';

export enum RecentTradeType {
  MARGIN = 'margin',
  SWAP = 'swap',
}

interface IRecentTradesProps {
  baseToken: Asset;
  quoteToken: Asset;
  type?: RecentTradeType;
}

const getRecentTradesComponent = (
  type: RecentTradeType,
  baseToken,
  quoteToken,
) => {
  switch (type) {
    case RecentTradeType.SWAP:
      return <SwapTrades baseToken={baseToken} quoteToken={quoteToken} />;
    case RecentTradeType.MARGIN:
      return <MarginTrades baseToken={baseToken} quoteToken={quoteToken} />;
    default:
      return <SwapTrades baseToken={baseToken} quoteToken={quoteToken} />;
  }
};

export const RecentTrades: React.FC<IRecentTradesProps> = ({
  baseToken,
  quoteToken,
  type = RecentTradeType.SWAP,
}) => {
  const tradeComponent = useMemo(
    () => getRecentTradesComponent(type, baseToken, quoteToken),
    [type, baseToken, quoteToken],
  );
  return (
    <div
      className={classNames(
        styles.table,
        'tw-w-full tw-text-xs tw-leading-tight tw-overflow-y-auto tw-overflow-x-hidden',
      )}
    >
      {tradeComponent}
    </div>
  );
};

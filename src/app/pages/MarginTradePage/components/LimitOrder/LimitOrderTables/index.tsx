import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';

import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';
import { OpenPositionsTable } from '../OpenPositionsTable';
import { LimitOrderHistory } from '../LimitOrderHistory';
import { useAccount } from 'app/hooks/useAccount';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { Asset } from 'types';
import { TradingPair } from 'utils/models/trading-pair';
import { TradingPosition } from 'types/trading-position';
import {
  assetByLoanTokenAddress,
  assetByTokenAddress,
} from 'utils/blockchain/contract-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { fromWei } from 'web3-utils';
import { useGetContractPastEvents } from 'app/hooks/useGetContractPastEvents';
import { useLog } from 'app/hooks/useDebug';

interface ILimitOrderTablesProps {
  activeTab: number;
}

export const LimitOrderTables: React.FC<ILimitOrderTablesProps> = ({
  activeTab,
}) => {
  const account = useAccount();

  const { value, loading } = useGetLimitOrders<MarginLimitOrder>(account, true);
  const limitOrders = useMemo(
    () =>
      value
        .map(parseMarginOrder)
        .filter(order => order.pair && !order.canceled)
        .sort((o1, o2) =>
          Number(o1.createdTimestamp) > Number(o2.createdTimestamp) ? -1 : 1,
        ),
    [value],
  );

  const { events } = useGetContractPastEvents('settlement', 'OrderFilled', {
    0: account,
  });

  useLog('@LimitOrderTables', events);

  return (
    <>
      <div className={classNames({ 'tw-hidden': activeTab !== 2 })}>
        <OpenPositionsTable
          orders={limitOrders.filter(item => item.filledAmount === '0')}
          orderFilledEvents={events}
          loading={loading}
        />
      </div>
      <div className={classNames({ 'tw-hidden': activeTab !== 3 })}>
        <LimitOrderHistory
          orders={limitOrders.filter(item => item.filledAmount !== '0')}
          orderFilledEvents={events}
          loading={loading}
        />
      </div>
    </>
  );
};

export interface MarginLimitOrderList {
  loanAsset: Asset;
  collateralAsset: Asset;
  pair: TradingPair;
  position: TradingPosition;
  leverage: number;
  loanTokenSent: string;
  collateralTokenSent: string;
  minEntryPrice: string;
  createdTimestamp: Date;
  deadline: Date;
  canceled?: boolean;
  filledAmount?: string;
  order: MarginLimitOrder;
}

export const parseMarginOrder = (
  item: MarginLimitOrder,
): MarginLimitOrderList => {
  const loanAsset = assetByLoanTokenAddress(item.loanTokenAddress);
  const collateralAsset = assetByTokenAddress(item.collateralTokenAddress);

  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const position =
    pair?.longAsset === loanAsset
      ? TradingPosition.LONG
      : TradingPosition.SHORT;

  const leverage = Number(fromWei(item.leverageAmount.toString())) + 1;

  return {
    loanAsset,
    collateralAsset,
    pair,
    position,
    leverage,
    loanTokenSent: item.loanTokenSent.toString(),
    collateralTokenSent: item.collateralTokenSent.toString(),
    minEntryPrice: item.minEntryPrice.toString(),
    createdTimestamp: new Date(Number(item.createdTimestamp.toString())),
    deadline: new Date(Number(item.deadline.toString())),
    canceled: item.canceled,
    filledAmount: item.filledAmount,
    order: item,
  };
};

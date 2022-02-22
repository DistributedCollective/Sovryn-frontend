import React, { useMemo } from 'react';
import classNames from 'classnames';

import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';
import { OpenPositionsTable } from '../OpenPositionsTable';
import { LimitOrderHistory } from '../LimitOrderHistory';
import { useAccount } from 'app/hooks/useAccount';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';

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
        .filter(order => !order.canceled)
        .sort((o1, o2) => (o1.createdTimestamp > o2.createdTimestamp ? -1 : 1)),
    [value],
  );

  return (
    <>
      <div className={classNames({ 'tw-hidden': activeTab !== 2 })}>
        <OpenPositionsTable
          orders={limitOrders.filter(item => item.filledAmount === '0')}
          loading={loading}
        />
      </div>
      <div className={classNames({ 'tw-hidden': activeTab !== 3 })}>
        <LimitOrderHistory
          orders={limitOrders.filter(item => item.filledAmount !== '0')}
          loading={loading}
        />
      </div>
    </>
  );
};

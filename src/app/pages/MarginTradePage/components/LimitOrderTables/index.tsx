import React, { useMemo } from 'react';
import cn from 'classnames';

import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';
import { LimitOrderHistory } from '../LimitOrderHistory';
import { useAccount } from 'app/hooks/useAccount';
import { MarginLimitOrder } from '../../types';
import { OpenLimitPositionsTable } from '../OpenLimitPositionsTable';

interface ILimitOrderTablesProps {
  activeTab: number;
}

export function LimitOrderTables({ activeTab }: ILimitOrderTablesProps) {
  const account = useAccount();
  const { value, loading } = useGetLimitOrders<MarginLimitOrder>(account, true);
  const limitOrders = useMemo(() => value.filter(order => !order.canceled), [
    value,
  ]);

  return (
    <>
      <div className={cn({ 'tw-hidden': activeTab !== 2 })}>
        <OpenLimitPositionsTable
          orders={limitOrders.filter(item => item.filledAmount !== '0')}
          loading={loading}
        />
      </div>
      <div className={cn({ 'tw-hidden': activeTab !== 3 })}>
        <LimitOrderHistory
          orders={limitOrders.filter(item => item.filledAmount !== '0')}
          loading={loading}
        />
      </div>
    </>
  );
}

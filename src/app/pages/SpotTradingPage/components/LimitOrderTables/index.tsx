import React, { useMemo } from 'react';
import cn from 'classnames';

import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';
import { OpenPositionsTable } from '../OpenPositionsTable';
import { LimitOrderHistory } from '../LimitOrderHistory';
import { useAccount } from 'app/hooks/useAccount';
import { LimitOrder } from '../../types';

interface ILimitOrderTablesProps {
  activeTab: number;
}

export function LimitOrderTables({ activeTab }: ILimitOrderTablesProps) {
  const account = useAccount();

  const { value, loading } = useGetLimitOrders<LimitOrder>(account);
  const limitOrders = useMemo(() => value.filter(order => !order.canceled), [
    value,
  ]);

  return (
    <>
      <div className={cn({ 'tw-hidden': activeTab !== 1 })}>
        <OpenPositionsTable
          orders={limitOrders.filter(item => item.filledAmount === '0')}
          loading={loading}
        />
      </div>
      <div className={cn({ 'tw-hidden': activeTab !== 2 })}>
        <LimitOrderHistory
          orders={limitOrders.filter(item => item.filledAmount !== '0')}
          loading={loading}
        />
      </div>
    </>
  );
}

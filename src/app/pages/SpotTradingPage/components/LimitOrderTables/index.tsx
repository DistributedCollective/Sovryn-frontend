import React from 'react';
import cn from 'classnames';

import { useGetLimitOrders } from 'app/hooks/limitOrder/useGetLimitOrders';
import { OpenPositionsTable } from '../OpenPositionsTable';
import { LimitOrderHistory } from '../LimitOrderHistory';
import { useAccount } from 'app/hooks/useAccount';

interface ILimitOrderTablesProps {
  activeTab: number;
}

export function LimitOrderTables({ activeTab }: ILimitOrderTablesProps) {
  const account = useAccount();
  const { value: limitOrders, loading } = useGetLimitOrders(account);

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

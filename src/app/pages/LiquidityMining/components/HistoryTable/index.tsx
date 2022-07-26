import React, { useState, useCallback, useMemo } from 'react';

import { useAccount } from 'app/hooks/useAccount';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { Pagination } from 'app/components/Pagination';
import { useGetLiquidityHistoryQuery } from 'utils/graphql/rsk/generated';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { APOLLO_POLL_INTERVAL, DEFAULT_PAGE_SIZE } from 'utils/classifiers';

export const HistoryTable: React.FC = () => {
  const account = useAccount();
  const [page, setPage] = useState(1);
  const { data, loading } = useGetLiquidityHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
    pollInterval: APOLLO_POLL_INTERVAL,
  });

  const onPageChanged = useCallback(data => {
    const { currentPage } = data;
    setPage(currentPage);
  }, []);

  const items = useMemo(() => {
    if (!data || loading) return [];
    return data?.liquidityHistoryItems
      .filter(item => LiquidityPoolDictionary.get(item.liquidityPool.id))
      .map(item => ({
        key: item.transaction.id,
        amount: item.amount,
        asset: item.reserveToken.id,
        pool: item.liquidityPool.id,
        time: item.timestamp,
        txHash: item.transaction.id,
        type: item.type,
      }));
  }, [data, loading]);

  const rows = useMemo(() => {
    const startIndex = (page - 1) * DEFAULT_PAGE_SIZE;
    return items.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);
  }, [items, page]);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
        <table className="tw-w-full">
          <TableHeader />
          <TableBody items={rows} loading={loading} />
        </table>
        <Pagination
          totalRecords={items?.length || 0}
          pageLimit={DEFAULT_PAGE_SIZE}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      </div>
    </section>
  );
};

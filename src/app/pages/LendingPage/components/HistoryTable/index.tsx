import React, { useEffect, useState, useCallback } from 'react';

import { useAccount } from 'app/hooks/useAccount';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { Pagination } from 'app/components/Pagination';
import { LendingEvent } from '../../types';
import { useGetLendingHistoryData } from '../../hooks/useGetLendingHistoryData';

const PAGE_SIZE = 6;

export const HistoryTable: React.FC = () => {
  const account = useAccount();
  const [rawTxs, setRawTxs] = useState<LendingEvent[]>([]);
  const [history, setHistory] = useState<LendingEvent[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const { data, loading: dataLoading } = useGetLendingHistoryData();

  useEffect(() => {
    if (dataLoading === false && data?.user?.lendingHistory) {
      const flattenedTxs: LendingEvent[] = data.user.lendingHistory
        .map(
          val =>
            val?.lendingHistory?.map(item => ({
              amount: item.amount,
              asset: item.asset?.id || '',
              emittedBy: item.emittedBy,
              loanTokenAmount: item.loanTokenAmount,
              txHash: item.transaction?.id,
              timestamp: item.timestamp,
              type: item.type,
            })) || [],
        )
        .flat()
        .sort((a, b) => b.timestamp - a.timestamp);
      setRawTxs(flattenedTxs);
      setTotal(flattenedTxs.length);
    }
  }, [account, dataLoading, data]);

  useEffect(() => {
    if (!rawTxs) return;
    const offset = (page - 1) * PAGE_SIZE;
    setHistory(rawTxs.slice(offset, offset + PAGE_SIZE));
  }, [page, rawTxs, total]);

  const onPageChanged = useCallback(data => {
    const { currentPage } = data;
    setPage(currentPage);
  }, []);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
        <table className="tw-w-full">
          <TableHeader />
          <TableBody items={history} loading={dataLoading} />
        </table>
        {total > 0 && (
          <Pagination
            totalRecords={total}
            pageLimit={PAGE_SIZE}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
      </div>
    </section>
  );
};

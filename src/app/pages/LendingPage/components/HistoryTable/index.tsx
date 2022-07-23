import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';

import { backendUrl, currentChainId, PAGE_SIZE } from 'utils/classifiers';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { Pagination } from 'app/components/Pagination';
import { LendingEvent } from '../../types';

export const HistoryTable: React.FC = () => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState<LendingEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const blockSync = useBlockSync();

  let cancelTokenSource = useRef<CancelTokenSource>();
  const getData = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }

    cancelTokenSource.current = axios.CancelToken.source();
    axios
      .get(`${url}/events/lend/${account}?page=${page}&pageSize=${PAGE_SIZE}`, {
        cancelToken: cancelTokenSource.current.token,
      })
      .then(res => {
        const { events, pagination } = res.data;
        setHistory(events || []);
        setTotal(pagination.totalPages * PAGE_SIZE);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setHistory([]);
        setLoading(false);
      });
  }, [url, account, page]);

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);

    getData();
  }, [getData]);

  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [getHistory, account, blockSync]);

  const onPageChanged = useCallback(data => {
    const { currentPage } = data;
    setPage(currentPage);
  }, []);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
        <table className="tw-w-full">
          <TableHeader />
          <TableBody items={history} loading={loading} />
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

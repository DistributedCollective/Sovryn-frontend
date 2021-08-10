import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { backendUrl, currentChainId } from 'utils/classifiers';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { Pagination } from 'app/components/Pagination';

const pageSize = 6;

export const HistoryTable: React.FC = () => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const blockSync = useBlockSync();

  let cancelTokenSource;
  const getData = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();
    axios
      .get(`${url}/events/lend/${account}?page=${page}&pageSize=${pageSize}`, {
        cancelToken: cancelTokenSource.token,
      })
      .then(res => {
        const { events, pagination } = res.data;
        setHistory(events || []);
        setTotal(pagination.totalPages * pageSize);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setHistory([]);
        setLoading(false);
      });
  };

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setHistory, url, page]);

  useEffect(() => {
    if (account) {
      getHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, page, blockSync]);

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
            pageLimit={pageSize}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
      </div>
    </section>
  );
};

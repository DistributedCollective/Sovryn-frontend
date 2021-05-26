import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { backendUrl, currentChainId } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
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
  const [total] = useState(10);

  let cancelTokenSource;
  const getData = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();
    axios
      .get(
        `http://13.59.52.224:3010/liquidity-history/${account}?page=${page}&pageSize=${pageSize}`,
        {
          cancelToken: cancelTokenSource.token,
        },
      )
      .then(res => {
        setHistory(res.data);
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
  }, [account, page]);

  const onPageChanged = data => {
    const { currentPage } = data;
    setPage(currentPage);
  };

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
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

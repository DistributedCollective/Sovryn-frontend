import axios, { CancelTokenSource } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Pagination } from 'app/components/Pagination';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { backendUrl, currentChainId } from 'utils/classifiers';

import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';

const pageSize = 6;
interface RewardProps {
  rewardType: number;
}
export const HistoryTable: React.FC<RewardProps> = ({ rewardType }) => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const blockSync = useBlockSync();
  const cancelTokenSource = useRef<CancelTokenSource>();

  const getData = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    cancelTokenSource.current = axios.CancelToken.source();
    axios
      .get(
        `${url}/v1/event-history/rewardsNew/${account}?page=${page}&pageSize=${pageSize}`,
        // {
        //   cancelToken: cancelTokenSource.current.token,
        // },
      )
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
  }, [url, account, page]);

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);

    getData();
  }, [setHistory, getData]);

  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory, blockSync]);

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

import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';

import { Pagination } from 'app/components/Pagination';
import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import {
  backendUrl,
  currentChainId,
  DEFAULT_PAGE_SIZE,
} from 'utils/classifiers';

import { RewardEvent, TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { RewardTabType } from '../../types';

const getHistoryEndpoint = (activeTab: RewardTabType) => {
  switch (activeTab) {
    case RewardTabType.REWARD_SOV:
      return 'rewardsNew';
    case RewardTabType.LIQUID_SOV:
      return 'liquidSov';
    case RewardTabType.FEES_EARNED:
      return 'feesEarned';
    default:
      return 'rewardsNew';
  }
};

interface IHistoryTableProps {
  activeTab: RewardTabType;
}

export const HistoryTable: React.FC<IHistoryTableProps> = ({ activeTab }) => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState<RewardEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const blockSync = useBlockSync();

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);

    const historyEndpoint = getHistoryEndpoint(activeTab);

    axios
      .get(
        `${url}/v1/event-history/${historyEndpoint}/${account}?page=${page}&pageSize=${DEFAULT_PAGE_SIZE}`,
      )
      .then(res => {
        const { events, pagination } = res.data;
        setHistory(events || []);
        setTotal(pagination.totalPages * DEFAULT_PAGE_SIZE);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, [activeTab, url, account, page]);

  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory, blockSync]);

  const onPageChanged = useCallback(data => setPage(data.currentPage), []);

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
            pageLimit={DEFAULT_PAGE_SIZE}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
      </div>
    </section>
  );
};

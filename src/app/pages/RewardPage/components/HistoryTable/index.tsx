import React, { useCallback, useMemo, useState } from 'react';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { useGetUserRewardsEarnedHistory } from '../../hooks/useGetUserRewardsEarnedHistory';
import { RewardPagination } from '../RewardPaginaton';

const PAGE_SIZE = 5;

export const HistoryTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data, loading } = useGetUserRewardsEarnedHistory(page, PAGE_SIZE);
  const isHiddenPagination = useMemo(
    () =>
      data &&
      data.rewardsEarnedHistoryItems.length < PAGE_SIZE &&
      page === 1 &&
      !loading,
    [data, page, loading],
  );

  const isDisabled = useMemo(
    () => !data || (data && data.rewardsEarnedHistoryItems.length < PAGE_SIZE),
    [data],
  );

  const onPageChanged = useCallback(page => setPage(page), [setPage]);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
        <table className="tw-w-full">
          <TableHeader />
          <TableBody
            items={data?.rewardsEarnedHistoryItems}
            loading={loading}
          />
        </table>
        {!isHiddenPagination && (
          <RewardPagination
            page={page}
            loading={loading}
            onChange={onPageChanged}
            isDisabled={isDisabled}
          />
        )}
      </div>
    </section>
  );
};

import React, { useCallback, useMemo, useState } from 'react';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';
import { useGetUserRewardsEarnedHistory } from '../../hooks/useGetUserRewardsEarnedHistory';
import { RewardPagination } from '../RewardPagination';
import { DEFAULT_PAGE_SIZE } from 'utils/classifiers';
import { RewardTabType } from '../../types';
import { RewardsEarnedAction } from 'utils/graphql/rsk/generated';

interface IHistoryTableProps {
  activeTab: RewardTabType;
}

export const HistoryTable: React.FC<IHistoryTableProps> = ({ activeTab }) => {
  const [page, setPage] = useState(1);

  const getActiveTabType = useCallback(item => {
    switch (item) {
      case RewardTabType.FEES_EARNED:
        return RewardsEarnedAction.UserFeeWithdrawn;
      case RewardTabType.LIQUID_SOV:
        return RewardsEarnedAction.StakingRewardWithdrawn;
      case RewardTabType.REWARD_SOV:
        return RewardsEarnedAction.EarnReward;
      default:
        return RewardsEarnedAction.EarnReward;
    }
  }, []);

  const { data, loading } = useGetUserRewardsEarnedHistory(
    page,
    getActiveTabType(activeTab),
    DEFAULT_PAGE_SIZE,
  );

  const isHiddenPagination = useMemo(
    () =>
      data &&
      data.rewardsEarnedHistoryItems.length < DEFAULT_PAGE_SIZE &&
      page === 1 &&
      !loading,
    [data, page, loading],
  );

  const isDisabled = useMemo(
    () =>
      !data ||
      (data && data.rewardsEarnedHistoryItems.length < DEFAULT_PAGE_SIZE),
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

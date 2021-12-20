import React from 'react';

import { LeaderboardData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import styles from './index.module.scss';
import { weiToNumberFormat } from 'utils/display-text/format';

interface ITraderRowProps {
  data: LeaderboardData;
}

export const UserTraderRow: React.FC<ITraderRowProps> = ({ data }) => {
  return (
    <div
      className={`${styles.userTraderRow} tw-flex tw-flex-row tw-py-3 tw-mb-2 tw-mr-4 tw-rounded tw-border`}
    >
      <div className="tw-pl-3 tw-pr-1 tw-w-1/12 tw-my-auto">{data.rank}</div>
      <div className="tw-px-1 tw-w-3/12 tw-my-auto">
        <div
          className={`${styles.userPosition} tw-inline-block tw-rounded tw-border tw-px-2 tw-py-1`}
        >
          Your position
        </div>
      </div>
      <div
        className={`${styles.openedPositions} tw-px-1 tw-w-2/12 tw-my-auto tw-text-center`}
      >
        {data.openedPositions}
      </div>
      <div className="tw-px-1 tw-w-4/12 tw-my-auto">{data.lastTrade}</div>
      <div className={`${styles.totalPnL} tw-px-1 tw-w-2/12 tw-my-auto`}>
        {weiToNumberFormat(data.totalPnL, 4)}%
      </div>
    </div>
  );
};

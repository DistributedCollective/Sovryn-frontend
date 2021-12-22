import React from 'react';

import { LeaderboardData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { prettyTx } from 'utils/helpers';
import styles from './index.module.scss';
import { TradeDetails } from './TradeDetails';
import { toNumberFormat } from 'utils/display-text/format';

interface ITraderRowProps {
  data: LeaderboardData;
}

export const TraderRow: React.FC<ITraderRowProps> = ({ data }) => {
  return (
    <div
      className={`${styles.traderRow} tw-flex tw-flex-row tw-py-3 tw-mb-2 tw-mr-4 tw-rounded`}
    >
      <div className="tw-pl-3 tw-pr-1 tw-w-1/12 tw-my-auto">{data.rank}</div>
      <div className="tw-pl-2 tw-pr-1 tw-w-3/12 tw-my-auto">
        {data.userName || prettyTx(data.walletAddress)}
      </div>
      <div
        className={`${styles.openedPositions} tw-px-1 tw-w-2/12 tw-my-auto tw-text-center`}
      >
        {data.openedPositions}
      </div>
      <div className="tw-px-1 tw-w-4/12 tw-my-auto">
        <TradeDetails value={data.lastTrade} pair="BTC/USD" />
      </div>
      <div className={`${styles.totalPnL} tw-px-1 tw-w-2/12 tw-my-auto`}>
        {toNumberFormat(data.totalPnL, 2)}%
      </div>
    </div>
  );
};

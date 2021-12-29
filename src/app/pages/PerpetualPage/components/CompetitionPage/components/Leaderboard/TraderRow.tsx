import React, { forwardRef } from 'react';

import { LeaderboardData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { prettyTx } from 'utils/helpers';
import { toNumberFormat } from 'utils/display-text/format';
import classNames from 'classnames';

interface ITraderRowProps {
  data: LeaderboardData;
  isUser: boolean;
}

export const TraderRow = forwardRef<HTMLDivElement, ITraderRowProps>(
  ({ data, isUser }, ref) => {
    return (
      <div
        ref={ref}
        className={classNames(
          isUser
            ? 'tw-bg-gray-5 tw-border-opacity-25 tw-border-white'
            : 'tw-bg-gray-3 tw-border-transparent',
          data.openedPositions === 0 && 'tw-opacity-50',
          'tw-flex tw-flex-row tw-py-3 tw-mb-2 tw-mr-4 tw-rounded tw-border',
        )}
      >
        <div className="tw-pl-3 tw-pr-1 tw-w-1/12 tw-my-auto">{data.rank}</div>
        <div className="tw-pl-2 tw-pr-1 tw-w-3/12 tw-my-auto">
          {isUser ? (
            <div className="tw-inline-block tw-rounded tw-border tw-px-2 tw-py-1 tw-bg-gray-1 tw-border tw-border-opacity-25 tw-border-white">
              Your position
            </div>
          ) : (
            data.userName || prettyTx(data.walletAddress)
          )}
        </div>
        <div
          className={classNames(
            data.openedPositions > 0 ? 'tw-text-success' : 'tw-text-warning',
            'tw-px-1 tw-w-2/12 tw-my-auto tw-text-center',
          )}
        >
          {data.openedPositions}
        </div>
        <div className="tw-px-1 tw-w-4/12 tw-my-auto">
          {!data.lastTrade ? (
            '-'
          ) : (
            <>
              BTC/USD:
              <span className={classNames('tw-ml-2', getColor(data.lastTrade))}>
                {toNumberFormat(data.lastTrade, 2)}%
              </span>
            </>
          )}
        </div>
        <div
          className={classNames(
            'tw-px-1 tw-w-2/12 tw-my-auto',
            getColor(data.totalPnL),
          )}
        >
          {toNumberFormat(data.totalPnL, 2)}%
        </div>
      </div>
    );
  },
);

const getColor = (value: number) => {
  if (value > 0) {
    return 'tw-text-trade-long';
  } else if (value < 0) {
    return 'tw-text-trade-short';
  }
  return 'tw-sov-white';
};

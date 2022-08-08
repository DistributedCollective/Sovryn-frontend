import React, { useMemo, forwardRef } from 'react';

import { LeaderboardData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { toNumberFormat } from 'utils/display-text/format';
import classNames from 'classnames';
import { Row } from '../../Row';
import { getProfitClassName } from '../../../utils';

interface ITraderRowProps {
  data: LeaderboardData;
  isUser: boolean;
  //potentialPrize: number;
}

export const TraderRow = forwardRef<HTMLDivElement, ITraderRowProps>(
  ({ data, isUser }, ref) => {
    const rowData = useMemo(
      () => ({
        rank: data.rank,
        walletAddress: data.walletAddress,
        userName: data.userName,
      }),
      [data.rank, data.userName, data.walletAddress],
    );

    const isActiveUser = useMemo(() => data.openedPositions > 0, [
      data.openedPositions,
    ]);

    return (
      <Row isActiveUser={isActiveUser} isUser={isUser} data={rowData} ref={ref}>
        <div
          className={classNames(
            isActiveUser ? 'tw-text-success' : 'tw-text-warning',
            'tw-px-1 tw-w-2/12 tw-my-auto tw-text-center',
          )}
        >
          {data.openedPositions}
        </div>
        <div className="tw-px-1 tw-w-3/12 tw-my-auto">
          {!data.lastTrade ? (
            '-'
          ) : (
            <>
              BTC/USD:
              <span
                className={classNames(
                  'tw-ml-2',
                  getProfitClassName(data.lastTrade),
                )}
              >
                {toNumberFormat(data.lastTrade, 2)}%
              </span>
            </>
          )}
        </div>
        <div
          className={classNames(
            'tw-px-1 tw-w-2/12 tw-my-auto',
            getProfitClassName(data.totalPnL),
          )}
        >
          {toNumberFormat(data.totalPnL, 2)}%
        </div>
        {/* <div className="tw-px-1 tw-w-2/12 tw-my-auto">
          {potentialPrize === 0 ? (
            '-'
          ) : (
            <AssetValue
              value={potentialPrize}
              mode={AssetValueMode.auto}
              minDecimals={4}
              maxDecimals={4}
              asset={Asset.BTCS}
            />
          )}
        </div> */}
      </Row>
    );
  },
);

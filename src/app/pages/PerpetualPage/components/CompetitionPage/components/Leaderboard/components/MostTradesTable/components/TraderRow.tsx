import React, { useMemo, forwardRef } from 'react';

import { MostTradesData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import classNames from 'classnames';
import { Row } from '../../Row';
import { getProfitClassName } from '../../../utils';

interface ITraderRowProps {
  data: MostTradesData;
  isUser: boolean;
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

    const isActiveUser = useMemo(() => data.trades > 0, [data.trades]);

    return (
      <Row
        isActiveUser={isActiveUser}
        isUser={isUser}
        ref={ref}
        data={rowData}
        rankWidth="3"
        walletWidth="7"
      >
        <>
          <div
            className={classNames(
              'tw-px-1 tw-w-2/12 tw-my-auto',
              getProfitClassName(data.trades),
            )}
          >
            {data.trades}
          </div>
        </>
      </Row>
    );
  },
);

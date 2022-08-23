import React, { useMemo, forwardRef } from 'react';

import { HighestProfitData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import classNames from 'classnames';
import { Row } from '../../Row';
import { getProfitClassName } from '../../../utils';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

interface ITraderRowProps {
  data: HighestProfitData;
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

    const isActiveUser = useMemo(() => data.profit !== 0, [data.profit]);

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
              getProfitClassName(data.profit),
            )}
          >
            <AssetValue
              value={data.profit}
              maxDecimals={6}
              mode={AssetValueMode.auto}
            />
          </div>
        </>
      </Row>
    );
  },
);

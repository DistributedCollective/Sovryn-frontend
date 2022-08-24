import React, { useMemo, forwardRef } from 'react';

import { HighestVolumeData } from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import classNames from 'classnames';
import { Row } from '../../Row';
import { getProfitClassName } from '../../../utils';
import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';

interface ITraderRowProps {
  data: HighestVolumeData;
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

    const isActiveUser = useMemo(() => data.volume > 0, [data.volume]);

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
              getProfitClassName(data.volume),
            )}
          >
            <AssetValue
              value={data.volume}
              maxDecimals={3}
              mode={AssetValueMode.auto}
            />
          </div>
        </>
      </Row>
    );
  },
);

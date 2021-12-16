import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';

import { TraderRow } from './TraderRow';
import { UserTraderRow } from './UserTraderRow';
import { useIntersection } from 'app/hooks/useIntersection';
import {
  LeaderboardData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useAccount } from 'app/hooks/useAccount';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import styles from './index.module.scss';

interface ILeaderboardProps {
  data: RegisteredTraderData[];
  showUserRow: boolean;
}

export const Leaderboard: React.FC<ILeaderboardProps> = ({
  data,
  showUserRow,
}) => {
  const userRowRef = useRef(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const [items, setItems] = useState<LeaderboardData[]>([]);
  const [userData, setUserData] = useState<LeaderboardData | null>(null);

  const { data: leaderboardData } = useGetLeaderboardData(
    data.map(val => val.walletAddress),
  );

  useEffect(() => {
    if (!data?.length) return;
    console.log(leaderboardData);
    //TODO: update logic here to following:
    // loop over all registered wallets by walletAddress
    // if leaderboardData contains trades for the walletAddress, then create traderrow component with data
    //   if walletAddress == user address then create UserTraderRow instead
    // if trader has no trades in leaderboardData, create TraderRow component with blank data (rank="-", num positions=0, tradeDetails="-", totalPnL=0) and add at bottom of list
    //   if walletAddress in leaderboardData, create UserTraderRow
    // sort rows into ranked order based on total PnL
    // retrieve user row if present and set that as separate state var

    //TODO: replace this with real parsed data, sort by PnL as described above
    const rows: LeaderboardData[] = data.map(val => ({
      rank: '-',
      userName: val.userName,
      walletAddress: val.walletAddress,
      openedPositions: 0,
      lastTrade: 'Sometime',
      totalPnL: 10,
    }));

    setItems(rows);
    if (account) {
      const userRow = rows.filter(
        val => val.walletAddress === account.toLowerCase(),
      )[0];
      if (userRow) {
        setUserData(userRow);
      }
    }
  }, [account, data, leaderboardData]);

  return (
    <>
      <div className="leaderboard-table">
        <div className="tw-flex tw-flex-row tw-items-end tw-text-sm tw-tracking-tighter tw-mb-3 tw-mr-8">
          <div className="tw-px-1 tw-w-1/12">Rank</div>
          <div className="tw-px-1 tw-w-3/12">Name / Wallet Address</div>
          <div className="tw-px-1 tw-w-2/12">Opened positions</div>
          <div className="tw-px-1 tw-w-4/12">Trade Details</div>
          <div className="tw-px-1 tw-w-2/12">Total P/L</div>
        </div>
        <div
          className={`${styles.leaderboardContainer} tw-overflow-y-auto tw-text-sm tw-align-middle`}
        >
          {items.map(val =>
            val.walletAddress === account?.toLowerCase() ? (
              <div ref={userRowRef} key={val.walletAddress}>
                <UserTraderRow data={val} />
              </div>
            ) : (
              <TraderRow data={val} key={val.walletAddress} />
            ),
          )}
        </div>
        <div
          className={classNames('tw-my-2 tw-h-16', {
            'tw-hidden': !showUserRow || !userData,
          })}
        >
          <div className={classNames({ 'tw-hidden': userRowVisible })}>
            <div className="tw-mb-2 tw-ml-4">...</div>
            <div className="tw-mr-4 tw-text-sm tw-align-middle">
              {userData && <UserTraderRow data={userData} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

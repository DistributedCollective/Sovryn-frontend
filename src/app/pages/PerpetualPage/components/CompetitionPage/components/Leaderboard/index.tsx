import React, { useEffect, useState, useRef, useContext, useMemo } from 'react';
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
import { getTraderPnLInBC } from 'app/pages/PerpetualPage/utils/perpUtils';
import { bignumber } from 'mathjs';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from 'utils/blockchain/contract-helpers';
import { Chain } from 'types/chain';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { parseTraderState } from 'app/pages/PerpetualPage/hooks/usePerpetual_queryTraderState';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { ABK64x64ToFloat } from 'app/pages/PerpetualPage/utils/perpMath';
import { BigNumber } from 'ethers/lib/ethers';
import { percentageChange } from 'utils/helpers';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

interface ILeaderboardProps {
  data: RegisteredTraderData[];
  showUserRow: boolean;
}

export const Leaderboard: React.FC<ILeaderboardProps> = ({
  data,
  showUserRow,
}) => {
  const { t } = useTranslation();
  const userRowRef = useRef(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const [items, setItems] = useState<LeaderboardData[]>([]);
  const [userData, setUserData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const { perpetualParameters, ammState } = useContext(PerpetualQueriesContext);

  const { data: leaderboardData } = useGetLeaderboardData(
    data.map(val => val.walletAddress),
  );

  useEffect(() => {
    if (!data?.length) return;
    if (!perpetualParameters || !perpetualParameters.poolId) return;
    if (!ammState) return;
    if (leaderboardData === undefined) return;

    const perpetualId = PerpetualPairDictionary.get(PerpetualPairType.BTCUSD)
      .id;
    const contract = getContract('perpetualManager');

    const run = async () => {
      const items: LeaderboardData[] = [];

      for (const item of data) {
        const trader = leaderboardData?.traders.find(
          row => row.id.toLowerCase() === item.walletAddress.toLowerCase(),
        );

        let totalPnL = '0';
        let tradeDetails = '';
        if (trader && trader?.positionsTotalCount) {
          const realizedProfit =
            ABK64x64ToFloat(BigNumber.from(trader.totalPnLCC || '0')) +
            ABK64x64ToFloat(
              BigNumber.from(trader.totalFundingPaymentCC || '0'),
            );

          let unrealizedProfit = 0;

          if (trader.positions.find(item => !item.isClosed)) {
            const traderState = await bridgeNetwork
              .call(
                Chain.BSC,
                contract.address,
                contract.abi,
                'getTraderState',
                [perpetualId, item.walletAddress.toLowerCase()],
              )
              .then(parseTraderState);

            unrealizedProfit = getTraderPnLInBC(
              traderState,
              ammState,
              perpetualParameters,
            );
          }

          const startingBalance = trader.positions.reduce(
            (previous, current) =>
              previous +
              ABK64x64ToFloat(
                BigNumber.from(current.currentPositionSizeBC || '0'),
              ),
            0,
          );

          totalPnL = percentageChange(
            startingBalance,
            bignumber(startingBalance)
              .add(realizedProfit)
              .add(unrealizedProfit),
          );

          const lastPositionStartingBalance = ABK64x64ToFloat(
            BigNumber.from(trader.positions[0].currentPositionSizeBC || '0'),
          );
          const lastPositionProfit = ABK64x64ToFloat(
            BigNumber.from(trader.positions[0].totalPnLCC || '0'),
          );

          tradeDetails = Number(
            percentageChange(
              lastPositionStartingBalance,
              lastPositionStartingBalance +
                lastPositionProfit +
                unrealizedProfit,
            ),
          ).toFixed(2);
        }

        items.push({
          rank: '-',
          userName: item.userName,
          walletAddress: item.walletAddress,
          openedPositions: trader?.positionsTotalCount || 0,
          lastTrade: tradeDetails,
          totalPnL,
        });
      }

      return items
        .sort((a, b) => bignumber(b.totalPnL).minus(a.totalPnL).toNumber())
        .map((val, index) => ({
          ...val,
          rank: (index + 1).toString(),
        }));
    };

    setLoading(true);
    run()
      .then(rows => {
        setItems(rows);
        setLoading(false);
        setLoaded(true);
        if (account) {
          const userRow = rows.find(
            val => val.walletAddress.toLowerCase() === account.toLowerCase(),
          );
          if (userRow) {
            setUserData(userRow);
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [account, data, leaderboardData, ammState, perpetualParameters]);

  const showSpinner = useMemo(() => (!loaded ? loading : false), [
    loading,
    loaded,
  ]);

  return (
    <>
      <div className="leaderboard-table">
        <div className="tw-flex tw-flex-row tw-items-end tw-text-xs tw-tracking-tighter tw-mb-3 tw-mr-8">
          <div className="tw-px-1 tw-w-1/12">
            {t(translations.competitionPage.table.rank)}
          </div>
          <div className="tw-px-1 tw-w-3/12">
            {t(translations.competitionPage.table.name)}
          </div>
          <div className="tw-px-1 tw-w-2/12">
            {t(translations.competitionPage.table.positions)}
          </div>
          <div className="tw-px-1 tw-w-4/12">
            {t(translations.competitionPage.table.trade)}
          </div>
          <div className="tw-px-1 tw-w-2/12">
            {t(translations.competitionPage.table.total)}
          </div>
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
          {showSpinner && <SkeletonRow />}
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

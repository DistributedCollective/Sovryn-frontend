import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback,
} from 'react';
import classNames from 'classnames';

import { TraderRow } from './TraderRow';
import { useIntersection } from 'app/hooks/useIntersection';
import {
  LeaderboardData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useAccount } from 'app/hooks/useAccount';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import styles from './index.module.scss';
import { getTraderPnLInBC } from 'app/pages/PerpetualPage/utils/perpUtils';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { BigNumber } from 'ethers/lib/ethers';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import debounce from 'lodash.debounce';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { getBase2CollateralFX } from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { Nullable } from 'types';

const initialFunding = 0.2; // funds sent to every trader at the beginning of the competition

interface ILeaderboardProps {
  data: RegisteredTraderData[];
  showUserRow: boolean;
  pair: PerpetualPair;
}

export const Leaderboard: React.FC<ILeaderboardProps> = ({
  data,
  showUserRow,
  pair,
}) => {
  const { t } = useTranslation();
  const userRowRef = useRef<HTMLDivElement>(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();
  const [items, setItems] = useState<LeaderboardData[]>([]);
  const [userData, setUserData] = useState<Nullable<LeaderboardData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { ammState, perpetualParameters } = perpetuals[pair.id];

  const { data: leaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
  );

  // throttle function prevents the exhaustive deps check
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateItems = useCallback(
    debounce(() => {
      if (
        !data ||
        !perpetualParameters?.poolId ||
        !ammState ||
        leaderboardData === undefined
      ) {
        return;
      }

      const run = async () => {
        const items: LeaderboardData[] = [];

        const baseToCollateral = getBase2CollateralFX(ammState, false);

        for (const item of data) {
          const trader = leaderboardData?.traders.find(
            row => row.id.toLowerCase() === item.walletAddress.toLowerCase(),
          );

          const entry: LeaderboardData = {
            rank: '-',
            userName: item.userName,
            walletAddress: item.walletAddress,
            openedPositions: trader?.positionsTotalCount || 0,
            lastTrade: 0,
            totalPnL: 0,
            totalPnLCC: 0,
            totalFundingPaymentCC: 0,
          };

          if (trader?.positionsTotalCount) {
            entry.totalFundingPaymentCC = ABK64x64ToFloat(
              BigNumber.from(trader.totalFundingPaymentCC || '0'),
            );
            entry.totalPnLCC = ABK64x64ToFloat(
              BigNumber.from(trader.totalPnLCC || '0'),
            );

            entry.realizedProfitCC =
              entry.totalPnLCC! - entry.totalFundingPaymentCC!;

            entry.unrealizedPnLCC = 0;

            if (
              trader.positions.find(item => !item.isClosed) &&
              trader.traderState
            ) {
              const parsedTraderState = {
                marginBalanceCC: ABK64x64ToFloat(
                  BigNumber.from(trader.traderState.marginBalanceCC),
                ),
                availableMarginCC: ABK64x64ToFloat(
                  BigNumber.from(trader.traderState.availableMarginCC),
                ),
                availableCashCC: ABK64x64ToFloat(
                  BigNumber.from(trader.traderState.availableCashCC),
                ),
                marginAccountCashCC: ABK64x64ToFloat(
                  BigNumber.from(trader.traderState.marginAccountCashCC),
                ),
                marginAccountPositionBC: ABK64x64ToFloat(
                  BigNumber.from(trader.traderState.marginAccountPositionBC),
                ),
                marginAccountLockedInValueQC: ABK64x64ToFloat(
                  BigNumber.from(
                    trader.traderState.marginAccountLockedInValueQC,
                  ),
                ),
                fUnitAccumulatedFundingStart: ABK64x64ToFloat(
                  BigNumber.from(
                    trader.traderState.fUnitAccumulatedFundingStart,
                  ),
                ),
              };

              entry.unrealizedPnLCC =
                getTraderPnLInBC(
                  parsedTraderState,
                  ammState,
                  perpetualParameters,
                ) * baseToCollateral;
            }

            const totalProfitWithFunding =
              entry.realizedProfitCC + entry.unrealizedPnLCC;

            entry.totalPnL = (totalProfitWithFunding / initialFunding) * 100;

            const lastPositionProfit = ABK64x64ToFloat(
              BigNumber.from(trader.positions[0].totalPnLCC || '0'),
            );

            entry.lastTrade =
              ((lastPositionProfit + entry.unrealizedPnLCC) /
                Math.abs(initialFunding)) *
              100;
          }
          items.push(entry);
        }

        return items
          .sort((a, b) => {
            if (a.openedPositions === 0 || b.openedPositions === 0) {
              if (a.openedPositions === 0 && b.openedPositions === 0) {
                return a.walletAddress.localeCompare(b.walletAddress);
              }
              return a.openedPositions === 0 ? 1 : -1;
            }
            return Math.sign(b.totalPnL - a.totalPnL);
          })
          .map((val, index) => ({
            ...val,
            rank: (index + 1).toString(),
          }));
      };

      setLoaded(false);
      run()
        .then(rows => {
          // Log full results, to debug PnL values.
          console.log(rows);
          setItems(rows);
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
        .catch(error => {
          console.error(error);
          setLoaded(true);
        });
    }),
    [account, data, leaderboardData, ammState, perpetualParameters],
  );

  useEffect(() => updateItems(), [updateItems]);

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
          className={classNames(
            'tw-scrollbars-thin tw-overflow-y-auto tw-text-sm tw-align-middle',
            styles.leaderboardContainer,
          )}
        >
          {items.map(val => {
            const isUser = val.walletAddress === account?.toLowerCase();
            return (
              <TraderRow
                ref={isUser ? userRowRef : null}
                data={val}
                key={val.walletAddress}
                isUser={isUser}
              />
            );
          })}
          {(!data || (!loaded && !items?.length)) && <SkeletonRow />}
          {loaded && items && items.length === 0 && (
            <div className="tw-flex tw-flex-row tw-justify-center tw-py-5 tw-mb-2 tw-mr-4 tw-font-thin tw-bg-gray-3 tw-rounded tw-border tw-border-transparent">
              {t(translations.competitionPage.table.empty)}
            </div>
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
              {userData && <TraderRow data={userData} isUser />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

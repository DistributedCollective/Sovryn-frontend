import { useAccount } from 'app/hooks/useAccount';
import {
  LeaderboardData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { PerpetualQueriesContext } from 'app/pages/PerpetualPage/contexts/PerpetualQueriesContext';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import { getTraderPnLInBC } from 'app/pages/PerpetualPage/utils/perpUtils';
import { BigNumber } from 'ethers';
import debounce from 'lodash.debounce';
import { useContext, useCallback, useEffect, useState } from 'react';
import { Nullable } from 'types';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import {
  getBase2CollateralFX,
  getMarginBalanceAtClosing,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { TableData } from '../../../types';

export const useGetData = (
  pair: PerpetualPair,
  data: RegisteredTraderData[],
): TableData<LeaderboardData> => {
  const account = useAccount();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { ammState, perpetualParameters } = perpetuals[pair.id];

  const { data: leaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
  );

  const [items, setItems] = useState<LeaderboardData[]>([]);
  const [userData, setUserData] = useState<Nullable<LeaderboardData>>(null);
  const [loaded, setLoaded] = useState(false);

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
          const trader = leaderboardData?.traders?.find(
            row => row.id.toLowerCase() === item.walletAddress.toLowerCase(),
          );

          const traderState = trader?.traderStates[0];

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
              BigNumber.from(traderState.totalPnLCC || '0'),
            );

            entry.realizedProfitCC =
              entry.totalPnLCC! - entry.totalFundingPaymentCC!;

            entry.unrealizedPnLCC = 0;

            const balance = ABK64x64ToFloat(
              BigNumber.from(traderState.balance || '0'),
            );
            const capitalUsed = ABK64x64ToFloat(
              BigNumber.from(traderState.capitalUsed || '0'),
            );

            if (trader.positions && traderState) {
              const parsedTraderState = {
                marginBalanceCC: ABK64x64ToFloat(
                  BigNumber.from(traderState.marginBalanceCC),
                ),
                availableMarginCC: ABK64x64ToFloat(
                  BigNumber.from(traderState.availableMarginCC),
                ),
                availableCashCC: ABK64x64ToFloat(
                  BigNumber.from(traderState.availableCashCC),
                ),
                marginAccountCashCC: ABK64x64ToFloat(
                  BigNumber.from(traderState.marginAccountCashCC),
                ),
                marginAccountPositionBC: ABK64x64ToFloat(
                  BigNumber.from(traderState.marginAccountPositionBC),
                ),
                marginAccountLockedInValueQC: ABK64x64ToFloat(
                  BigNumber.from(traderState.marginAccountLockedInValueQC),
                ),
                fUnitAccumulatedFundingStart: ABK64x64ToFloat(
                  BigNumber.from(traderState.fUnitAccumulatedFundingStart),
                ),
              };

              entry.unrealizedPnLCC =
                getTraderPnLInBC(
                  parsedTraderState,
                  ammState,
                  perpetualParameters,
                ) * baseToCollateral;

              const marginBalanceAtClosing = getMarginBalanceAtClosing(
                parsedTraderState,
                ammState,
                perpetualParameters,
              );

              entry.totalPnL =
                ((balance + marginBalanceAtClosing) / capitalUsed) * 100;

              entry.lastTrade =
                ((marginBalanceAtClosing -
                  parsedTraderState.marginAccountCashCC) /
                  Math.abs(capitalUsed)) *
                100;
            }
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
          // Log full results, to debug PnL values. Uncomment it only for debugging reasons.
          //console.log(rows);
          setItems(rows);

          if (account) {
            const userRow = rows.find(
              val => val.walletAddress.toLowerCase() === account?.toLowerCase(),
            );
            if (userRow) {
              setUserData(userRow);
            }
          }
        })
        .catch(console.error)
        .finally(() => setLoaded(true));
    }),
    [account, data, leaderboardData, ammState, perpetualParameters],
  );

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

import { useAccount } from 'app/hooks/useAccount';
import {
  MostTradesData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from 'types';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { TableData } from '../../../types';
import { mostTrades, RANKING_START_TIMESTAMP } from '../../../utils';

export const useGetData = (
  data: RegisteredTraderData[],
): TableData<MostTradesData> => {
  const account = useAccount();

  const [items, setItems] = useState<MostTradesData[]>([]);
  const [userData, setUserData] = useState<Nullable<MostTradesData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: leaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    RANKING_START_TIMESTAMP,
  );

  const tradesData = useMemo(() => mostTrades(leaderboardData?.traders || []), [
    leaderboardData?.traders,
  ]);

  const updateItems = useCallback(() => {
    if (!leaderboardData || !tradesData) {
      return;
    }

    const run = async () => {
      const result: MostTradesData[] = data.map(item => {
        const trader = tradesData.find(
          trader => trader.trader === item.walletAddress,
        );

        return {
          rank: trader?.rank || '-',
          userName: item.userName,
          walletAddress: item.walletAddress,
          trades: trader?.trades || 0,
        };
      });

      return result
        .sort((a, b) => {
          if (a.trades === 0 || b.trades === 0) {
            if (a.trades === 0 && b.trades === 0) {
              return a.walletAddress.localeCompare(b.walletAddress);
            }
            return a.trades === 0 ? 1 : -1;
          }
          return Math.sign(b.trades - a.trades);
        })
        .map((value, index) => ({
          ...value,
          rank: (index + 1).toString(),
        }));
    };

    setLoaded(false);
    run()
      .then(rows => {
        setItems(rows);
        setLoaded(true);

        if (account) {
          const userRow = rows.find(
            row => row.walletAddress.toLowerCase() === account.toLowerCase(),
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
  }, [account, data, leaderboardData, tradesData]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

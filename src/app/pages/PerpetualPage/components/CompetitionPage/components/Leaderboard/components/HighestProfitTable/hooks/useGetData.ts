import { useAccount } from 'app/hooks/useAccount';
import {
  HighestProfitData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from 'types';
import { useGetTimeRestrictedData } from '../../../hooks/useGetTimeRestrictedData';
import { TableData } from '../../../types';
import { getBestPnl } from '../../../utils';

export const useGetData = (
  data: RegisteredTraderData[],
): TableData<HighestProfitData> => {
  const account = useAccount();

  const [items, setItems] = useState<HighestProfitData[]>([]);
  const [userData, setUserData] = useState<Nullable<HighestProfitData>>(null);
  const [loaded, setLoaded] = useState(false);

  const {
    historicLeaderboardData,
    currentLeaderboardData,
  } = useGetTimeRestrictedData(data);

  const profitData = useMemo(
    () =>
      getBestPnl(
        historicLeaderboardData?.traders || [],
        currentLeaderboardData?.traders || [],
      ),
    [currentLeaderboardData?.traders, historicLeaderboardData?.traders],
  );

  const updateItems = useCallback(() => {
    if (!historicLeaderboardData || !currentLeaderboardData) {
      return;
    }

    const run = async () => {
      const result: HighestProfitData[] = data.map(item => {
        const trader = profitData.find(
          trader => trader.trader === item.walletAddress,
        );

        return {
          rank: '-',
          userName: item.userName,
          walletAddress: item.walletAddress,
          profit: trader?.profit || 0,
        };
      });

      return result
        .sort((a, b) => {
          if (a.profit === 0 || b.profit === 0) {
            if (a.profit === 0 && b.profit === 0) {
              return a.walletAddress.localeCompare(b.walletAddress);
            }
            return a.profit === 0 ? 1 : -1;
          }
          return Math.sign(b.profit - a.profit);
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

        if (account) {
          const userRow = rows.find(
            row => row.walletAddress.toLowerCase() === account?.toLowerCase(),
          );
          if (userRow) {
            setUserData(userRow);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, [
    account,
    currentLeaderboardData,
    data,
    historicLeaderboardData,
    profitData,
  ]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

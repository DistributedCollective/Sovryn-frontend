import { useAccount } from 'app/hooks/useAccount';
import {
  HighestProfitData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useGetRealizedPnlData } from 'app/pages/PerpetualPage/hooks/graphql/useGetRealizedPnlData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from 'types';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { TableData } from '../../../types';
import { RANKING_START_TIMESTAMP, readBestPnL } from '../../../utils';

export const useGetData = (
  data: RegisteredTraderData[],
): TableData<HighestProfitData> => {
  const account = useAccount();

  const [items, setItems] = useState<HighestProfitData[]>([]);
  const [userData, setUserData] = useState<Nullable<HighestProfitData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: leaderboardData } = useGetRealizedPnlData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    RANKING_START_TIMESTAMP,
  );

  const profitData = useMemo(
    () => readBestPnL(leaderboardData?.realizedPnLs || []),
    [leaderboardData?.realizedPnLs],
  );

  const updateItems = useCallback(() => {
    setLoaded(false);

    const result: HighestProfitData[] = data.map(item => {
      const trader = profitData.find(
        trader => trader.trader === item.walletAddress,
      );

      return {
        rank: String(trader?.rank) || '-',
        userName: item.userName,
        walletAddress: item.walletAddress,
        profit: trader?.profit || 0,
      };
    });

    const sortedResult = result
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

    setItems(sortedResult);
    setLoaded(true);

    if (account) {
      const userRow = result.find(
        row => row.walletAddress.toLowerCase() === account.toLowerCase(),
      );
      if (userRow) {
        setUserData(userRow);
      }
    }
  }, [account, data, profitData]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

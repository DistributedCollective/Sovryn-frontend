import { useAccount } from 'app/hooks/useAccount';
import { useFetch } from 'app/hooks/useFetch';
import {
  HighestProfitData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from 'types';
import { bscScanApi } from 'utils/classifiers';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { TableData } from '../../../types';
import {
  getBestPnl,
  HIGHEST_PROFIT_START_TIMESTAMP,
  RANKING_START_TIMESTAMP,
} from '../../../utils';

const timestampConvertUrl = `${bscScanApi}/api?module=block&action=getblocknobytime&timestamp=${HIGHEST_PROFIT_START_TIMESTAMP}&closest=before`;

export const useGetData = (
  data: RegisteredTraderData[],
): TableData<HighestProfitData> => {
  const account = useAccount();

  const [items, setItems] = useState<HighestProfitData[]>([]);
  const [userData, setUserData] = useState<Nullable<HighestProfitData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { value: blockNumber, loading: blockNumberLoading } = useFetch(
    timestampConvertUrl,
  );

  const { data: historicLeaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    HIGHEST_PROFIT_START_TIMESTAMP,
    blockNumber?.result,
  );

  const { data: currentLeaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    RANKING_START_TIMESTAMP,
  );

  const profitData = useMemo(
    () =>
      getBestPnl(
        historicLeaderboardData?.traders || [],
        currentLeaderboardData?.traders || [],
      ),
    [currentLeaderboardData?.traders, historicLeaderboardData?.traders],
  );

  const updateItems = useCallback(() => {
    if (
      !historicLeaderboardData ||
      !currentLeaderboardData ||
      blockNumberLoading
    ) {
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
  }, [
    account,
    blockNumberLoading,
    currentLeaderboardData,
    data,
    historicLeaderboardData,
    profitData,
  ]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

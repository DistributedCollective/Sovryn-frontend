import { useAccount } from 'app/hooks/useAccount';
import {
  HighestVolumeData,
  RegisteredTraderData,
} from 'app/pages/PerpetualPage/components/CompetitionPage/types';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Nullable } from 'types';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { TableData } from '../../../types';
import { RANKING_START_TIMESTAMP, readTraderVolume } from '../../../utils';

export const useGetData = (
  data: RegisteredTraderData[],
): TableData<HighestVolumeData> => {
  const account = useAccount();

  const [items, setItems] = useState<HighestVolumeData[]>([]);
  const [userData, setUserData] = useState<Nullable<HighestVolumeData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: leaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    RANKING_START_TIMESTAMP,
  );

  const volumeData = useMemo(
    () => readTraderVolume(leaderboardData?.traders || []),
    [leaderboardData?.traders],
  );

  const updateItems = useCallback(() => {
    if (!leaderboardData || !volumeData) {
      return;
    }

    const run = async () => {
      const result: HighestVolumeData[] = data.map(item => {
        const trader = volumeData.find(
          trader => trader.trader === item.walletAddress,
        );

        return {
          rank: trader?.rank || '-',
          userName: item.userName,
          walletAddress: item.walletAddress,
          volume: trader?.volume || 0,
        };
      });

      return result
        .sort((a, b) => {
          if (a.volume === 0 || b.volume === 0) {
            if (a.volume === 0 && b.volume === 0) {
              return a.walletAddress.localeCompare(b.walletAddress);
            }
            return a.volume === 0 ? 1 : -1;
          }
          return Math.sign(b.volume - a.volume);
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
  }, [account, data, leaderboardData, volumeData]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

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
    // const items: HighestVolumeData[] = [];
    setLoaded(false);

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

    const sortedResult = result
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
  }, [account, data, volumeData]);

  useEffect(() => updateItems(), [updateItems]);

  return { items, userData, loaded };
};

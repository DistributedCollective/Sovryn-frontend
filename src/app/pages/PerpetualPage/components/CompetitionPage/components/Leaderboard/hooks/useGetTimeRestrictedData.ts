import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { RegisteredTraderData } from '../../../types';
import { RANKING_START_BLOCK_NUMBER } from '../utils';

type TimeRestrictedDataResult = {
  historicLeaderboardData: any;
  currentLeaderboardData: any;
};

export const useGetTimeRestrictedData = (
  data: RegisteredTraderData[],
): TimeRestrictedDataResult => {
  // IMPORTANT: Run this code every time RANKING_START_TIMESTAMP changes and update RANKING_START_BLOCK_NUMBER with the result
  // const { value: blockNumber, loading: blockNumberLoading } = useFetch(
  //   timestampConvertUrl,
  // );
  // console.log(`blockNumber: ${JSON.stringify(blockNumber)}`);

  const { data: historicLeaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    RANKING_START_BLOCK_NUMBER,
  );

  const { data: currentLeaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
  );

  return {
    historicLeaderboardData,
    currentLeaderboardData,
  };
};

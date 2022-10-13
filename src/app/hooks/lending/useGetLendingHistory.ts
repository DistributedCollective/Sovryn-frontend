import { useEffect, useState } from 'react';
import axios from 'axios';
import { subgraphWrapperUrl, currentChainId } from 'utils/classifiers';
import { LendingPool } from 'utils/models/lending-pool';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { LoanTokenGraphItem } from 'app/components/LoanTokenGraphs/types';

export function useGetLendingHistory(pool: LendingPool) {
  const [data, setData] = useState<LoanTokenGraphItem[]>([]);
  const poolAddress = getLendingContract(pool.getAsset()).address;

  useEffect(() => {
    if (currentChainId !== undefined) {
      axios
        .get(
          `${subgraphWrapperUrl[currentChainId]}/lendingApy/${poolAddress}`,
          {
            params: {
              stmp: Date.now(),
            },
          },
        )
        .then(res => setData(res.data.slice(-42))) //last 7 days of data in 4hr chunks
        .catch(() => setData([]));
    }
  }, [poolAddress]);

  return data;
}

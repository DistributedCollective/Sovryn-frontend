import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { subgraphWrapperUrl } from 'utils/classifiers';
import { LendingPool } from 'utils/models/lending-pool';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { LoanTokenGraphItem } from 'app/components/LoanTokenGraphs/types';

export function useGetLendingHistory(pool: LendingPool) {
  const [data, setData] = useState<LoanTokenGraphItem[]>([]);
  const { chainId } = useSelector(selectWalletProvider);
  const poolAddress = getLendingContract(pool.getAsset()).address;

  useEffect(() => {
    if (chainId !== undefined) {
      axios
        .get(`${subgraphWrapperUrl[chainId]}/lendingApy/${poolAddress}`)
        .then(res => {
          setData(res.data.slice(-36)); //last 6 days of data in 4hr chunks
        })
        .catch(() => setData([]));
    }
  }, [chainId, poolAddress]);

  return data;
}

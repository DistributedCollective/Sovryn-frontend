import { useMemo } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { useFetch } from '../../../hooks/useFetch';
import {
  assetByTokenAddress,
  getAmmContract,
  getTokenContract,
} from '../../../../utils/blockchain/contract-helpers';
import type { LiquidityPool } from '../../../../utils/models/liquidity-pool';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';

interface Response {
  pool: string;
  data: DataItem[];
}

interface DataItem {
  asset: string;
  totalAdded: string;
  totalRemoved: string;
  removedMinusAdded: string;
}

export function useUserPoolData(pool: LiquidityPool) {
  const address = useAccount();

  const { value, loading, error } = useFetch<Response>(
    `${backendUrl[currentChainId]}/liquidity-page/${address}/${
      getAmmContract(pool.poolAsset).address
    }`,
    {
      pool: getAmmContract(pool.poolAsset).address,
      data: pool.supplyAssets.map(item => ({
        asset: getTokenContract(item.getAsset()).address,
        totalAdded: '0',
        totalRemoved: '0',
        removedMinusAdded: '0',
      })),
    },
    !!address,
  );

  const data = useMemo(
    () => ({
      pool: pool.poolAsset,
      data: value.data.map(item => ({
        ...item,
        asset: assetByTokenAddress(item.asset),
      })),
    }),
    [value, pool],
  );

  return { value: data, loading, error };
}

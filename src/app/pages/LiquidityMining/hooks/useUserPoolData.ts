import { useMemo } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { useFetch } from '../../../hooks/useFetch';
import { getAmmContract } from '../../../../utils/blockchain/contract-helpers';
import type { LiquidityPool } from '../../../../utils/models/liquidity-pool';

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
    `/liquidity-page/${address}/${getAmmContract(pool.poolAsset)}`,
    {
      pool: getAmmContract(pool.poolAsset).address,
      data: pool.supplyAssets.map(item => ({
        asset: item.getContractAddress(),
        totalAdded: '0',
        totalRemoved: '0',
        removedMinusAdded: '0',
      })),
    },
    !!address,
  );

  const data = useMemo(() => {
    return value;
  }, [value]);

  return { value: data, loading, error };
}

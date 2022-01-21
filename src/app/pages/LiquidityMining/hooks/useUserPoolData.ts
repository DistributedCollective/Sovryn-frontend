import { useMemo } from 'react';
import { useAccount } from '../../../hooks/useAccount';
import { useFetch } from '../../../hooks/useFetch';
import {
  assetByTokenAddress,
  getTokenContract,
} from '../../../../utils/blockchain/contract-helpers';
import { backendUrl, currentChainId } from '../../../../utils/classifiers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

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

export function useUserPoolData(pool: AmmLiquidityPool) {
  const address = useAccount();

  const { value, loading, error } = useFetch<Response>(
    `${backendUrl[currentChainId]}/liquidity-page/${address}/${pool.converter}`,
    {
      pool: pool.converter,
      data: [
        {
          asset: getTokenContract(pool.assetA).address,
          totalAdded: '0',
          totalRemoved: '0',
          removedMinusAdded: '0',
        },
        ...(pool.converterVersion === 2 && pool.assetB
          ? [
              {
                asset: getTokenContract(pool.assetB).address,
                totalAdded: '0',
                totalRemoved: '0',
                removedMinusAdded: '0',
              },
            ]
          : []),
      ],
    },
    !!address,
  );

  const data = useMemo(
    () => ({
      pool: pool.converter,
      data: value.data.map(item => ({
        ...item,
        asset: assetByTokenAddress(item.asset),
      })),
    }),
    [value, pool],
  );

  return { value: data, loading, error };
}

import React, { useEffect, useState } from 'react';
import { LiquidityPoolDictionary } from 'utils/dictionaries/liquidity-pool-dictionary';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import { useAccount } from '../../../../hooks/useAccount';
import ERC20Abi from 'utils/blockchain/abi/erc20.json';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../../../../../utils/models/liquidity-pool';
import { Asset } from '../../../../../types';
import { ErrorBadge } from 'form/ErrorBadge';
import { AmmPool } from './AmmPool';

const pools = LiquidityPoolDictionary.list();

interface StateInterface {
  pool: Asset;
  asset: LiquidityPoolSupplyAsset;
  balance: string;
}

export function AmmPoolsBanner() {
  const account = useAccount();

  const [state, setState] = useState<StateInterface[]>([]);

  useEffect(() => {
    const getBalance = async (
      pool: LiquidityPool,
      token: LiquidityPoolSupplyAsset,
    ) => {
      return await contractReader.callByAddress(
        token.getContractAddress(),
        ERC20Abi as any,
        'balanceOf',
        [account],
      );
    };

    const getData = async () => {
      const items: StateInterface[] = [];
      for (let pool of pools) {
        if (pool.version === 1) {
          const balance = (await getBalance(pool, pool.supplyAssets[0])) as any;
          if (balance !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[0],
              balance,
            });
          }
          console.log({ pool, balance });
        } else if (pool.version === 2) {
          const balance1 = (await getBalance(
            pool,
            pool.supplyAssets[0],
          )) as any;
          if (balance1 !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[0],
              balance: balance1,
            });
          }

          const balance2 = (await getBalance(
            pool,
            pool.supplyAssets[1],
          )) as any;
          if (balance2 !== '0') {
            items.push({
              pool: pool.poolAsset,
              asset: pool.supplyAssets[1],
              balance: balance2,
            });
          }
        }
      }
      setState(items);
    };

    if (!account) {
      setState([]);
      return;
    }
    getData().catch(console.error);
  }, [account]);

  if (state.length === 0 || !account) {
    return <></>;
  }

  return (
    <div className="tw-mb-12">
      <ErrorBadge
        content={
          <>
            {' '}
            You have some pool tokens of our old marked-maker pools, please
            transfer them to the new ones here:
          </>
        }
      />

      <div className="tw-grid tw-grid-flow-col tw-auto-cols-max">
        {state.map(item => (
          <AmmPool
            key={item.pool + '-' + item.asset.asset}
            pool={item.pool}
            asset={item.asset}
            balance={item.balance}
          />
        ))}
      </div>
    </div>
  );
}

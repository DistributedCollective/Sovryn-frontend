import React, { useEffect, useState } from 'react';
import type {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from 'utils/models/liquidity-pool';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useReserveWeight } from '../../../../hooks/useReserveWeight';
import {
  getAmmContract,
  getAmmContractName,
  getTokenContract,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToAssetNumberFormat,
} from '../../../../../utils/display-text/format';
import { contractReader } from '../../../../../utils/sovryn/contract-reader';
import cn from 'classnames';

interface Props {
  pool: LiquidityPool;
  supplyAsset: LiquidityPoolSupplyAsset;
  className?: string;
}

export function PoolAssetInfo({ pool, supplyAsset, className }: Props) {
  const weight = useReserveWeight(
    getAmmContractName(pool.poolAsset),
    getTokenContract(supplyAsset.asset).address,
  );

  return (
    <div
      className={cn(
        'tw-flex tw-flex-row tw-justify-between tw-items-center',
        className,
      )}
    >
      <div className="tw-flex tw-w-24 tw-mr-4 2xl:tw-mr-7">
        <AssetRenderer asset={supplyAsset.asset} showImage />
      </div>
      <div className="tw-w-20 tw-flex tw-flex-col tw-tracking-normal">
        <div className="tw-font-thin tw-text-base">
          <LoadableValue
            loading={weight.loading}
            value={<>{toNumberFormat(Number(weight.value) / 1e4, 1)}%</>}
          />
        </div>
        <div className="tw-text-xs">
          {pool.version === 1 && (
            <ReserveStakedBalanceV1 pool={pool} supplyAsset={supplyAsset} />
          )}
          {pool.version === 2 && (
            <ReserveStakedBalanceV2 pool={pool} supplyAsset={supplyAsset} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReserveStakedBalanceV1({ pool, supplyAsset }: Props) {
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getBalance = async () => {
      return await contractReader.call<string>(
        getTokenContractName(supplyAsset.asset),
        'balanceOf',
        [getAmmContract(pool.poolAsset).address],
      );
    };

    setLoading(true);
    getBalance()
      .then(e => {
        setBalance(e);
        setLoading(false);
      })
      .catch(console.error);
  }, [pool, supplyAsset]);

  return (
    <LoadableValue
      loading={loading}
      value={<>{weiToAssetNumberFormat(balance, supplyAsset.asset, 4)}</>}
    />
  );
}

function ReserveStakedBalanceV2({ pool, supplyAsset }: Props) {
  const balance = useCacheCallWithValue(
    getAmmContractName(pool.poolAsset),
    'reserveStakedBalance',
    '0',
    getTokenContract(supplyAsset.asset).address,
  );
  return (
    <LoadableValue
      loading={balance.loading}
      value={<>{weiToAssetNumberFormat(balance.value, supplyAsset.asset, 4)}</>}
    />
  );
}

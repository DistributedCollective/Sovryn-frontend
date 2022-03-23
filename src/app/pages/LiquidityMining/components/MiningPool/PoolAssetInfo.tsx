import React from 'react';
import classNames from 'classnames';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import { useReserveWeight } from '../../../../hooks/useReserveWeight';
import {
  getTokenContract,
  getTokenContractName,
} from '../../../../../utils/blockchain/contract-helpers';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import type { Asset } from 'types';
import { useCacheCallToWithValue } from 'app/hooks/chain/useCacheCallToWithValue';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';

interface Props {
  pool: AmmLiquidityPool;
  supplyAsset: Asset;
  className?: string;
}

export function PoolAssetInfo({ pool, supplyAsset, className }: Props) {
  const weight = useReserveWeight(pool, supplyAsset);

  return (
    <div
      className={classNames(
        'tw-flex tw-flex-row tw-justify-between tw-items-center',
        className,
      )}
    >
      <div className="tw-flex tw-w-24 tw-mr-4 2xl:tw-mr-7">
        <AssetRenderer asset={supplyAsset} showImage />
      </div>
      <div className="tw-w-20 tw-flex tw-flex-col tw-tracking-normal">
        <div className="tw-font-extralight tw-text-base">
          <LoadableValue
            loading={weight.loading}
            value={<>{toNumberFormat(Number(weight.value) / 1e4, 1)}%</>}
          />
        </div>
        <div className="tw-text-xs">
          {pool.converterVersion === 1 && (
            <ReserveStakedBalanceV1 pool={pool} supplyAsset={supplyAsset} />
          )}
          {pool.converterVersion === 2 && (
            <ReserveStakedBalanceV2 pool={pool} supplyAsset={supplyAsset} />
          )}
        </div>
      </div>
    </div>
  );
}

function ReserveStakedBalanceV1({ pool, supplyAsset }: Props) {
  const { value: balance, loading } = useCacheCallWithValue(
    getTokenContractName(supplyAsset),
    'balanceOf',
    '0',
    pool.converter,
  );
  return (
    <LoadableValue
      loading={loading}
      value={<>{weiToNumberFormat(balance, 4)}</>}
    />
  );
}

function ReserveStakedBalanceV2({ pool, supplyAsset }: Props) {
  const balance = useCacheCallToWithValue(
    pool.converter,
    pool.converterAbi,
    'reserveStakedBalance',
    '0',
    [getTokenContract(supplyAsset).address],
  );
  return (
    <LoadableValue
      loading={balance.loading}
      value={<>{weiToNumberFormat(balance.value, 4)}</>}
    />
  );
}

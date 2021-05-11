import React from 'react';
import { Asset } from 'types';
import { LiquidityPoolSupplyAsset } from 'utils/models/liquidity-pool';
import { useCacheCallWithValue } from '../../../../hooks/useCacheCallWithValue';
import {
  getAmmContractName,
  getTokenContract,
} from '../../../../../utils/blockchain/contract-helpers';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';

interface Props {
  poolAsset: Asset;
  supplyAsset: LiquidityPoolSupplyAsset;
}

export function PoolAssetInfo({
  poolAsset,
  supplyAsset,
}: {
  poolAsset: Asset;
  supplyAsset: LiquidityPoolSupplyAsset;
}) {
  const weight = useCacheCallWithValue(
    getAmmContractName(poolAsset),
    'reserveWeight',
    '0',
    getTokenContract(supplyAsset.asset).address,
  );
  const balance = useCacheCallWithValue(
    getAmmContractName(poolAsset),
    'reserveStakedBalance',
    '0',
    getTokenContract(supplyAsset.asset).address,
  );
  return (
    <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-8">
      <div className="tw-flex-shrink-0">
        <AssetRenderer asset={supplyAsset.asset} showImage />
      </div>
      <div className="tw-w-full tw-flex tw-flex-col">
        <div className="tw-font-light">
          <LoadableValue
            loading={weight.loading}
            value={<>{toNumberFormat(Number(weight.value) / 1e4, 1)}%</>}
          />
        </div>
        <div className="tw-text-xs">
          <LoadableValue
            loading={balance.loading}
            value={<>{weiToNumberFormat(balance.value, 4)}</>}
          />
        </div>
      </div>
    </div>
  );
}

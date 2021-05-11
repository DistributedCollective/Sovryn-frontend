import React from 'react';
import type { LiquidityPool } from 'utils/models/liquidity-pool';
import { LoadableValue } from '../../../../components/LoadableValue';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../../utils/display-text/format';
import { AssetRenderer } from '../../../../components/AssetRenderer';
import { PoolTokenRewards } from './PoolTokenRewards';
import { useLiquidityMining_getUserInfo } from '../../hooks/useLiquidityMining_getUserInfo';
import { useConverter_RemoveLiquidityReturnAndFee } from '../../hooks/useConverter_RemoveLiquidityReturnAndFee';

interface Props {
  pool: LiquidityPool;
}

export function UserPoolInfo({ pool }: Props) {
  const token1 = pool.supplyAssets[0];
  const token2 = pool.supplyAssets[1];

  const info1 = useLiquidityMining_getUserInfo(token1.getContractAddress());
  const info2 = useLiquidityMining_getUserInfo(token2.getContractAddress());

  const balance1 = useConverter_RemoveLiquidityReturnAndFee(
    pool.poolAsset,
    token1.getContractAddress(),
    info1.value.amount,
  );
  const balance2 = useConverter_RemoveLiquidityReturnAndFee(
    pool.poolAsset,
    token2.getContractAddress(),
    info2.value.amount,
  );

  return (
    <div className="tw-flex tw-flex-row tw-justify-between tw-items-center tw-space-x-8">
      <div>
        {/* Backend needed, parse events */}
        <div>APY%</div>
        <div>0</div>
      </div>
      <div>
        <div>Fee Share</div>
        <div>{toNumberFormat(pool.version === 1 ? 0.3 : 0.1, 1)}%</div>
      </div>
      <div className="tw-font-bold">
        <div>Your Liquidity</div>
        <div>
          <div>
            <LoadableValue
              loading={info1.loading || balance1.loading}
              value={
                <>
                  {weiToNumberFormat(balance1.value[0], 4)}{' '}
                  <AssetRenderer asset={token1.asset} />
                </>
              }
            />
          </div>
          <div>
            <LoadableValue
              loading={info2.loading || balance2.loading}
              value={
                <>
                  {weiToNumberFormat(balance2.value[0], 4)}{' '}
                  <AssetRenderer asset={token2.asset} />
                </>
              }
            />
          </div>
        </div>
      </div>
      <div className="tw-font-bold">
        {/* Backend needed, parse events */}
        <div>P/L</div>
        <div>0</div>
      </div>
      <div className="tw-font-bold">
        <div>Rewards</div>
        <div>
          <PoolTokenRewards pool={pool} />
        </div>
      </div>
    </div>
  );
}

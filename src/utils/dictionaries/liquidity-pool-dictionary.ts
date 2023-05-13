import { Asset } from 'types/asset';
import { currentNetwork } from 'utils/classifiers';
import type { AmmLiquidityPool } from 'utils/models/amm-liquidity-pool';
import { mainnetAmm } from './amm/mainnet';
import { testnetAmm } from './amm/testnet';

export class LiquidityPoolDictionary {
  private static items: AmmLiquidityPool[] = [...mainnetAmm, ...testnetAmm];

  public static list(): AmmLiquidityPool[] {
    return this.items.filter(item => item.network === currentNetwork);
  }

  public static get(converter: string): AmmLiquidityPool;
  public static get(assetA: Asset, assetB: Asset): AmmLiquidityPool;
  public static get(poolTokenA: string): AmmLiquidityPool;

  public static get(
    converterOrAssetA: Asset | string,
    assetB?: Asset,
  ): AmmLiquidityPool {
    if (assetB) {
      return this.list().find(
        item =>
          (item.assetA === converterOrAssetA && item.assetB === assetB) ||
          (item.assetB === converterOrAssetA && item.assetA === assetB),
      ) as AmmLiquidityPool;
    }
    return this.list().find(
      item =>
        item.converter === converterOrAssetA.toLowerCase() ||
        item.previousConverters.includes(
          converterOrAssetA.toLocaleLowerCase(),
        ) ||
        item.poolTokenA.toLowerCase() === converterOrAssetA.toLowerCase(),
    ) as AmmLiquidityPool;
  }

  public static getByKey(key: string): AmmLiquidityPool {
    return this.list().find(item => item.key === key) as AmmLiquidityPool;
  }
}

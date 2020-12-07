import { Asset } from 'types/asset';
import {
  LiquidityPool,
  LiquidityPoolSupplyAsset,
} from '../models/liquidity-pool';

export class LiquidityPoolDictionary {
  public static pools: Map<Asset, LiquidityPool> = new Map<
    Asset,
    LiquidityPool
  >([
    [
      Asset.DOC,
      new LiquidityPool(Asset.DOC, [
        new LiquidityPoolSupplyAsset(
          Asset.DOC,
          '0x6787161bc4F8d54e6ac6fcB9643Af6f4a12DfF28',
        ),
        new LiquidityPoolSupplyAsset(
          Asset.BTC,
          '0x7F433CC76298bB5099c15C1C7C8f2e89A8370111',
        ),
      ]),
    ],
    [
      Asset.USDT,
      new LiquidityPool(Asset.USDT, [
        new LiquidityPoolSupplyAsset(
          Asset.USDT,
          '0x7274305BB36d66F70cB8824621EC26d52ABe9069',
        ),
        new LiquidityPoolSupplyAsset(
          Asset.BTC,
          '0xfFBBF93Ecd27C8b500Bd35D554802F7F349A1E9B',
        ),
      ]),
    ],
    [
      Asset.BPRO,
      new LiquidityPool(Asset.BPRO, [
        new LiquidityPoolSupplyAsset(
          Asset.BPRO,
          '0xdaf6FD8370f5245d98E829c766e008cd39E8F060',
        ),
        new LiquidityPoolSupplyAsset(
          Asset.BTC,
          '0x98e5F39D8C675972A66ea165040Cb81803c440A3',
        ),
      ]),
    ],
  ]);

  public static get(asset: Asset): LiquidityPool {
    return this.pools.get(asset) as LiquidityPool;
  }

  public static list(): Array<LiquidityPool> {
    return Array.from(this.pools.values());
  }

  public static pairTypeList(): Array<Asset> {
    return Array.from(this.pools.keys());
  }

  public static find(pairs: Array<Asset>): Array<LiquidityPool> {
    return pairs.map(asset => this.get(asset));
  }

  public static getPoolAsset(pool: Asset, asset: Asset) {
    return this.get(pool).getPoolAsset(asset);
  }

  public static entries() {
    return Array.from(this.pools.entries());
  }
}

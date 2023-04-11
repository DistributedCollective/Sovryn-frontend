import { Asset } from 'types/asset';
import { isMainnet } from 'utils/classifiers';
import { LendingPool } from '../models/lending-pool';

export class LendingPoolDictionary {
  public static pools: Map<Asset, LendingPool> = new Map<Asset, LendingPool>([
    [
      Asset.DLLR,
      new LendingPool(
        'DLLR',
        Asset.DLLR,
        [Asset.RBTC, Asset.BPRO, Asset.SOV],
        false,
        false,
      ),
    ],
    [
      Asset.RBTC,
      new LendingPool(
        'RBTC',
        Asset.RBTC,
        [Asset.DLLR, Asset.XUSD, Asset.DOC, Asset.BPRO, Asset.SOV],
        false,
        false,
      ),
    ],
    [
      Asset.XUSD,
      new LendingPool(
        'XUSD',
        Asset.XUSD,
        [Asset.RBTC, Asset.BPRO, Asset.SOV],
        true,
        false,
      ),
    ],
    [
      Asset.DOC,
      new LendingPool(
        'DoC',
        Asset.DOC,
        [Asset.RBTC, Asset.XUSD, Asset.BPRO, Asset.SOV],
        false,
        false,
      ),
    ],
    [Asset.USDT, new LendingPool('USDT', Asset.USDT, [], false, true)],
    [
      Asset.BPRO,
      new LendingPool(
        'BPRO',
        Asset.BPRO,
        [Asset.DLLR, Asset.RBTC, Asset.XUSD, Asset.DOC, Asset.SOV],
        false,
        false,
      ),
    ],
  ]);

  public static get(asset: Asset): LendingPool {
    return this.pools.get(asset) as LendingPool;
  }

  public static list(): Array<LendingPool> {
    return Array.from(this.pools.values());
  }

  public static assetList(): Array<Asset> {
    return Array.from(this.pools.keys());
  }

  public static find(assets: Array<Asset>): Array<LendingPool> {
    return assets.map(asset => this.get(asset));
  }

  public static entries() {
    return Array.from(this.pools.entries());
  }
}

if (!isMainnet) {
  LendingPoolDictionary.pools.set(
    Asset.XUSD_legacy,
    new LendingPool(
      'XUSD*',
      Asset.XUSD_legacy,
      [Asset.RBTC, Asset.DOC, Asset.BPRO, Asset.SOV],
      true,
      true,
    ),
  );
}

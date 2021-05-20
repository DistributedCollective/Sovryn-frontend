import { Asset } from 'types/asset';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { AssetDetails } from './asset-details';
import { currentNetwork } from '../classifiers';

type PoolVersion = 2 | 1;

export class LiquidityPool {
  public readonly assetDetails: AssetDetails;
  public version: PoolVersion = 2;
  constructor(
    public readonly poolAsset: Asset,
    public readonly supplyAssets: LiquidityPoolSupplyAsset[] = [],
  ) {
    this.assetDetails = AssetsDictionary.get(this.poolAsset);
  }
  public getName(): string {
    return this.assetDetails.symbol;
  }

  /**
   * @deprecated use poolAsset prop instead
   */
  public getAsset(): Asset {
    return this.poolAsset;
  }

  /**
   * @deprecated use assetDetails prop instead
   */
  public getAssetDetails(): AssetDetails {
    return this.assetDetails;
  }

  /**
   * @deprecated use supplyAssets prop instead.
   */
  public getSupplyAssets(): LiquidityPoolSupplyAsset[] {
    return this.supplyAssets;
  }
  public getPoolAsset(asset: Asset) {
    return this.supplyAssets.find(item => item.getAsset() === asset);
  }
  public setVersion(version: PoolVersion) {
    this.version = version;
    return this;
  }
  public getVersion() {
    return this.version;
  }
}

export class LiquidityPoolSupplyAsset {
  public readonly assetDetails: AssetDetails;
  constructor(
    public readonly asset: Asset,
    public readonly poolTokens: LiquidityPoolTokens,
  ) {
    this.assetDetails = AssetsDictionary.get(this.asset);
  }
  public getAsset() {
    return this.asset;
  }
  public getAssetDetails() {
    return this.assetDetails;
  }
  public getContractAddress(): string {
    if (this.poolTokens.hasOwnProperty(currentNetwork)) {
      return this.poolTokens[currentNetwork];
    }
    throw new Error(
      'Pool token is not defined for ' + this.asset + ' on ' + currentNetwork,
    );
  }
}

export interface LiquidityPoolTokens {
  mainnet: string;
  testnet: string;
}

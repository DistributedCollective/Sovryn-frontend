import { Asset } from 'types/asset';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { AssetDetails } from './asset-details';

export class LiquidityPool {
  private _assetDetails: AssetDetails;
  constructor(
    private _poolAsset: Asset,
    private _supplyAssets: LiquidityPoolSupplyAsset[] = [],
  ) {
    this._assetDetails = AssetsDictionary.get(this._poolAsset);
  }
  public getName(): string {
    return this._assetDetails.symbol;
  }
  public getAsset(): Asset {
    return this._poolAsset;
  }
  public getAssetDetails(): AssetDetails {
    return this._assetDetails;
  }
  public getSupplyAssets(): LiquidityPoolSupplyAsset[] {
    return this._supplyAssets;
  }
  public getPoolAsset(asset: Asset) {
    return this._supplyAssets.find(item => item.getAsset() === asset);
  }
}

export class LiquidityPoolSupplyAsset {
  private _assetDetails: AssetDetails;
  constructor(private _asset: Asset, private _poolTokenAddress: string) {
    this._assetDetails = AssetsDictionary.get(this._asset);
  }
  public getAsset() {
    return this._asset;
  }
  public getAssetDetails() {
    return this._assetDetails;
  }
  public getContractAddress() {
    return this._poolTokenAddress;
  }
}

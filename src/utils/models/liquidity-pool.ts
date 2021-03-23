import { Asset } from 'types/asset';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { AssetDetails } from './asset-details';
import { currentNetwork } from '../classifiers';

type PoolVersion = 2 | 1;

export class LiquidityPool {
  private _assetDetails: AssetDetails;
  private _version: PoolVersion = 2;
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
  public setVersion(version: PoolVersion) {
    this._version = version;
    return this;
  }
  public getVersion() {
    return this._version;
  }
}

export class LiquidityPoolSupplyAsset {
  private _assetDetails: AssetDetails;
  constructor(private _asset: Asset, private _poolTokens: LiquidityPoolTokens) {
    this._assetDetails = AssetsDictionary.get(this._asset);
  }
  public getAsset() {
    return this._asset;
  }
  public getAssetDetails() {
    return this._assetDetails;
  }
  public getContractAddress(): string {
    if (this._poolTokens.hasOwnProperty(currentNetwork)) {
      return this._poolTokens[currentNetwork];
    }
    throw new Error(
      'Pool token is not defined for ' + this._asset + ' on ' + currentNetwork,
    );
  }
}

export interface LiquidityPoolTokens {
  mainnet: string;
  testnet: string;
}

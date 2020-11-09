import { Asset } from 'types/asset';
import { AssetsDictionary } from '../blockchain/assets-dictionary';
import { AssetDetails } from '../blockchain/asset-details';

export class LendingPool {
  private _assetDetails;
  constructor(private _name: string, private _asset: Asset) {
    this._assetDetails = AssetsDictionary.get(this._asset);
  }

  public getName(): string {
    return this._name;
  }

  public getAsset(): Asset {
    return this._asset;
  }
  public getAssetDetails(): AssetDetails {
    return this._assetDetails;
  }
}

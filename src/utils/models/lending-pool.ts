import { Asset } from 'types/asset';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { AssetDetails } from './asset-details';

export class LendingPool {
  private _assetDetails;
  constructor(
    private _name: string,
    private _asset: Asset,
    private _borrowCollateral: Asset[] = [],
    public readonly useLM: boolean,
    public readonly deprecated: boolean = false,
  ) {
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
  public getBorrowCollateral(): Asset[] {
    return this._borrowCollateral;
  }
}

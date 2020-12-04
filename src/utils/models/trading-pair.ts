import { Asset } from 'types/asset';
import { AssetsDictionary } from '../blockchain/assets-dictionary';
import { AssetDetails } from '../blockchain/asset-details';
import { TradingPosition } from '../../types/trading-position';

export class TradingPair {
  private _assetDetails;
  constructor(
    private _name: string,
    private _asset: Asset,
    private _chartSymbol: string,
    private _longAsset: Asset,
    private _shortAsset: Asset,
    private _longCollateral: Asset[],
    private _shortCollateral: Asset[],
  ) {
    this._assetDetails = AssetsDictionary.get(this._asset);
  }

  public getName(): string {
    return this._name;
  }

  public getAsset(): Asset {
    return this._asset;
  }

  public getLongAsset(): Asset {
    return this._longAsset;
  }

  public getShortAsset(): Asset {
    return this._shortAsset;
  }

  public getShortCollateral(): Asset[] {
    return this._shortCollateral;
  }

  public getLongCollateral(): Asset[] {
    return this._longCollateral;
  }

  public getAssetDetails(): AssetDetails {
    return this._assetDetails;
  }

  public getAssetForPosition(position: TradingPosition): Asset {
    return position === TradingPosition.LONG
      ? this._longAsset
      : this._shortAsset;
  }

  public getCollateralForPosition(position: TradingPosition): Asset[] {
    return position === TradingPosition.LONG
      ? this._longCollateral
      : this._shortCollateral;
  }

  public getChartSymbol() {
    return this._chartSymbol;
  }
}

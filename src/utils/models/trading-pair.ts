import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { Asset } from 'types/asset';
import { TradingPairType } from '../dictionaries/trading-pair-dictionary';
import { TradingPosition } from '../../types/trading-position';

export class TradingPair {
  public readonly shortDetails;
  public readonly longDetails;
  constructor(
    public readonly pairType: TradingPairType,
    public readonly name: string,
    public readonly chartSymbol: string,
    public readonly longAsset: Asset,
    public readonly shortAsset: Asset,
    public readonly collaterals: Asset[],
  ) {
    this.shortDetails = AssetsDictionary.get(this.shortAsset);
    this.longDetails = AssetsDictionary.get(this.longAsset);
  }

  public getContractForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.longAsset : this.shortAsset;
  }

  public getAssetForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.longAsset : this.shortAsset;
  }
}

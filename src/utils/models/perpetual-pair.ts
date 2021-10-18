import type { ReactNode } from 'react';
import type { Asset } from 'types/asset';
import type { PerpetualPairType } from '../dictionaries/perpetual-pair-dictionary';
import type { AssetDetails } from './asset-details';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { TradingPosition } from '../../types/trading-position';

export class PerpetualPair {
  public readonly shortDetails: AssetDetails;
  public readonly longDetails: AssetDetails;
  constructor(
    public readonly pairType: PerpetualPairType,
    public readonly name: ReactNode,
    public readonly chartSymbol: string,
    public readonly longAsset: Asset,
    public readonly shortAsset: Asset,
    public readonly collaterals: Asset[],
    public readonly deprecated: boolean = false,
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

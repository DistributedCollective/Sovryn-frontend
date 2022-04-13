import type { ReactNode } from 'react';
import type { Asset } from 'types/asset';
import type { TradingPairType } from '../dictionaries/trading-pair-dictionary';
import type { AssetDetails } from './asset-details';
import { AssetsDictionary } from '../dictionaries/assets-dictionary';
import { TradingPosition } from '../../types/trading-position';

export class TradingPair {
  public readonly shortDetails: AssetDetails;
  public readonly longDetails: AssetDetails;
  constructor(
    public readonly pairType: TradingPairType,
    public readonly name: ReactNode,
    public readonly chartSymbol: string,
    public readonly longAsset: Asset,
    public readonly shortAsset: Asset,
    public readonly collaterals: Asset[],
    public readonly deprecated: boolean = false,
    public readonly canOpenLong: boolean = true,
    public readonly canOpenShort: boolean = true,
    public readonly leverage: number | undefined = undefined,
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
  public getBorrowAssetForPosition(position: TradingPosition) {
    return position === TradingPosition.SHORT
      ? this.longAsset
      : this.shortAsset;
  }
}

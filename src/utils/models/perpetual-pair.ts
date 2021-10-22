import type { ReactNode } from 'react';
import type { Asset } from 'types/asset';
import type { PerpetualPairType } from '../dictionaries/perpetual-pair-dictionary';
import { TradingPosition } from '../../types/trading-position';

export class PerpetualPair {
  constructor(
    public readonly pairType: PerpetualPairType,
    public readonly name: ReactNode,
    public readonly chartSymbol: string,
    public readonly longAsset: string,
    public readonly shortAsset: string,
    public readonly collaterals: Asset[],
    public readonly deprecated: boolean = false,
  ) {}

  public getContractForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.longAsset : this.shortAsset;
  }

  public getAssetForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.longAsset : this.shortAsset;
  }
}

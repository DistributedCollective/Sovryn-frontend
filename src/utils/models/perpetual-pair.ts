import type { ReactNode } from 'react';
import type { Asset } from 'types/asset';
import type {
  PerpetualPairType,
  PerpetualPairConfig,
} from '../dictionaries/perpetual-pair-dictionary';
import { TradingPosition } from '../../types/trading-position';

export class PerpetualPair {
  constructor(
    public readonly id: string,
    public readonly pairType: PerpetualPairType,
    public readonly name: ReactNode,
    public readonly chartSymbol: string,
    public readonly quoteAsset: string,
    public readonly baseAsset: string,
    public readonly collateralAsset: Asset,
    public readonly config: PerpetualPairConfig,
    public readonly deprecated: boolean = false,
  ) {}

  public getContractForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.quoteAsset : this.baseAsset;
  }

  public getAssetForPosition(position: TradingPosition) {
    return position === TradingPosition.LONG ? this.quoteAsset : this.baseAsset;
  }
}

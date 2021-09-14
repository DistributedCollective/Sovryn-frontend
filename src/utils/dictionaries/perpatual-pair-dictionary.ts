import { Asset } from 'types/asset';
import { PerpetualPair } from '../models/perpetual-pair';
import { TradingPosition } from 'types/trading-position';
import { RenderTradingPairName } from '../../app/components/Helpers';

export enum PerpetualPairType {
  BTCUSD = 'BTCUSD',
}

export class PerpetualPairDictionary {
  /**
   * @deprecated
   */
  public static longPositionTokens = [Asset.DOC, Asset.USDT, Asset.XUSD];

  // Note: do not remove pairs from the list, set them as deprecated (last property in PerpetualPair constructor)
  // if trading should be halted for them.
  // Removing will break histories and open positions for that pair.
  public static pairs: Map<PerpetualPairType, PerpetualPair> = new Map<
    PerpetualPairType,
    PerpetualPair
  >([
    [
      PerpetualPairType.BTCUSD,
      new PerpetualPair(
        PerpetualPairType.BTCUSD,
        RenderTradingPairName(Asset.RBTC, Asset.XUSD),
        'RBTC/USDT',
        Asset.XUSD,
        Asset.RBTC,
        [Asset.RBTC, Asset.XUSD],
        false,
      ),
    ],
  ]);

  public static get(pair: PerpetualPairType): PerpetualPair {
    return this.pairs.get(pair) as PerpetualPair;
  }

  public static list(): Array<PerpetualPair> {
    return Array.from(this.pairs.values());
  }

  public static pairTypeList(): Array<PerpetualPairType> {
    return Array.from(this.pairs.keys());
  }

  public static find(pairs: Array<PerpetualPairType>): Array<PerpetualPair> {
    return pairs.map(asset => this.get(asset));
  }

  public static entries() {
    return Array.from(this.pairs.entries());
  }

  public static findPair(loanToken: Asset, collateral: Asset) {
    return this.list().find(
      item =>
        (item.longAsset === loanToken && item.shortAsset === collateral) ||
        (item.shortAsset === loanToken && item.longAsset === collateral),
    ) as PerpetualPair;
  }

  public static getPositionByPair(loanToken: Asset, collateral: Asset) {
    const pair = this.findPair(loanToken, collateral);
    if (!pair) {
      return undefined;
    }
    if (pair.longAsset === loanToken) return TradingPosition.LONG;
    return TradingPosition.SHORT;
  }
}

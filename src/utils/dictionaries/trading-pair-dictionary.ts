import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';
import { TradingPosition } from 'types/trading-position';
import { RenderTradingPairName } from '../../app/components/Helpers';

export enum TradingPairType {
  RBTC_DOC = 'RBTC_DOC',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_SOV = 'RBTC_SOV',
  BPRO_USDT = 'BPRO_USDT',
  BPRO_DOC = 'BPRO_DOC',
}

export class TradingPairDictionary {
  /**
   * @deprecated
   */
  public static longPositionTokens = [Asset.DOC, Asset.USDT];
  public static pairs: Map<TradingPairType, TradingPair> = new Map<
    TradingPairType,
    TradingPair
  >([
    [
      TradingPairType.RBTC_USDT,
      new TradingPair(
        TradingPairType.RBTC_USDT,
        RenderTradingPairName(Asset.RBTC, Asset.USDT),
        'RBTC/USDT',
        Asset.USDT,
        Asset.RBTC,
        [Asset.RBTC, Asset.USDT],
      ),
    ],
    // [
    //   TradingPairType.RBTC_SOV,
    //   new TradingPair(
    //     TradingPairType.RBTC_DOC,
    //     RenderTradingPairName(Asset.RBTC, Asset.SOV),
    //     'RBTC/SOV',
    //     Asset.SOV,
    //     Asset.RBTC,
    //     [Asset.RBTC, Asset.SOV],
    //   ),
    // ],
    [
      TradingPairType.RBTC_DOC,
      new TradingPair(
        TradingPairType.RBTC_DOC,
        RenderTradingPairName(Asset.RBTC, Asset.DOC),
        'RBTC/DOC',
        Asset.DOC,
        Asset.RBTC,
        [Asset.RBTC, Asset.DOC],
      ),
    ],
    [
      TradingPairType.BPRO_USDT,
      new TradingPair(
        TradingPairType.BPRO_USDT,
        RenderTradingPairName(Asset.BPRO, Asset.USDT),
        'BPRO/USDT',
        Asset.USDT,
        Asset.BPRO,
        [Asset.BPRO, Asset.USDT],
      ),
    ],
    [
      TradingPairType.BPRO_DOC,
      new TradingPair(
        TradingPairType.BPRO_DOC,
        RenderTradingPairName(Asset.BPRO, Asset.DOC),
        'BPRO/DOC',
        Asset.DOC,
        Asset.BPRO,
        [Asset.BPRO, Asset.DOC],
      ),
    ],
  ]);

  public static get(pair: TradingPairType): TradingPair {
    return this.pairs.get(pair) as TradingPair;
  }

  public static list(): Array<TradingPair> {
    return Array.from(this.pairs.values());
  }

  public static pairTypeList(): Array<TradingPairType> {
    return Array.from(this.pairs.keys());
  }

  public static find(pairs: Array<TradingPairType>): Array<TradingPair> {
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
    ) as TradingPair;
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

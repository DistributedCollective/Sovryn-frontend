import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';

export enum TradingPairType {
  RBTC_DOC = 'RBTC_DOC',
  RBTC_USDT = 'RBTC_USDT',
  RBTC_SOV = 'RBTC_SOV',
  BPRO_USDT = 'BPRO_USDT',
}

export class TradingPairDictionary {
  public static longPositionTokens = [Asset.DOC, Asset.USDT];
  public static pairs: Map<TradingPairType, TradingPair> = new Map<
    TradingPairType,
    TradingPair
  >([
    [
      TradingPairType.RBTC_USDT,
      new TradingPair(
        TradingPairType.RBTC_USDT,
        'RBTCUSDT',
        'RBTC:USDT',
        Asset.USDT,
        Asset.RBTC,
        [Asset.RBTC, Asset.USDT],
      ),
    ],
    [
      TradingPairType.BPRO_USDT,
      new TradingPair(
        TradingPairType.BPRO_USDT,
        'BRPOUSDT',
        'BPRO:USDT',
        Asset.USDT,
        Asset.BPRO,
        [Asset.BPRO, Asset.USDT],
      ),
    ],
    [
      TradingPairType.RBTC_DOC,
      new TradingPair(
        TradingPairType.RBTC_DOC,
        'RBTCDOC',
        'RBTC:DOC',
        Asset.DOC,
        Asset.RBTC,
        [Asset.RBTC, Asset.DOC],
      ),
    ],
    [
      TradingPairType.RBTC_SOV,
      new TradingPair(
        TradingPairType.RBTC_DOC,
        'RBTCSOV',
        'RBTC:SOV',
        Asset.SOV,
        Asset.RBTC,
        [Asset.RBTC, Asset.SOV],
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
}

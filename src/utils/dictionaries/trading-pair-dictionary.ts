import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';

export enum TradingPairType {
  RBTC_DOC = 'RBTC_DOC',
  RBTC_USDT = 'RBTC_USDT',
  BPRO_USDT = 'BPRO_USDT',
  RBTC_SOV = 'RBTC_SOV',
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
        'RBTC/USDT',
        // asset
        Asset.RBTC,
        'RBTC:USDT',
        // asset for long position
        Asset.USDT,
        // asset for short position
        Asset.RBTC,
        [Asset.RBTC, Asset.USDT, Asset.DOC],
        [Asset.RBTC, Asset.USDT, Asset.DOC],
      ),
    ],
    [
      TradingPairType.BPRO_USDT,
      new TradingPair(
        'BPRO/USDT',
        // asset
        Asset.BPRO,
        'BPRO:USDT',
        // asset for long position
        Asset.USDT,
        // asset for short position
        Asset.BPRO,
        [Asset.USDT, Asset.BPRO, Asset.DOC],
        [Asset.USDT, Asset.BPRO, Asset.DOC],
      ),
    ],
    // [
    //   TradingPairType.RBTC_SOV,
    //   new TradingPair(
    //     'RBTC/SOV',
    //     // asset
    //     Asset.RBTC,
    //     'BTC:SOV',
    //     // asset for long position
    //     Asset.SOV,
    //     // asset for short position
    //     Asset.RBTC, // no shorting for SOV
    //     [Asset.RBTC, Asset.SOV],
    //     [],
    //   ),
    // ],
  ]);

  public static get(pair: TradingPairType): TradingPair {
    return this.pairs.get(pair) as TradingPair;
  }

  public static getByLoanAsset(asset: Asset): TradingPair {
    return this.list().find(
      item => item.getShortAsset() === asset || item.getLongAsset() === asset,
    ) as TradingPair;
  }

  public static getByShortAsset(asset: Asset): TradingPair {
    return this.list().find(
      item => item.getShortAsset() === asset,
    ) as TradingPair;
  }

  public static getByLongAsset(asset: Asset): TradingPair {
    return this.list().find(
      item => item.getLongAsset() === asset,
    ) as TradingPair;
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

import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';

export enum TradingPairType {
  BTC_DOC = 'BTC_DOC',
  BTC_USDT = 'BTC_USDT',
  BPRO_USDT = 'BPRO_USDT',
  BTC_SOV = 'BTC_SOV',
}

export class TradingPairDictionary {
  public static longPositionTokens = [Asset.DOC, Asset.USDT];
  public static pairs: Map<TradingPairType, TradingPair> = new Map<
    TradingPairType,
    TradingPair
  >([
    [
      TradingPairType.BTC_USDT,
      new TradingPair(
        'RBTC/USDT',
        // asset
        Asset.BTC,
        'BTC:USDT',
        // asset for long position
        Asset.USDT,
        // asset for short position
        Asset.BTC,
        [Asset.BTC, Asset.USDT, Asset.DOC],
        [Asset.BTC, Asset.USDT, Asset.DOC],
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
    //   TradingPairType.BTC_SOV,
    //   new TradingPair(
    //     'RBTC/SOV',
    //     // asset
    //     Asset.BTC,
    //     'BTC:SOV',
    //     // asset for long position
    //     Asset.SOV,
    //     // asset for short position
    //     Asset.BTC, // no shorting for SOV
    //     [Asset.BTC, Asset.SOV],
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

import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';

export enum TradingPairType {
  BTC_DOC = 'BTC_DOC',
  BPRO_USDT = 'BPRO_USDT',
}

export class TradingPairDictionary {
  public static pairs: Map<TradingPairType, TradingPair> = new Map<
    TradingPairType,
    TradingPair
  >([
    [
      TradingPairType.BTC_DOC,
      new TradingPair(
        'BTC',
        // asset
        Asset.BTC,
        'Bitfinex:BTCUSD',
        // asset for long position
        Asset.DOC,
        // asset for sort position
        Asset.BTC,
        [Asset.BTC, Asset.DOC],
        [Asset.BTC, Asset.DOC],
      ),
    ],
    [
      TradingPairType.BPRO_USDT,
      new TradingPair(
        'BPRO',
        // asset
        Asset.BPRO,
        'Bitfinex:BTCUSD',
        // asset for long position
        Asset.USDT,
        // asset for sort position
        Asset.BPRO,
        [Asset.USDT, Asset.BPRO],
        [Asset.USDT, Asset.BPRO],
      ),
    ],
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

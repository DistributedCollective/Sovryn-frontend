import { Asset } from 'types/asset';
import { TradingPair } from './models/trading-pair';

export enum TradingPairType {
  BTC_DOC = 'BTCUSD',
  DOC_TEST = 'ETHUSD',
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
        Asset.BTC,
        Asset.DOC,
        Asset.BTC,
        [Asset.BTC, Asset.DOC],
        [Asset.DOC, Asset.BTC],
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

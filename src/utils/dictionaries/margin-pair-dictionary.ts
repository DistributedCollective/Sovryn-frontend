import { Asset } from 'types/asset';
import { MarginPair } from '../models/margin-pair';
import { TradingPosition } from 'types/trading-position';

export enum MarginPairType {
  BTCUSD = 'BTCUSD',
}

export type MarginPairConfig = {
  leverage: {
    min: number;
    max: number;
    steps: number[];
    default: number;
  };
};

export class MarginPairDictionary {
  // Note: do not remove pairs from the list, set them as deprecated (last property in MarginPair constructor)
  // if trading should be halted for them.
  // Removing will break histories and open positions for that pair.
  public static pairs: Map<MarginPairType, MarginPair> = new Map<
    MarginPairType,
    MarginPair
  >([
    [
      MarginPairType.BTCUSD,
      new MarginPair(
        '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d',
        MarginPairType.BTCUSD,
        'BTC/USD',
        'BTC/USD',
        'USD',
        'BTC',
        Asset.TRADING,
        {
          leverage: {
            min: 0.1,
            max: 15,
            steps: [1, 2, 3, 5, 10, 15],
            default: 1,
          },
        },
        false,
      ),
    ],
  ]);

  public static get(pair: MarginPairType): MarginPair {
    return this.pairs.get(pair) as MarginPair;
  }

  public static list(): Array<MarginPair> {
    return Array.from(this.pairs.values());
  }

  public static pairTypeList(): Array<MarginPairType> {
    return Array.from(this.pairs.keys());
  }

  public static find(pairs: Array<MarginPairType>): Array<MarginPair> {
    return pairs.map(asset => this.get(asset));
  }

  public static entries() {
    return Array.from(this.pairs.entries());
  }

  public static findPair(loanToken: Asset, collateral: Asset) {
    return this.list().find(
      item =>
        (item.quoteAsset === loanToken && item.baseAsset === collateral) ||
        (item.baseAsset === loanToken && item.quoteAsset === collateral),
    ) as MarginPair;
  }

  public static getPositionByPair(loanToken: Asset, collateral: Asset) {
    const pair = this.findPair(loanToken, collateral);
    if (!pair) {
      return undefined;
    }
    if (pair.quoteAsset === loanToken) return TradingPosition.LONG;
    return TradingPosition.SHORT;
  }

  public static getById(id: string) {
    return this.list().find(item => item.id === id);
  }
}

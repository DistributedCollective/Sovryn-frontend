import { Asset } from 'types/asset';
import { PerpetualPair } from '../models/perpetual-pair';
import { TradingPosition } from 'types/trading-position';
import { PERPETUAL_MAX_LEVERAGE_DEFAULT } from 'app/pages/PerpetualPage/types';

export enum PerpetualPairType {
  BTCUSD = 'BTCUSD',
  BNBUSD = 'BNBUSD',
}

export type PerpetualPairConfig = {
  leverage: {
    min: number;
    max: number;
    steps: number[];
    default: number;
  };
};

export class PerpetualPairDictionary {
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
        '0xada5013122d395ba3c54772283fb069b10426056ef8ca54750cb9bb552a59e7d',
        PerpetualPairType.BTCUSD,
        'BTC/USD',
        'BTC/USD',
        'USD',
        'BTC',
        Asset.BTCS,
        'perpetualLimitOrderBookBTCUSD',
        {
          leverage: {
            min: 0.1,
            max: PERPETUAL_MAX_LEVERAGE_DEFAULT,
            steps: [1, 2, 3, 5, 10, 15],
            default: 1,
          },
        },
        false,
        false,
      ),
    ],
    [
      PerpetualPairType.BNBUSD,
      new PerpetualPair(
        '0xcc69885fda6bcc1a4ace058b4a62bf5e179ea78fd58a1ccd71c22cc9b688792f',
        PerpetualPairType.BNBUSD,
        'BNB/USD',
        'BNB/USD',
        'USD',
        'BNB',
        Asset.BTCS,
        'perpetualLimitOrderBookBNBUSD',
        {
          leverage: {
            min: 0.1,
            max: PERPETUAL_MAX_LEVERAGE_DEFAULT,
            steps: [1, 2, 3, 5, 10, 15],
            default: 1,
          },
        },
        false,
        true,
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
        (item.quoteAsset === loanToken && item.baseAsset === collateral) ||
        (item.baseAsset === loanToken && item.quoteAsset === collateral),
    ) as PerpetualPair;
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

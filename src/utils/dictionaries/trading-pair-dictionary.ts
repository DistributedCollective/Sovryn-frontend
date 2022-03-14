import { Asset } from 'types/asset';
import { TradingPair } from '../models/trading-pair';
import { RenderTradingPairName } from '../../app/components/Helpers';

export enum TradingPairType {
  RBTC_XUSD = 'RBTC_XUSD',
  RBTC_DOC = 'RBTC_DOC',
  RBTC_USDT = 'RBTC_USDT',
  BPRO_XUSD = 'BPRO_XUSD',
  BPRO_USDT = 'BPRO_USDT',
  BPRO_DOC = 'BPRO_DOC',
  SOV_RBTC = 'SOV_RBTC',
  SOV_XUSD = 'SOV_XUSD',
  SOV_BPRO = 'SOV_BPRO',
  SOV_DOC = 'SOV_DOC',
}

export class TradingPairDictionary {
  // Note: do not remove pairs from the list, set them as deprecated (last property in TradingPair constructor)
  // if trading should be halted for them.
  // Removing will break histories and open positions for that pair.
  public static pairs: Map<TradingPairType, TradingPair> = new Map<
    TradingPairType,
    TradingPair
  >([
    [
      TradingPairType.RBTC_XUSD,
      new TradingPair(
        TradingPairType.RBTC_XUSD,
        RenderTradingPairName(Asset.RBTC, Asset.XUSD),
        'RBTC/XUSD',
        Asset.XUSD,
        Asset.RBTC,
        [Asset.RBTC, Asset.XUSD],
        false,
      ),
    ],
    [
      TradingPairType.RBTC_USDT,
      new TradingPair(
        TradingPairType.RBTC_USDT,
        RenderTradingPairName(Asset.RBTC, Asset.USDT),
        'RBTC/USDT',
        Asset.USDT,
        Asset.RBTC,
        [Asset.RBTC, Asset.USDT],
        true,
      ),
    ],
    [
      TradingPairType.RBTC_DOC,
      new TradingPair(
        TradingPairType.RBTC_DOC,
        RenderTradingPairName(Asset.RBTC, Asset.DOC),
        'RBTC/DOC',
        Asset.DOC,
        Asset.RBTC,
        [Asset.RBTC, Asset.DOC],
        false,
      ),
    ],
    [
      TradingPairType.SOV_RBTC,
      new TradingPair(
        TradingPairType.SOV_RBTC,
        RenderTradingPairName(Asset.SOV, Asset.RBTC),
        'SOV/RBTC',
        Asset.RBTC,
        Asset.SOV,
        [Asset.SOV, Asset.RBTC],
        false,
        true,
        false,
        2,
      ),
    ],
    [
      TradingPairType.SOV_XUSD,
      new TradingPair(
        TradingPairType.SOV_XUSD,
        RenderTradingPairName(Asset.SOV, Asset.XUSD),
        'SOV/XUSD',
        Asset.XUSD,
        Asset.SOV,
        [Asset.SOV, Asset.XUSD],
        false,
        true,
        false,
        2,
      ),
    ],
    [
      TradingPairType.SOV_BPRO,
      new TradingPair(
        TradingPairType.SOV_BPRO,
        RenderTradingPairName(Asset.SOV, Asset.BPRO),
        'SOV/BPRO',
        Asset.BPRO,
        Asset.SOV,
        [Asset.SOV, Asset.BPRO],
        false,
        true,
        false,
        2,
      ),
    ],
    [
      TradingPairType.SOV_DOC,
      new TradingPair(
        TradingPairType.SOV_DOC,
        RenderTradingPairName(Asset.SOV, Asset.DOC),
        'SOV/DOC',
        Asset.DOC,
        Asset.SOV,
        [Asset.SOV, Asset.DOC],
        false,
        true,
        false,
        2,
      ),
    ],
    [
      TradingPairType.BPRO_XUSD,
      new TradingPair(
        TradingPairType.BPRO_XUSD,
        RenderTradingPairName(Asset.BPRO, Asset.XUSD),
        'BPRO/XUSD',
        Asset.XUSD,
        Asset.BPRO,
        [Asset.BPRO, Asset.XUSD],
        false,
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
        true,
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
}

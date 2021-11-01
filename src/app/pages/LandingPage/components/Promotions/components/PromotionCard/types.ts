import { SpotPairType } from 'app/pages/SpotTradingPage/types';
import { Asset } from 'types';
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';

export enum AppSection {
  Lend = 'lend',
  Borrow = 'borrow',
  MarginTrade = 'marginTrade',
  YieldFarm = 'yieldFarm',
  Swap = 'swap',
  Spot = 'spot',
}

export enum PromotionColor {
  Turquoise = 'turquoise',
  Blue = 'blue',
  Yellow = 'yellow',
  LightGreen = 'lightGreen',
  DarkYellow = 'darkYellow',
  Green = 'green',
  Orange = 'orange',
  Pink = 'pink',
  DarkBlue = 'darkBlue',
  Purple = 'purple',
  Grey = 'grey',
}

export interface IPromotionLinkState {
  asset?: Asset;
  target?: Asset;
  marginTradingPair?: TradingPairType;
  spotTradingPair?: SpotPairType;
  perpetualPair?: PerpetualPairType;
}

import { Asset } from '../../../types';

// Defined by counting digits befor the comma +1 of the rounded price in dollar
export const AssetDecimals: { [key in Asset]: number } = {
  CSOV: 2,
  RBTC: 6,
  WRBTC: 6,
  BTCS: 6,
  ETH: 5,
  DOC: 2,
  RDOC: 2,
  USDT: 2,
  XUSD: 2,
  BPRO: 6,
  SOV: 3,
  MOC: 1,
  BNBS: 4,
  FISH: 1,
  PERPETUALS: 2,
  RIF: 2,
  MYNT: 2,
};

export enum AssetValueMode {
  predefined = 'predefined',
  auto = 'auto',
}

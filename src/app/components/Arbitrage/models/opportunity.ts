import type { Asset } from 'types';

export interface Opportunity {
  fromToken: Asset;
  toToken: Asset;
  fromAmount: number;
  toAmount: number;
  earn: number;
  earnUsd: number;
}

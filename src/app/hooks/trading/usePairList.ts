import { IPairs } from 'types/trading-pairs';

export const usePairList = (pairs: IPairs) => {
  if (!pairs) {
    return [];
  }
  return Object.keys(pairs)
    .map(key => pairs[key])
    .filter(pair => {
      return pair;
    });
};

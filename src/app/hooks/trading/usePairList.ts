import { IPairData } from 'types/trading-pairs';

export const usePairList = (pairs: IPairData[]) => {
  if (!pairs) {
    return [];
  }

  return Object.keys(pairs)
    .map(key => pairs[key])
    .filter((pair: IPairData) => {
      return pair;
    });
};

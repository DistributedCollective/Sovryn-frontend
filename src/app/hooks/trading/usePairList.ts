import { IPairData } from 'types/trading-pairs';
import { isMainnet, isStaging } from 'utils/classifiers';

// XUSD_legacy, cannot use getContract because we don't have a mainnet contract for it
const deprecatedPair = '0x74858FE37d391f81F89472e1D8BC8Ef9CF67B3b1'.toLowerCase();

export const usePairList = (pairs: IPairData[]) => {
  if (!pairs) {
    return [];
  }

  const pairList = Object.keys(pairs)
    .map(key => pairs[key])
    .filter((pair: IPairData) => {
      return pair;
    });

  return isMainnet || isStaging
    ? pairList
    : pairList.filter(
        pair =>
          pair.base_id.toLowerCase() !== deprecatedPair &&
          pair.quote_id.toLowerCase() !== deprecatedPair,
      );
};

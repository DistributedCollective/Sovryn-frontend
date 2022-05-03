import { Asset } from 'types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getTokenContract } from '../contract-helpers';
import { normalizeWei } from '../math-helpers';

export const getPriceAmm = async (
  sourceAsset: Asset,
  targetAsset: Asset,
  weiAmount: string,
) => {
  const path = await contractReader.call('swapNetwork', 'conversionPath', [
    getTokenContract(sourceAsset).address,
    getTokenContract(targetAsset).address,
  ]);
  return contractReader
    .call('swapNetwork', 'rateByPath', [path, normalizeWei(weiAmount)])
    .then(response => response.toString());
};

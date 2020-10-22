import { contractReader } from 'utils/sovryn/contract-reader';
import { contractWriter } from '../../../utils/sovryn/contract-writer';
import { AssetsDictionary } from '../../../utils/blockchain/assets-dictionary';
import { Asset } from '../../../types/asset';

export async function getConversionPath(
  sourceToken: string,
  targetToken: string,
) {
  return contractReader.call('swapNetwork', 'conversionPath', [
    sourceToken,
    targetToken,
  ]);
}

export async function getRateByPath(path: string[], amount: string) {
  return contractReader.call('swapNetwork', 'rateByPath', [path, amount]);
}

export async function convertByPath(
  path: string[],
  amount: string,
  minReturn: string,
  beneficiary: string,
) {
  return contractWriter.send(
    'swapNetwork',
    'convertByPath',
    [path, amount, minReturn, beneficiary, 0, 0],
    {
      from: beneficiary,
      value:
        AssetsDictionary.getByTokenContractAddress(path[0]).asset === Asset.BTC
          ? amount
          : '0',
    },
  );
}

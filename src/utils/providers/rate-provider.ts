import { Asset } from '../../types/asset';
import { contractReader } from '../sovryn/contract-reader';
import { getTokenContract } from '../blockchain/contract-helpers';
import { bignumber } from 'mathjs';

interface Paths {
  [key: string]: string[];
}

export class RateProvider {
  private cachedPaths: Paths = {};

  public async getPath(source: Asset, target: Asset) {
    const key = `${source}_${target}`;
    if (
      !this.cachedPaths.hasOwnProperty(key) ||
      !this.cachedPaths[key].length
    ) {
      this.cachedPaths[key] = await contractReader.call(
        'swapNetwork',
        'conversionPath',
        [getTokenContract(source).address, getTokenContract(target).address],
      );
    }
    return this.cachedPaths[key];
  }

  public async priceByPath(path: string[], weiAmount: string) {
    return await contractReader.call('swapNetwork', 'rateByPath', [
      path,
      weiAmount,
    ]);
  }

  public async getPrice(source: Asset, target: Asset, weiAmount: string) {
    const path = await this.getPath(source, target);
    const price = await this.priceByPath(path, weiAmount);
    return bignumber(price as string).toFixed();
  }

  public async getRate(source: Asset, target: Asset, weiAmount: string) {
    const price = await this.getPrice(source, target, weiAmount);
    return await contractReader.call('priceFeed', 'checkPriceDisagreement', [
      getTokenContract(source).address,
      getTokenContract(target).address,
      weiAmount,
      bignumber(price).toFixed(),
      bignumber(500)
        .mul(10 ** 18)
        .toFixed(),
    ]);
  }
}

export const rateProvider = new RateProvider();

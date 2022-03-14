import { bignumber } from 'mathjs';
import { Asset } from '../../types';
import { contractReader } from '../sovryn/contract-reader';
import { getTokenContract } from '../blockchain/contract-helpers';

export class RateProvider {
  public async getPrice(source: Asset, target: Asset, weiAmount: string) {
    const price = await contractReader.call(
      'sovrynProtocol',
      'getSwapExpectedReturn',
      [
        getTokenContract(source).address,
        getTokenContract(target).address,
        weiAmount,
      ],
    );
    return bignumber(price as string).toFixed();
  }

  public async getDisagreementRate(
    source: Asset,
    target: Asset,
    weiAmount: string,
  ) {
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

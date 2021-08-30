import { toWei } from 'web3-utils';

class GasPrice {
  private gasPrice: string = toWei('0.066', 'gwei');

  public set(weiAmount: string): void {
    this.gasPrice = weiAmount;
  }

  public get(): string {
    return this.gasPrice;
  }
  public toString() {
    return this.get();
  }
}

export const gas = new GasPrice();

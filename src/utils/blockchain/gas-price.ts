import { toWei } from 'web3-utils';

class GasPrice {
  private gasPrice: string = toWei('0.066', 'gwei');
  public set(amountInGwei: string): void {
    this.gasPrice = amountInGwei;
  }
  public get(): string {
    return this.gasPrice;
  }
  public toString() {
    return this.get();
  }
}

export const gas = new GasPrice();

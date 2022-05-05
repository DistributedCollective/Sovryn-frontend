import { toWei } from 'web3-utils';
import { isMainnet } from '../classifiers';

class TransferApproveAmount {
  private isUnlimited: boolean = isMainnet;
  public set(unlimited: boolean): void {
    this.isUnlimited = unlimited;
  }
  public get(amount: string): string {
    if (this.isUnlimited) {
      return toWei('10000000000');
    }
    return amount;
  }
}

export const transferAmount = new TransferApproveAmount();

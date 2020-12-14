export class ApproveAmount {
  private amount: string = '0';

  public set(amount: string) {
    this.amount = amount;
  }

  public get(amount: string) {
    if (this.amount === '0') {
      return amount;
    }
    return amount;
  }
}

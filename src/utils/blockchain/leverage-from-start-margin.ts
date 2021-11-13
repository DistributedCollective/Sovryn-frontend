import { bignumber } from 'mathjs';

export function leverageFromMargin(startMargin: string) {
  return Number(
    bignumber(10 ** 38)
      .div(bignumber(startMargin).times(10 ** 18))
      .plus(1)
      .toDP(0, 4)
      .toString(),
  );
}

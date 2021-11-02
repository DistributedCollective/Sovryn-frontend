import { usePerpetual_marginAccountBalance } from './usePerpetual_marginAccountBalance';
import { usePerpetual_openTrade } from './usePerpetual_openTrade';
import { usePerpetual_withdrawMarginToken } from './usePerpetual_withdrawMarginToken';

export const usePerpetual_closePosition = () => {
  const marginAccountBalance = usePerpetual_marginAccountBalance();

  const { trade, ...rest } = usePerpetual_openTrade();
  const { withdraw } = usePerpetual_withdrawMarginToken();

  return {
    closePosition: async () => {
      if (marginAccountBalance.fPositionBC === 0) {
        return;
      }
      await trade(
        String(marginAccountBalance.fCashCC),
        String(-1 * marginAccountBalance.fPositionBC),
      );

      await withdraw(String(marginAccountBalance.fCashCC));
    },
    ...rest,
  };
};

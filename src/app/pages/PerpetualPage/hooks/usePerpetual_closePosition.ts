import { usePerpetual_openTrade } from './usePerpetual_openTrade';
import { usePerpetual_withdrawAll } from './usePerpetual_withdrawAll';

export const usePerpetual_closePosition = () => {
  const { trade, ...rest } = usePerpetual_openTrade();
  const { withdraw } = usePerpetual_withdrawAll();

  return {
    closePosition: async () => {
      await trade(true);
      await withdraw();
    },
    ...rest,
  };
};

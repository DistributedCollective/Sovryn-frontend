import { usePerpetual_openTrade } from './usePerpetual_openTrade';

export const usePerpetual_closePosition = () => {
  const { trade, ...rest } = usePerpetual_openTrade();

  return {
    closePosition: async () => {
      await trade(true);
    },
    ...rest,
  };
};

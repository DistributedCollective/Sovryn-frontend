import { bignumber } from 'mathjs';

type PercentageDistribution = {
  lendingPercentage: number;
  tradingPercentage: number;
  liquidityPercentage: number;
};

export const calculatePercentageDistribution = (
  lendingTotal: string,
  tradingTotal: string,
  liquidityTotal: string,
): PercentageDistribution => {
  const total = bignumber(lendingTotal).add(tradingTotal).add(liquidityTotal);

  return {
    lendingPercentage: bignumber(lendingTotal).div(total).mul(100).toNumber(),
    tradingPercentage: bignumber(tradingTotal).div(total).mul(100).toNumber(),
    liquidityPercentage: bignumber(liquidityTotal)
      .div(total)
      .mul(100)
      .toNumber(),
  };
};

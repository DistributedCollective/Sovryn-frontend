import { bignumber } from 'mathjs';
import { IPairData } from 'types/trading-pairs';

export const getPercentageChange = (
  currentPrice: number,
  prevPrice: number,
) => {
  const diff = currentPrice - prevPrice;
  if (diff === 0) {
    return 0;
  }
  return (diff / prevPrice) * 100;
};

export const getLastPrice = (
  pair0: IPairData,
  pair1: IPairData,
  RBTC_source: string,
) => {
  //generating lastPrice for all pairs
  let lastPrice = 0;
  //for pairs without RBTC
  if (pair1 !== pair0) {
    lastPrice = pair0.last_price / pair1.last_price;
  }
  //for pairs with RBTC as source
  if (RBTC_source) {
    lastPrice = 1 / pair0.last_price;
  }
  //for pairs with RBTC as target
  if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
    lastPrice = pair0.last_price;
  }
  return lastPrice;
};

export const getPercent = (
  pair0: IPairData,
  pair1: IPairData,
  RBTC_source: string,
) => {
  // //for pairs with RBTC as source
  if (RBTC_source) {
    const percent = bignumber(0).minus(pair0.price_change_percent_24h);
    return percent.toFixed(18);
  }

  // for pairs with RBTC as target
  if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
    const percent = pair0.price_change_percent_24h;
    return percent;
  }

  if (pair1 !== pair0) {
    const lastPrice = bignumber(pair0.last_price).div(
      bignumber(pair1.last_price),
    );
    const dayPrice = bignumber(pair0.day_price).div(bignumber(pair1.day_price));
    const percent = getPercentageChange(Number(lastPrice), Number(dayPrice));
    return parseFloat(percent.toFixed(18));
  }

  return 0;
};

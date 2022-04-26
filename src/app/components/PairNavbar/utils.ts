import { IPairData } from 'types/trading-pairs';

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

export const getDayPrice = (
  pair0: IPairData,
  pair1: IPairData,
  RBTC_source: string,
) => {
  //generating dayPrice for all pairs
  let dayPrice = 0;
  //for pairs without RBTC
  if (pair1 !== pair0) {
    dayPrice = pair0.day_price / pair1.day_price;
  }
  //for pairs with RBTC as source
  if (RBTC_source) {
    dayPrice = 1 / pair0.day_price;
  }
  //for pairs with RBTC as target
  if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
    dayPrice = pair0.day_price;
  }
  return dayPrice;
};

export const getPercent = (
  pair0: IPairData,
  pair1: IPairData,
  RBTC_source: string,
) => {
  const lastPrice = getLastPrice(pair0, pair1, RBTC_source);
  const dayPrice = getDayPrice(pair0, pair1, RBTC_source);

  //generating dayPrice for all pairs
  let percent = 0;
  //for pairs without RBTC
  if (pair1 !== pair0) {
    if (lastPrice > dayPrice) {
      percent = ((lastPrice - dayPrice) / dayPrice) * 100;
    } else if (lastPrice < dayPrice) {
      percent = ((lastPrice - dayPrice) / lastPrice) * 100;
    }
  }
  //for pairs with RBTC as source
  if (RBTC_source) {
    percent =
      pair0.price_change_percent_24h !== 0
        ? -pair0.price_change_percent_24h
        : pair0.price_change_percent_24h;
  }
  //for pairs with RBTC as target
  if (pair0.base_symbol === pair1.base_symbol && !RBTC_source) {
    percent = pair0.price_change_percent_24h;
  }
  return percent;
};

import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { BigNumber } from 'ethers';
import { LeaderboardData } from '../../types';

export const RANKING_START_TIMESTAMP = '1659312000'; // 12/07/2022 00:00:00
export const HIGHEST_PROFIT_START_TIMESTAMP = '1659312000'; // 12/07/2022 00:00:00 , TODO: Delete this once we have total volume and total trades count on traderState
export const LAST_RESET_OF_RANKING = '01/08/2022, 12am UTC';

export const readTraderVolume = data => {
  const result = data.map(item => {
    const traderVolume = item.trades.reduce(
      (result, item) =>
        result + Math.abs(ABK64x64ToFloat(BigNumber.from(item.tradeAmountBC))),
      0,
    );

    return [item.id, traderVolume];
  });
  return result
    .sort((a, b) => b[1] - a[1])
    .map((item, index) => ({
      trader: item[0],
      volume: item[1],
      rank: index + 1,
    }));
};

export const mostTrades = data =>
  data
    .map(item => [item.id, item.trades.length])
    .sort((a, b) => b[1] - a[1])
    .map((item, index) => ({
      trader: item[0],
      trades: item[1],
      rank: index + 1,
    }));

export const getBestPnl = (historicData, currentData) => {
  const historicPnLs = historicData.map(item => ({
    trader: item.id,
    profit: ABK64x64ToFloat(BigNumber.from(item.traderStates[0].totalPnLCC)),
  }));

  const currentPnLs = currentData.map(item => ({
    trader: item.id,
    profit: ABK64x64ToFloat(BigNumber.from(item.traderStates[0].totalPnLCC)),
  }));

  if (!historicData) {
    return currentPnLs;
  }

  return currentPnLs.map(item => {
    const historicPnL = historicPnLs.find(
      historicItem => historicItem.trader === item.trader,
    );

    return {
      trader: item.trader,
      profit: item.profit - (historicPnL?.profit || 0),
    };
  });
};

export const getProfitClassName = (value: number) => {
  if (value > 0) {
    return 'tw-text-trade-long';
  } else if (value < 0) {
    return 'tw-text-trade-short';
  }
  return 'tw-sov-white';
};

// This is here for later use
export const calculatePotentialPrizes = (
  traders: LeaderboardData[],
  ammProfit: number,
): number[] => {
  const firstTraderPnl =
    traders.find(trader => trader.rank === '1')?.totalPnL || 0;
  const secondTraderPnl =
    traders.find(trader => trader.rank === '2')?.totalPnL || 0;
  const thirdTraderPnl =
    traders.find(trader => trader.rank === '3')?.totalPnL || 0;
  const totalTradersPnl = firstTraderPnl + secondTraderPnl + thirdTraderPnl;

  return [
    (firstTraderPnl / totalTradersPnl) * ammProfit,
    (secondTraderPnl / totalTradersPnl) * ammProfit,
    (thirdTraderPnl / totalTradersPnl) * ammProfit,
  ];
};

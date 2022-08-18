import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { BigNumber } from 'ethers';
import { bscScanApi, isMainnet, isStaging } from 'utils/classifiers';
import { LeaderboardData } from '../../types';

dayjs.extend(utc);

export const RANKING_START_TIMESTAMP = '1659312000'; // 01/08/2022 12am UTC
export const RANKING_START_BLOCK_NUMBER =
  isMainnet || isStaging ? '20045095' : '21555752'; // 01/08/2022 12am UTC , IMPORTANT: This needs to be changed every time that RANKING_START_TIMESTAMP changes, go to useGetTimeRestrictedData.ts and fetch it there for both mainnet and testnet.

export const LAST_RESET_OF_RANKING = dayjs
  .unix(Number(RANKING_START_TIMESTAMP))
  .utc()
  .format('DD/MM/YYYY[, ]ha [UTC]');

export const timestampConvertUrl = `${bscScanApi}/api?module=block&action=getblocknobytime&timestamp=${RANKING_START_TIMESTAMP}&closest=before&apikey=${process.env.REACT_APP_BSC_API_KEY}`;

export const getMostTrades = (historicData, currentData) => {
  const historicTrades = historicData.map(item => ({
    trader: item.id,
    trades: item.traderStates[0].tradesTotalCount,
  }));

  const currentTrades = currentData.map(item => ({
    trader: item.id,
    trades: item.traderStates[0].tradesTotalCount,
  }));

  if (!historicData) {
    return currentTrades;
  }

  return currentTrades.map(item => {
    const historicTrade = historicTrades.find(
      historicItem => historicItem.trader === item.trader,
    );

    return {
      trader: item.trader,
      trades: item.trades - (historicTrade?.trades || 0),
    };
  });
};

export const getTraderVolume = (historicData, currentData) => {
  const historicVolumes = historicData.map(item => ({
    trader: item.id,
    volume: ABK64x64ToFloat(
      BigNumber.from(item.traderStates[0].totalAmountTraded),
    ),
  }));

  const currentVolumes = currentData.map(item => ({
    trader: item.id,
    volume: ABK64x64ToFloat(
      BigNumber.from(item.traderStates[0].totalAmountTraded),
    ),
  }));

  if (!historicData) {
    return currentVolumes;
  }

  return currentVolumes.map(item => {
    const historicVolume = historicVolumes.find(
      historicItem => historicItem.trader === item.trader,
    );

    return {
      trader: item.trader,
      volume: item.volume - (historicVolume?.volume || 0),
    };
  });
};

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

import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { BigNumber } from 'ethers';

export const readTraderVolume = data => {
  const result = data.map(item => {
    const traderVolume = item.trades.reduce(
      (result, item) =>
        result + Math.abs(ABK64x64ToFloat(BigNumber.from(item.tradeAmountBC))),
      0,
    );

    return [item.id, traderVolume];
  });
  return result.sort((a, b) => b[1] - a[1]);
};

export const mostTrades = data =>
  data.map(item => [item.id, item.trades.length]).sort((a, b) => b[1] - a[1]);

export const readBestPnL = data => {
  const pnlMap = new Map<string, number>();

  data.forEach(item => {
    const address = item.trader.id;
    const pnl = ABK64x64ToFloat(BigNumber.from(item.pnlCC));
    const currentPnl = pnlMap.get(address);
    const pnlResult = currentPnl === undefined ? pnl : pnl + currentPnl;
    pnlMap.set(address, pnlResult);
  });

  const addresses = Array.from(pnlMap.keys());
  const resultArray: Array<[string, number]> = [];

  addresses.forEach(item => {
    resultArray.push([item, pnlMap.get(item) || 0]);
  });
  return resultArray.sort((a, b) => b[1] - a[1]);
};

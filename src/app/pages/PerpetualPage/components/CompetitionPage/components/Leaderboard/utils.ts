// ts-node graphQLPnL/processQueries.js
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { BigNumber } from 'ethers';

export function readTraderVolume(queryJson) {
  // largest total notional volume traded
  if (queryJson === undefined) {
    return [];
  }

  let data = queryJson['traders'];
  let numTraders = Object.keys(data).length;
  let traderVolume: Array<[string, number]> = [];
  for (var k = 0; k < numTraders; k++) {
    let trades = data[k].trades;
    let totalVol = 0;
    for (var j = 0; j < trades.length; j++) {
      totalVol += Math.abs(
        ABK64x64ToFloat(BigNumber.from(trades[j].tradeAmountBC)),
      );
    }
    traderVolume[k] = [data[k].id, totalVol];
  }
  // sort according to decreasing volume
  traderVolume.sort((n1, n2) => n2[1] - n1[1]);
  return traderVolume;
}

export function mostTrades(queryJson) {
  // most trades
  if (queryJson === undefined) {
    return [];
  }

  let data = queryJson['traders'];
  let numTraders = Object.keys(data).length;
  let traderTrades: Array<[string, number]> = [];
  for (var k = 0; k < numTraders; k++) {
    let trades = data[k].trades;
    let totalTradeCount = trades.length;
    traderTrades[k] = [data[k].id, totalTradeCount];
  }
  // sort according to decreasing trade counts
  traderTrades.sort((n1, n2) => n2[1] - n1[1]);
  return traderTrades;
}

export function readBestPnL(queryJson) {
  // trader address with best realized PnL
  if (queryJson === undefined) {
    return [];
  }

  let data = queryJson['realizedPnLs'];
  let numPnLEvents = Object.keys(data).length;
  // map trader-address -> PnL
  let pnlMap = new Map<string, number>();
  for (var k = 0; k < numPnLEvents; k++) {
    let address = data[k].trader.id;
    let pnl = ABK64x64ToFloat(BigNumber.from(data[k].pnlCC));
    let pnlOld = pnlMap.get(address);
    let pnlTot = pnlOld === undefined ? pnl : pnl + pnlOld;
    pnlMap.set(address, pnlTot);
  }
  // create array and sort according to pnl
  let addr = Array.from(pnlMap.keys());
  let traderPnLs: Array<[string, number]> = [];
  for (var k = 0; k < addr.length; k++) {
    let pnl = pnlMap.get(addr[k]);
    let pnlC = pnl === undefined ? 0 : pnl;
    traderPnLs[k] = [addr[k], pnlC];
  }
  traderPnLs.sort((n1, n2) => n2[1] - n1[1]);
  return traderPnLs;
}

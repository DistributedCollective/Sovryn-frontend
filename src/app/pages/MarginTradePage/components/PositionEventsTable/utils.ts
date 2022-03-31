import { bignumber } from 'mathjs';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { TradingPairDictionary } from 'utils/dictionaries/trading-pair-dictionary';
import { PositionEvent } from '.';
import { LoanEvent } from '../OpenPositionsTable/hooks/useMargin_getLoanEvents';

export const getTradeEventData = (
  item: LoanEvent,
  isLong: boolean,
): PositionEvent => {
  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const price = isLong
    ? item.collateralToLoanRate
    : toWei(
        bignumber(1)
          .div(item.collateralToLoanRate)
          .mul(10 ** 18)
          .toString(),
      );

  return {
    event: item.event,
    positionChange: item.positionSizeChange,
    price,
    positionAsset: collateralAsset,
    collateralAsset: pair.longAsset,
    time: item.time,
    txHash: item.txHash,
  };
};

export const getDepositEventData = (
  item: LoanEvent,
  isLong: boolean,
): PositionEvent => {
  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  return {
    event: item.event,
    positionChange: item.positionSizeChange,
    price: undefined!,
    positionAsset: collateralAsset,
    collateralAsset: pair.longAsset,
    time: item.time,
    txHash: item.txHash,
  };
};

export const getLiquidateEventData = (
  item: LoanEvent,
  isLong: boolean,
): PositionEvent => {
  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const price = isLong
    ? item.collateralToLoanRate
    : toWei(
        bignumber(1)
          .div(item.collateralToLoanRate)
          .mul(10 ** 18)
          .toString(),
      );

  return {
    event: item.event,
    positionChange: item.positionSizeChange,
    price,
    positionAsset: collateralAsset,
    collateralAsset: pair.longAsset,
    time: item.time,
    txHash: item.txHash,
    positionSubtracted: true,
  };
};

export const getCloseEventData = (
  item: LoanEvent,
  isLong: boolean,
): PositionEvent => {
  const loanAsset = assetByTokenAddress(item.loanToken);
  const collateralAsset = assetByTokenAddress(item.collateralToken);
  const pair = TradingPairDictionary.findPair(loanAsset, collateralAsset);

  const price = isLong
    ? item.collateralToLoanRate
    : toWei(
        bignumber(1)
          .div(item.collateralToLoanRate)
          .mul(10 ** 18)
          .toString(),
      );
  return {
    event: item.event,
    positionChange: item.positionSizeChange,
    price,
    positionAsset: collateralAsset,
    collateralAsset: pair.longAsset,
    time: item.time,
    txHash: item.txHash,
    positionSubtracted: true,
  };
};

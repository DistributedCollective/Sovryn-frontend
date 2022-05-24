import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  getTraderLeverage,
  calculateResultingPositionLeverage,
  calculateApproxLiquidationPrice,
  calculateLeverage,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { roundToLot } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { selectPerpetualPage } from '../selectors';
import { PerpetualTrade, PerpetualTradeType } from '../types';
import { getSignedAmount } from '../utils/contractUtils';

type ResultingPositionData = {
  leverage: number;
  size: number;
  estimatedLiquidationPrice: number;
  estimatedMargin: number;
};

export const usePerpetual_calculateResultingPosition = (
  trade?: PerpetualTrade,
): ResultingPositionData => {
  const { pairType } = useSelector(selectPerpetualPage);
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const signedOrderSize = useMemo(
    () => (trade?.amount ? getSignedAmount(trade.position, trade.amount) : 0),
    [trade?.amount, trade?.position],
  );

  const { perpetuals } = useContext(PerpetualQueriesContext);
  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
    lotSize,
  } = perpetuals[pair.id];

  const size = useMemo(
    () =>
      roundToLot(
        signedOrderSize + traderState.marginAccountPositionBC,
        lotSize || 1,
      ),
    [signedOrderSize, traderState.marginAccountPositionBC, lotSize],
  );

  const leverage = useMemo(() => {
    if (!trade) {
      return 0;
    }

    // trader doesn't have an open position or is flipping their position direction
    if (!traderState.marginAccountPositionBC) {
      return trade.leverage;
    }

    // trader wants to keep their position leverage and is reducing their position
    if (
      trade.keepPositionLeverage &&
      Math.sign(signedOrderSize) !==
        Math.sign(traderState.marginAccountPositionBC) &&
      Math.abs(signedOrderSize) <=
        Math.abs(traderState.marginAccountPositionBC) &&
      trade.tradeType === PerpetualTradeType.MARKET
    ) {
      return getTraderLeverage(traderState, ammState);
    }

    if (trade.margin) {
      return calculateLeverage(
        size,
        traderState.availableCashCC + numberFromWei(trade.margin),
        traderState,
        ammState,
        perpParameters,
        trade.slippage,
      );
    }

    return calculateResultingPositionLeverage(
      traderState,
      ammState,
      perpParameters,
      signedOrderSize,
      trade.leverage,
      trade.slippage,
      trade.keepPositionLeverage,
    );
  }, [trade, signedOrderSize, traderState, ammState, perpParameters, size]);

  const estimatedMargin = useMemo(
    () =>
      trade?.margin
        ? numberFromWei(trade.margin) + traderState.availableCashCC
        : Math.abs(size) / leverage,
    [trade?.margin, leverage, size, traderState.availableCashCC],
  );

  const estimatedLiquidationPrice = useMemo(() => {
    return size === 0
      ? 0
      : calculateApproxLiquidationPrice(
          traderState,
          ammState,
          perpParameters,
          signedOrderSize,
          estimatedMargin - traderState.availableCashCC,
        );
  }, [
    size,
    signedOrderSize,
    estimatedMargin,
    ammState,
    perpParameters,
    traderState,
  ]);

  return {
    leverage,
    size,
    estimatedLiquidationPrice,
    estimatedMargin,
  };
};

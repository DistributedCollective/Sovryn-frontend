import {
  getTraderLeverage,
  calculateResultingPositionLeverage,
  calculateApproxLiquidationPrice,
} from '@sovryn/perpetual-swap/dist/scripts/utils/perpUtils';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { selectPerpetualPage } from '../selectors';
import { PerpetualTrade, PerpetualTradeType } from '../types';
import { getSignedAmount } from '../utils/contractUtils';
import { getRequiredMarginCollateralWithGasFees } from '../utils/perpUtils';

type ResultingPositionData = {
  leverage: number;
  size: number;
  estimatedLiquidationPrice: number;
  estimatedMargin: number;
};

export const usePerpetual_calculateResultingPosition = (
  trade?: PerpetualTrade,
): ResultingPositionData => {
  const { pairType, useMetaTransactions } = useSelector(selectPerpetualPage);
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
  } = perpetuals[pair.id];

  const size = useMemo(
    () => signedOrderSize + traderState.marginAccountPositionBC,
    [signedOrderSize, traderState.marginAccountPositionBC],
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

    return calculateResultingPositionLeverage(
      traderState,
      ammState,
      perpParameters,
      signedOrderSize,
      trade.leverage,
      trade.slippage,
      trade.keepPositionLeverage,
    );
  }, [ammState, perpParameters, signedOrderSize, trade, traderState]);

  const estimatedLiquidationPrice = useMemo(() => {
    const requiredCollateral = getRequiredMarginCollateralWithGasFees(
      leverage,
      signedOrderSize,
      perpParameters,
      ammState,
      traderState,
      trade?.slippage,
      useMetaTransactions,
      true,
      true,
    );

    return calculateApproxLiquidationPrice(
      traderState,
      ammState,
      perpParameters,
      signedOrderSize,
      requiredCollateral,
    );
  }, [
    ammState,
    leverage,
    perpParameters,
    signedOrderSize,
    trade?.slippage,
    traderState,
    useMetaTransactions,
  ]);

  const estimatedMargin = useMemo(() => {
    const tradeMargin = trade?.margin
      ? numberFromWei(trade.margin) + traderState.availableCashCC
      : Math.abs(size) / leverage;

    return tradeMargin;
  }, [trade?.margin, leverage, size, traderState.availableCashCC]);

  return {
    leverage,
    size,
    estimatedLiquidationPrice,
    estimatedMargin,
  };
};

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
  liquidationPrice: number;
  size: number;
  margin: number;
};

export const usePerpetual_calculateResultingPosition = (
  trade: PerpetualTrade,
  keepPositionLeverage: boolean = false,
): ResultingPositionData => {
  const { pairType, useMetaTransactions } = useSelector(selectPerpetualPage);
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const signedOrderSize = useMemo(
    () => getSignedAmount(trade.position, trade.amount),
    [trade.amount, trade.position],
  );

  const { perpetuals } = useContext(PerpetualQueriesContext);
  const {
    ammState,
    traderState,
    perpetualParameters: perpParameters,
  } = perpetuals[pair.id];

  const leverage = useMemo(() => {
    // trader doesn't have an open position
    if (!traderState.marginAccountPositionBC) {
      return trade.leverage;
    }

    if (keepPositionLeverage && trade.tradeType === PerpetualTradeType.MARKET) {
      return getTraderLeverage(traderState, ammState);
    }

    return calculateResultingPositionLeverage(
      traderState,
      ammState,
      perpParameters,
      signedOrderSize,
      trade.leverage,
      trade.slippage,
    );
  }, [
    ammState,
    keepPositionLeverage,
    perpParameters,
    signedOrderSize,
    trade.leverage,
    trade.slippage,
    trade.tradeType,
    traderState,
  ]);

  const liquidationPrice = useMemo(() => {
    const requiredCollateral = getRequiredMarginCollateralWithGasFees(
      leverage,
      signedOrderSize,
      perpParameters,
      ammState,
      traderState,
      trade.slippage,
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
    trade.slippage,
    traderState,
    useMetaTransactions,
  ]);

  const size = useMemo(
    () => signedOrderSize + traderState.marginAccountPositionBC,
    [signedOrderSize, traderState.marginAccountPositionBC],
  );

  const margin = useMemo(() => {
    const tradeMargin = trade.margin
      ? numberFromWei(trade.margin)
      : Math.abs(numberFromWei(trade.amount)) / trade.leverage;

    return tradeMargin + traderState.availableCashCC;
  }, [trade.amount, trade.leverage, trade.margin, traderState.availableCashCC]);

  return {
    leverage,
    liquidationPrice,
    size,
    margin,
  };
};

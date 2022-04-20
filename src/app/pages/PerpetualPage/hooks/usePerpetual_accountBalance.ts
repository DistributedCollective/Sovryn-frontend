import { useContext, useMemo } from 'react';
import {
  numberFromWei,
  toWei,
} from '../../../../utils/blockchain/math-helpers';
import { bignumber } from 'mathjs';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { perpUtils } from '@sovryn/perpetual-swap';
import { usePerpetual_getCurrentPairId } from './usePerpetual_getCurrentPairId';

const { getTraderPnLInCC, getQuote2CollateralFX } = perpUtils;

type AccountBalance = {
  total: {
    collateralValue: string;
    quoteValue: string;
  };
  available: string;
  inPositions: string;
  unrealized: string;
};

export const usePerpetual_accountBalance = (): AccountBalance => {
  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const {
    ammState,
    traderState,
    perpetualParameters,
    availableBalance,
  } = perpetuals[currentPairId];

  const unrealizedPnl = useMemo(
    () => getTraderPnLInCC(traderState, ammState, perpetualParameters),
    [ammState, perpetualParameters, traderState],
  );

  const inPosition = traderState.availableCashCC;

  const totalCollateralValue = useMemo(
    () => bignumber(availableBalance).add(toWei(inPosition)).toString(),
    [availableBalance, inPosition],
  );

  const totalQuoteValue = useMemo(
    () =>
      toWei(
        numberFromWei(totalCollateralValue) / getQuote2CollateralFX(ammState),
      ),
    [ammState, totalCollateralValue],
  );

  return useMemo(
    () => ({
      total: {
        collateralValue: totalCollateralValue,
        quoteValue: totalQuoteValue,
      },
      available: availableBalance,
      inPositions: toWei(inPosition),
      unrealized: toWei(unrealizedPnl),
    }),
    [
      totalCollateralValue,
      totalQuoteValue,
      availableBalance,
      inPosition,
      unrealizedPnl,
    ],
  );
};

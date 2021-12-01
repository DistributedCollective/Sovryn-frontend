import React, { createContext, useMemo } from 'react';
import {
  initialAmmState,
  usePerpetual_queryAmmState,
} from '../hooks/usePerpetual_queryAmmState';
import {
  initialLiqPoolState,
  usePerpetual_queryLiqPoolStateFromPerpetualId,
} from '../hooks/usePerpetual_queryLiqPoolStateFromPerpetualId';
import {
  initialPerpParameters,
  usePerpetual_queryPerpParameters,
} from '../hooks/usePerpetual_queryPerpParameters';
import {
  initialTraderState,
  usePerpetual_queryTraderState,
} from '../hooks/usePerpetual_queryTraderState';
import {
  AMMState,
  LiqPoolState,
  PerpParameters,
  TraderState,
} from '../utils/perpUtils';

type PerpetualQueriesContextValue = {
  ammState: AMMState;
  perpetualParameters: PerpParameters;
  traderState: TraderState;
  liquidityPoolState: LiqPoolState;
};

export const PerpetualQueriesContext = createContext<
  PerpetualQueriesContextValue
>({
  ammState: initialAmmState,
  perpetualParameters: initialPerpParameters,
  traderState: initialTraderState,
  liquidityPoolState: initialLiqPoolState,
});

export const PerpetualQueriesContextProvider: React.FC = ({ children }) => {
  const ammState = usePerpetual_queryAmmState();
  const perpetualParameters = usePerpetual_queryPerpParameters();
  const traderState = usePerpetual_queryTraderState();
  const liquidityPoolState = usePerpetual_queryLiqPoolStateFromPerpetualId();

  const value = useMemo(
    () => ({
      ammState,
      perpetualParameters,
      traderState,
      liquidityPoolState,
    }),
    [ammState, liquidityPoolState, perpetualParameters, traderState],
  );

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

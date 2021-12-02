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
  getDepthMatrix,
  LiqPoolState,
  PerpParameters,
  TraderState,
} from '../utils/perpUtils';

type PerpetualQueriesContextValue = {
  ammState: AMMState;
  perpetualParameters: PerpParameters;
  traderState: TraderState;
  liquidityPoolState: LiqPoolState;
  depthMatrixEntries: any[][];
};

export const PerpetualQueriesContext = createContext<
  PerpetualQueriesContextValue
>({
  ammState: initialAmmState,
  perpetualParameters: initialPerpParameters,
  traderState: initialTraderState,
  liquidityPoolState: initialLiqPoolState,
  depthMatrixEntries: [],
});

export const PerpetualQueriesContextProvider: React.FC = ({ children }) => {
  const ammState = usePerpetual_queryAmmState();
  const perpetualParameters = usePerpetual_queryPerpParameters();
  const traderState = usePerpetual_queryTraderState();
  const liquidityPoolState = usePerpetual_queryLiqPoolStateFromPerpetualId();
  const depthMatrixEntries = getDepthMatrix(perpetualParameters, ammState);

  const value = useMemo(
    () => ({
      ammState,
      perpetualParameters,
      traderState,
      liquidityPoolState,
      depthMatrixEntries,
    }),
    [
      ammState,
      depthMatrixEntries,
      liquidityPoolState,
      perpetualParameters,
      traderState,
    ],
  );

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

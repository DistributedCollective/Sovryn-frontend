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
  averagePrice: number;
};

export const PerpetualQueriesContext = createContext<
  PerpetualQueriesContextValue
>({
  ammState: initialAmmState,
  perpetualParameters: initialPerpParameters,
  traderState: initialTraderState,
  liquidityPoolState: initialLiqPoolState,
  depthMatrixEntries: [],
  averagePrice: 0,
});

const getAveragePrice = (depthMatrixEntries: any[][]): number => {
  if (depthMatrixEntries && depthMatrixEntries.length >= 3) {
    const averagePriceIndex = depthMatrixEntries[1].indexOf(0);
    return depthMatrixEntries[0][averagePriceIndex];
  }

  return 0;
};

export const PerpetualQueriesContextProvider: React.FC = ({ children }) => {
  const ammState = usePerpetual_queryAmmState();
  const perpetualParameters = usePerpetual_queryPerpParameters();
  const traderState = usePerpetual_queryTraderState();
  const liquidityPoolState = usePerpetual_queryLiqPoolStateFromPerpetualId();

  const depthMatrixEntries = useMemo(
    () => getDepthMatrix(perpetualParameters, ammState),
    [ammState, perpetualParameters],
  );

  const value = useMemo(
    () => ({
      ammState,
      perpetualParameters,
      traderState,
      liquidityPoolState,
      depthMatrixEntries,
      averagePrice: getAveragePrice(depthMatrixEntries),
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

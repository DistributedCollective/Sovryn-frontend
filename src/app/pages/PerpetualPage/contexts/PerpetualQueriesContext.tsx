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
  lotSize: number;
  lotPrecision: number;
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
  lotSize: 0.002,
  lotPrecision: 3,
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

  const [lotSize, lotPrecision] = useMemo(() => {
    // Round lotSize since ABK64x64 to float leads to period 9 decimals.
    const lotSize = Number(perpetualParameters.fLotSizeBC.toPrecision(8));
    const lotPrecision = lotSize.toString().split(/[,.]/)[1]?.length || 1;
    return [lotSize, lotPrecision];
  }, [perpetualParameters.fLotSizeBC]);

  const value = useMemo(
    () => ({
      ammState,
      perpetualParameters,
      traderState,
      liquidityPoolState,
      depthMatrixEntries,
      averagePrice: getAveragePrice(depthMatrixEntries),
      lotSize,
      lotPrecision,
    }),
    [
      ammState,
      depthMatrixEntries,
      liquidityPoolState,
      perpetualParameters,
      traderState,
      lotSize,
      lotPrecision,
    ],
  );

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

import React, { createContext, useMemo, useEffect, useCallback } from 'react';
import {
  AMMState,
  getDepthMatrix,
  LiqPoolState,
  PerpParameters,
  TraderState,
} from '../utils/perpUtils';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import {
  subscription,
  PerpetualManagerEventKeys,
  decodePerpetualManagerLog,
} from '../utils/bscWebsocket';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import debounce from 'lodash.debounce';
import { useAccount } from '../../../hooks/useAccount';
import { usePerpetual_completedTransactions } from '../hooks/usePerpetual_completedTransactions';
import {
  initialAmmState,
  initialPerpetualParameters,
  initialTraderState,
  initialLiquidityPoolState,
  ammStateCallData,
  liquidityPoolStateCallData,
  perpetualParametersCallData,
  traderStateCallData,
  balanceCallData,
} from '../utils/contractUtils';
import { useBridgeNetworkMultiCall } from '../../../hooks/useBridgeNetworkMultiCall';
import { PERPETUAL_CHAIN } from '../types';
import { usePerpetual_queryLiqPoolId } from '../hooks/usePerpetual_queryLiqPoolId';

const THROTTLE_DELAY = 1000; // 1s
const UPDATE_INTERVAL = 10000; // 10s

const address = getContract('perpetualManager').address.toLowerCase();

type InitSocketParams = {
  update: (isEventByTrader: boolean) => void;
  account: string;
};

const initSocket = (
  { update, account }: InitSocketParams,
  perpetualId: string,
) => {
  const socket = subscription(address, [
    PerpetualManagerEventKeys.Trade,
    PerpetualManagerEventKeys.UpdatePrice,
  ]);
  socket.on('data', data => {
    const decoded = decodePerpetualManagerLog(data);
    if (
      decoded &&
      decoded.perpetualId?.toLowerCase() === perpetualId.toLowerCase()
    ) {
      update(!!account && decoded.trader?.toLowerCase() === account);
    }
  });
  return socket;
};

type PerpetualQueriesContextValue = {
  ammState: AMMState;
  perpetualParameters: PerpParameters;
  traderState: TraderState;
  liquidityPoolState: LiqPoolState;
  depthMatrixEntries: any[][];
  averagePrice: number;
  lotSize: number;
  lotPrecision: number;
  availableBalance: string;
};

const initialContext = {
  ammState: initialAmmState,
  perpetualParameters: initialPerpetualParameters,
  traderState: initialTraderState,
  liquidityPoolState: initialLiquidityPoolState,
  depthMatrixEntries: [],
  averagePrice: 0,
  lotSize: 0.002,
  lotPrecision: 3,
  availableBalance: '0',
};

export const PerpetualQueriesContext = createContext<
  PerpetualQueriesContextValue
>(initialContext);

const getAveragePrice = (depthMatrixEntries: any[][]): number => {
  if (depthMatrixEntries && depthMatrixEntries.length >= 3) {
    const averagePriceIndex = depthMatrixEntries[1].indexOf(0);
    return depthMatrixEntries[0][averagePriceIndex];
  }

  return 0;
};

type PerpetualQueriesContextProviderProps = {
  pair: PerpetualPair;
  children: React.ReactNode;
};

export const PerpetualQueriesContextProvider: React.FC<PerpetualQueriesContextProviderProps> = ({
  pair,
  children,
}) => {
  const transactions = usePerpetual_completedTransactions();
  const account = useAccount();

  const { result: poolId } = usePerpetual_queryLiqPoolId(pair.id);

  const multiCallData = useMemo(() => {
    const calls = [
      ammStateCallData(pair.id),
      perpetualParametersCallData(pair.id),
    ];
    if (poolId) {
      calls.push(liquidityPoolStateCallData(poolId));
    }
    if (account) {
      calls.push(traderStateCallData(pair.id, account));
      calls.push(
        balanceCallData('PERPETUALS_token', account, 'availableBalance'),
      );
    }
    return calls;
  }, [pair, poolId, account]);

  const { result, refetch } = useBridgeNetworkMultiCall(
    PERPETUAL_CHAIN,
    multiCallData,
  );

  const {
    ammState,
    perpetualParameters,
    liquidityPoolState,
    traderState,
    availableBalance,
  } = useMemo(() => ({ ...initialContext, ...(result?.returnData || {}) }), [
    result?.returnData,
  ]);

  const depthMatrixEntries = useMemo(
    () =>
      perpetualParameters &&
      ammState &&
      getDepthMatrix(perpetualParameters, ammState),
    [ammState, perpetualParameters],
  );

  const refetchDebounced = useMemo(
    () =>
      debounce(refetch, THROTTLE_DELAY, {
        leading: true,
        maxWait: THROTTLE_DELAY,
      }),
    [refetch],
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
      availableBalance,
    }),
    [
      ammState,
      depthMatrixEntries,
      liquidityPoolState,
      perpetualParameters,
      traderState,
      lotSize,
      lotPrecision,
      availableBalance,
    ],
  );

  useEffect(() => {
    if (account) {
      refetchDebounced();
    }
    // transactions is required to refetch once new transactions complete
  }, [transactions, account, refetchDebounced]);

  useEffect(() => {
    const socket = initSocket(
      { update: refetchDebounced, account: account?.toLowerCase() },
      pair.id,
    );
    const intervalId = setInterval(refetchDebounced, UPDATE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      refetchDebounced.cancel();
      socket.unsubscribe((error, success) => {
        if (error) {
          console.error(error);
        }
      });
    };
  }, [refetchDebounced, account, pair.id]);

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

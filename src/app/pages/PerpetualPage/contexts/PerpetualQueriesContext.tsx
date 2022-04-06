import React, {
  createContext,
  useMemo,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import {
  subscription,
  PerpetualManagerEventKeys,
  decodePerpetualManagerLog,
  getWeb3Socket,
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
import {
  perpUtils,
  AMMState,
  LiqPoolState,
  PerpParameters,
  TraderState,
} from '@sovryn/perpetual-swap';
import { PerpetualPairDictionary } from 'utils/dictionaries/perpetual-pair-dictionary';

const { getDepthMatrix } = perpUtils;

const THROTTLE_DELAY = 1000; // 1s
const UPDATE_INTERVAL = 10000; // 10s

const address = getContract('perpetualManager').address.toLowerCase();
const pairIds = PerpetualPairDictionary.list().map(item => item.id);

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
    PerpetualManagerEventKeys.Liquidate,
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

  return {
    socket,
    web3: getWeb3Socket(),
  };
};

type PerpetualValue = {
  [key: string]: {
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
};

type PerpetualQueriesContextValue = {
  perpetuals: PerpetualValue;
};

const initialPerpetualValue = {
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

const initialContext = {
  perpetuals: {
    '0': initialPerpetualValue,
  },
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
  const [disconnected, setDisconnected] = useState(false);

  // TODO: Temporary solution, hook adjustment will be necessary
  const { result: firstPoolId } = usePerpetual_queryLiqPoolId(pairIds[0]);
  const { result: secondPoolId } = usePerpetual_queryLiqPoolId(pairIds[1]);

  const multiCallDataFirstPair = useMemo(() => {
    const calls = [
      ammStateCallData(pairIds[0]),
      perpetualParametersCallData(pairIds[0]),
    ];
    if (firstPoolId) {
      calls.push(liquidityPoolStateCallData(firstPoolId));
    }
    if (account) {
      calls.push(traderStateCallData(pairIds[0], account));
      calls.push(
        balanceCallData('PERPETUALS_token', account, 'availableBalance'),
      );
    }
    return calls;
  }, [firstPoolId, account]);

  const {
    result: firstResult,
    refetch: firstRefetch,
  } = useBridgeNetworkMultiCall(PERPETUAL_CHAIN, multiCallDataFirstPair);

  const multiCallDataSecondPair = useMemo(() => {
    const calls = [
      ammStateCallData(pairIds[1]),
      perpetualParametersCallData(pairIds[1]),
    ];
    if (secondPoolId) {
      calls.push(liquidityPoolStateCallData(secondPoolId));
    }
    if (account) {
      calls.push(traderStateCallData(pairIds[1], account));
      calls.push(
        balanceCallData('PERPETUALS_token', account, 'availableBalance'),
      );
    }
    return calls;
  }, [secondPoolId, account]);

  const {
    result: secondResult,
    refetch: secondRefetch,
  } = useBridgeNetworkMultiCall(PERPETUAL_CHAIN, multiCallDataSecondPair);

  const {
    ammState: ammStateFirstResult,
    perpetualParameters: perpetualParametersFirstResult,
    liquidityPoolState: liquidityPoolStateFirstResult,
    traderState: traderStateFirstResult,
    availableBalance: availableBalanceFirstResult,
  } = useMemo(
    () => ({ ...initialPerpetualValue, ...(firstResult?.returnData || {}) }),
    [firstResult?.returnData],
  );

  const {
    ammState: ammStateSecondResult,
    perpetualParameters: perpetualParametersSecondResult,
    liquidityPoolState: liquidityPoolStateSecondResult,
    traderState: traderStateSecondResult,
    availableBalance: availableBalanceSecondResult,
  } = useMemo(
    () => ({ ...initialPerpetualValue, ...(secondResult?.returnData || {}) }),
    [secondResult?.returnData],
  );

  const {
    depthMatrixEntries: depthMatrixEntriesFirstResult,
    lotSize: lotSizeFirstResult,
    lotPrecision: lotPrecisionFirstResult,
  } = useMemo(
    () =>
      getAdditionalInfo(perpetualParametersFirstResult, ammStateFirstResult),
    [ammStateFirstResult, perpetualParametersFirstResult],
  );

  const {
    depthMatrixEntries: depthMatrixEntriesSecondResult,
    lotSize: lotSizeSecondResult,
    lotPrecision: lotPrecisionSecondResult,
  } = useMemo(
    () =>
      getAdditionalInfo(perpetualParametersSecondResult, ammStateSecondResult),
    [ammStateSecondResult, perpetualParametersSecondResult],
  );

  const value: PerpetualQueriesContextValue = useMemo(
    () => ({
      perpetuals: {
        [pairIds[0]]: {
          ammState: ammStateFirstResult,
          perpetualParameters: perpetualParametersFirstResult,
          liquidityPoolState: liquidityPoolStateFirstResult,
          traderState: traderStateFirstResult,
          availableBalance: availableBalanceFirstResult,
          depthMatrixEntries: depthMatrixEntriesFirstResult,
          averagePrice: getAveragePrice(depthMatrixEntriesFirstResult),
          lotPrecision: lotPrecisionFirstResult,
          lotSize: lotSizeFirstResult,
        },
        [pairIds[1]]: {
          ammState: ammStateSecondResult,
          perpetualParameters: perpetualParametersSecondResult,
          liquidityPoolState: liquidityPoolStateSecondResult,
          traderState: traderStateSecondResult,
          availableBalance: availableBalanceSecondResult,
          depthMatrixEntries: depthMatrixEntriesSecondResult,
          averagePrice: getAveragePrice(depthMatrixEntriesSecondResult),
          lotPrecision: lotPrecisionSecondResult,
          lotSize: lotSizeSecondResult,
        },
      },
    }),
    [
      ammStateFirstResult,
      ammStateSecondResult,
      availableBalanceFirstResult,
      availableBalanceSecondResult,
      depthMatrixEntriesFirstResult,
      depthMatrixEntriesSecondResult,
      liquidityPoolStateFirstResult,
      liquidityPoolStateSecondResult,
      lotPrecisionFirstResult,
      lotPrecisionSecondResult,
      lotSizeFirstResult,
      lotSizeSecondResult,
      perpetualParametersFirstResult,
      perpetualParametersSecondResult,
      traderStateFirstResult,
      traderStateSecondResult,
    ],
  );

  const refetch = useCallback(() => {
    firstRefetch();
    secondRefetch();
  }, [firstRefetch, secondRefetch]);

  const refetchDebounced = useMemo(
    () =>
      debounce(refetch, THROTTLE_DELAY, {
        leading: true,
        maxWait: THROTTLE_DELAY,
      }),
    [refetch],
  );

  useEffect(() => {
    if (account) {
      refetchDebounced();
    }
    // transactions is required to refetch once new transactions complete
  }, [transactions, account, refetchDebounced]);

  useEffect(() => {
    let { socket, web3 } = initSocket(
      {
        update: () => {
          refetchDebounced();
          setDisconnected(false);
        },
        account: account?.toLowerCase(),
      },
      pair.id,
    );

    const intervalId = setInterval(() => {
      if (!web3.currentProvider) {
        return;
      }
      setDisconnected(!web3.currentProvider['connected']);
    }, UPDATE_INTERVAL);

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

  useEffect(() => {
    const intervalId = setInterval(
      refetchDebounced,
      disconnected ? THROTTLE_DELAY : UPDATE_INTERVAL,
    );
    return () => {
      clearInterval(intervalId);
      refetchDebounced.cancel();
    };
  }, [disconnected, refetchDebounced]);

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

const getAdditionalInfo = (
  perpetualParameters: perpUtils.PerpParameters,
  ammState: perpUtils.AMMState,
): { depthMatrixEntries: any[][]; lotSize: number; lotPrecision: number } => {
  const depthMatrixEntries =
    perpetualParameters &&
    ammState &&
    getDepthMatrix(perpetualParameters, ammState);

  const lotSize = Number(perpetualParameters.fLotSizeBC.toPrecision(8));
  const lotPrecision = lotSize.toString().split(/[,.]/)[1]?.length || 1;

  return {
    depthMatrixEntries,
    lotSize,
    lotPrecision,
  };
};

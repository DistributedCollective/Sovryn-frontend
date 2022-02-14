import React, {
  createContext,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from 'react';
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
import { getContract } from '../../../../utils/blockchain/contract-helpers';
import {
  subscription,
  PerpetualManagerEventKeys,
  decodePerpetualManagerLog,
} from '../utils/bscWebsocket';
import { PerpetualPair } from '../../../../utils/models/perpetual-pair';
import debounce from 'lodash.debounce';
import { useAccount } from '../../../hooks/useAccount';
import { bridgeNetwork } from '../../BridgeDepositPage/utils/bridge-network';
import { Chain } from '../../../../types';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { usePerpetual_completedTransactions } from '../hooks/usePerpetual_completedTransactions';

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
  availableBalance: '0',
});

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

  const [availableBalance, setAvailableBalance] = useState('0');

  const {
    result: ammState,
    refetch: refetchAmmState,
  } = usePerpetual_queryAmmState(pair.id);
  const {
    result: perpetualParameters,
    refetch: refetchPerpetualParameters,
  } = usePerpetual_queryPerpParameters(pair.id);
  const {
    result: traderState,
    refetch: refetchTraderState,
  } = usePerpetual_queryTraderState(pair.id);
  const {
    result: liquidityPoolState,
    refetch: refetchLiquidityPoolState,
  } = usePerpetual_queryLiqPoolStateFromPerpetualId(pair.id);

  const depthMatrixEntries = useMemo(
    () => getDepthMatrix(perpetualParameters, ammState),
    [ammState, perpetualParameters],
  );

  const refetchContract = useMemo(
    () =>
      debounce(
        () => {
          refetchAmmState();
          refetchPerpetualParameters();
          refetchLiquidityPoolState();
        },
        THROTTLE_DELAY,
        { leading: true, maxWait: THROTTLE_DELAY },
      ),
    [refetchAmmState, refetchPerpetualParameters, refetchLiquidityPoolState],
  );

  const refetchUser = useMemo(
    () =>
      debounce(() => refetchTraderState(), THROTTLE_DELAY, {
        leading: true,
        maxWait: THROTTLE_DELAY,
      }),
    [refetchTraderState],
  );

  const refetch = useCallback(
    (updateUser: boolean) => {
      refetchContract();
      if (updateUser) {
        refetchUser();
      }
    },
    [refetchContract, refetchUser],
  );

  const refetchBalance = useMemo(
    () =>
      debounce(
        () =>
          bridgeNetwork
            .call(
              Chain.BSC,
              getContract('PERPETUALS_token').address,
              marginTokenAbi,
              'balanceOf',
              [account],
            )
            .then(result => result && setAvailableBalance(String(result)))
            .catch(console.error),
        THROTTLE_DELAY,
        { maxWait: THROTTLE_DELAY },
      ),
    [account],
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
      refetchBalance();
      refetchUser();
    }
    // transactions is required to refetch once new transactions complete
  }, [transactions, account, refetchBalance, refetchUser]);

  useEffect(() => {
    const socket = initSocket(
      { update: refetch, account: account?.toLowerCase() },
      pair.id,
    );
    const intervalId = setInterval(refetch, UPDATE_INTERVAL);

    return () => {
      clearInterval(intervalId);
      refetchContract.cancel();
      refetchUser.cancel();
      socket.unsubscribe((error, success) => {
        if (error) {
          console.error(error);
        }
      });
    };
  }, [refetch, refetchContract, refetchUser, account, pair.id]);

  return (
    <PerpetualQueriesContext.Provider value={value}>
      {children}
    </PerpetualQueriesContext.Provider>
  );
};

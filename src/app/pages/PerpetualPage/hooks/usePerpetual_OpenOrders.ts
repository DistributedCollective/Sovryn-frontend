import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType, LimitOrderEvent } from '../types';

import { useMemo, useEffect, useContext } from 'react';

import debounce from 'lodash.debounce';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { BigNumber } from 'ethers';
import {
  Event,
  EventQuery,
  OrderDirection,
  useGetTraderEvents,
} from './graphql/useGetTraderEvents';
import { usePerpetual_completedTransactions } from './usePerpetual_completedTransactions';
import { TxType } from '../../../../store/global/transactions-store/types';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
import { useAccount } from 'app/hooks/useAccount';

export type OpenOrderEntry = {
  id: string;
  pairType: PerpetualPairType;
  orderType: PerpetualTradeType;
  limitPrice: number;
  triggerPrice: number;
  createdAt: string;
  orderSize: number;
  expiry: string;
  createdTransactionHash: string;
};

type OpenOrdersHookResult = {
  loading: boolean;
  data?: OpenOrderEntry[];
  totalCount: number;
};

export const usePerpetual_OpenOrders = (
  page: number,
  perPage: number,
): OpenOrdersHookResult => {
  const account = useAccount();
  const completedTransactions = usePerpetual_completedTransactions();
  const completeLimitOrderTxCount = useMemo(
    () =>
      Object.values(completedTransactions).reduce(
        (count, transaction) =>
          [
            TxType.PERPETUAL_CREATE_LIMIT_ORDER,
            TxType.PERPETUAL_CANCEL_LIMIT_ORDER,
          ].includes(transaction.type)
            ? count + 1
            : count,
        0,
      ),
    [completedTransactions],
  );
  const { latestTradeByUser } = useContext(RecentTradesContext);

  const eventQuery = useMemo(
    (): EventQuery[] => [
      {
        event: Event.LIMIT_ORDER,
        whereCondition: `state: Active`,
        orderBy: 'createdTimestamp',
        orderDirection: OrderDirection.desc,
        page: 1, // TODO: Add a proper pagination once we have a total limit orders field in the subgraph
        perPage: 1000,
      },
    ],
    [],
  );

  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    refetch,
    loading,
  } = useGetTraderEvents(account.toLowerCase(), eventQuery);

  const data = useMemo(() => {
    const currentPositions: LimitOrderEvent[] | undefined =
      tradeEvents?.trader?.limitOrders ||
      previousTradeEvents?.trader?.limitOrders;

    if (!currentPositions) {
      return;
    }

    const result: OpenOrderEntry[] = currentPositions.reduce(
      (acc, position) => {
        const pair = PerpetualPairDictionary.getById(position.perpetual.id);

        const triggerPrice = ABK64x64ToFloat(
          BigNumber.from(position.triggerPrice),
        );

        acc.push({
          id: position.id,
          createdAt: position.createdTimestamp,
          pairType: pair?.pairType,
          orderType:
            triggerPrice > 0
              ? PerpetualTradeType.STOP
              : PerpetualTradeType.LIMIT,
          triggerPrice,
          limitPrice: ABK64x64ToFloat(BigNumber.from(position.limitPrice)),
          orderSize: ABK64x64ToFloat(BigNumber.from(position.tradeAmount)),
          expiry: position.deadline,
          createdTransactionHash: position.createdTransactionHash,
        });

        return acc;
      },
      [] as any,
    );

    return result;
  }, [
    previousTradeEvents?.trader?.limitOrders,
    tradeEvents?.trader?.limitOrders,
  ]);

  const refetchDebounced = useMemo(
    () =>
      debounce(refetch, 1000, {
        leading: false,
        trailing: true,
        maxWait: 1000,
      }),
    [refetch],
  );

  useEffect(() => {
    refetchDebounced();
  }, [refetchDebounced, completeLimitOrderTxCount, latestTradeByUser]);

  const paginatedData = useMemo(
    () => data && data.slice((page - 1) * perPage, page * perPage),
    [data, page, perPage],
  );

  return { data: paginatedData, loading, totalCount: data?.length || 0 };
};

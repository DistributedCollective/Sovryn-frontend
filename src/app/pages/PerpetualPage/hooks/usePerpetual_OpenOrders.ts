import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType, LimitOrderType } from '../types';

import { useMemo, useEffect } from 'react';

import debounce from 'lodash.debounce';
import { useGetOpenOrders } from './graphql/useGetOpenOrders';
import { ABK64x64ToFloat } from '@sovryn/perpetual-swap/dist/scripts/utils/perpMath';
import { BigNumber } from 'ethers';

export type OpenOrderEntry = {
  id: string;
  pairType: PerpetualPairType;
  type?: PerpetualTradeType;
  limitPrice: number;
  triggerPrice: number;

  createdAt?: string;
  positionSize?: number;
};

type OpenOrdersHookResult = {
  loading: boolean;
  data?: OpenOrderEntry[];
};

export const usePerpetual_OpenOrders = (
  address: string,
): OpenOrdersHookResult => {
  const {
    data: gqlResult,
    previousData: previousLimitOrders,
    refetch,
    loading,
  } = useGetOpenOrders(address.toLowerCase(), 50, 0);

  const data = useMemo(() => {
    const currentPositions: LimitOrderType[] | undefined =
      gqlResult?.limitOrders || previousLimitOrders?.limitOrders;

    if (!currentPositions) {
      return;
    }

    const result: OpenOrderEntry[] = currentPositions.reduce(
      (acc, position) => {
        const pair = PerpetualPairDictionary.getById(position.perpetual.id);

        acc.push({
          id: position.id,
          pairType: pair?.pairType,
          type:
            position.triggerPrice > 0
              ? PerpetualTradeType.STOP_LOSS
              : PerpetualTradeType.LIMIT,
          triggerPrice: ABK64x64ToFloat(BigNumber.from(position.triggerPrice)),
          limitPrice: ABK64x64ToFloat(BigNumber.from(position.limitPrice)),
          positionSize: 5,
        });

        return acc;
      },
      [] as any,
    );

    return result;
  }, [gqlResult?.limitOrders, previousLimitOrders?.limitOrders]);

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
  }, [refetchDebounced]);

  return { data, loading };
};

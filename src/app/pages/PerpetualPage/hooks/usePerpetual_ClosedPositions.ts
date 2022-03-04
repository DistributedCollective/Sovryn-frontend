import { useAccount } from 'app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { useContext, useMemo, useEffect } from 'react';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import {
  Event,
  useGetTraderEvents,
  OrderDirection,
} from './graphql/useGetTraderEvents';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
import debounce from 'lodash.debounce';
import { perpUtils } from '@sovryn/perpetual-swap';

const { getQuote2CollateralFX } = perpUtils;

export type ClosedPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  datetime: string;
  positionSizeMin: number;
  positionSizeMax: number;
  realizedPnl: { baseValue: number; quoteValue: number };
};

type ClosedPositionHookResult = {
  loading: boolean;
  data?: ClosedPositionEntry[];
  totalCount: number;
};

export const usePerpetual_ClosedPositions = (
  pairType: PerpetualPairType,
  page: number,
  perPage: number,
): ClosedPositionHookResult => {
  const address = useAccount();

  const { ammState } = useContext(PerpetualQueriesContext);
  const { latestTradeByUser } = useContext(RecentTradesContext);

  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);

  const eventQuery = useMemo(
    () => [
      {
        event: Event.POSITION,
        orderBy: 'endDate',
        orderDirection: OrderDirection.desc,
        page,
        perPage,
        whereCondition: `perpetual: ${JSON.stringify(pair.id)}, isClosed: true`,
      },
    ],
    [page, perPage, pair],
  );

  const {
    data: positions,
    previousData: previousPositions,
    refetch,
    loading,
  } = useGetTraderEvents(address.toLowerCase(), eventQuery);

  const data: ClosedPositionEntry[] = useMemo(() => {
    const currentPositions =
      positions?.trader?.positions || previousPositions?.trader?.positions;

    let data: ClosedPositionEntry[] = [];

    if (currentPositions?.length > 0) {
      data = currentPositions.map(item => {
        const realizedPnlCC = ABK64x64ToFloat(BigNumber.from(item.totalPnLCC));

        return {
          id: item.id,
          pairType,
          datetime: item.endDate,
          positionSizeMin: ABK64x64ToFloat(BigNumber.from(item.lowestSizeBC)),
          positionSizeMax: ABK64x64ToFloat(BigNumber.from(item.highestSizeBC)),
          realizedPnl: {
            baseValue: realizedPnlCC,
            quoteValue: realizedPnlCC / getQuote2CollateralFX(ammState),
          },
        };
      });
    }
    return data;
  }, [
    ammState,
    pairType,
    positions?.trader?.positions,
    previousPositions?.trader?.positions,
  ]);

  const totalCount = useMemo(
    () =>
      positions?.trader?.positionsTotalCount ||
      previousPositions?.trader?.positionsTotalCount,
    [
      positions?.trader?.positionsTotalCount,
      previousPositions?.trader?.positionsTotalCount,
    ],
  );

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
    if (latestTradeByUser) {
      refetchDebounced();
    }
  }, [latestTradeByUser, refetchDebounced]);

  return {
    data,
    loading,
    totalCount,
  };
};

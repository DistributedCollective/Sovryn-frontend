import { useAccount } from 'app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { useContext, useMemo, useEffect } from 'react';
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
import { PerpetualPair } from 'utils/models/perpetual-pair';
import {
  PerpetualPairDictionary,
  PerpetualPairType,
} from 'utils/dictionaries/perpetual-pair-dictionary';

const { getQuote2CollateralFX } = perpUtils;

export type ClosedPositionEntry = {
  id: string;
  pair: PerpetualPair;
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
  page: number,
  perPage: number,
): ClosedPositionHookResult => {
  const account = useAccount();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { latestTradeByUser } = useContext(RecentTradesContext);

  const eventQuery = useMemo(
    () => [
      {
        event: Event.POSITION,
        orderBy: 'endDate',
        orderDirection: OrderDirection.desc,
        page,
        perPage,
        whereCondition: 'isClosed: true',
      },
    ],
    [page, perPage],
  );

  const {
    data: positions,
    previousData: previousPositions,
    refetch,
    loading,
  } = useGetTraderEvents(account.toLowerCase(), eventQuery);

  const data: ClosedPositionEntry[] = useMemo(() => {
    const currentPositions =
      positions?.trader?.positions || previousPositions?.trader?.positions;

    let data: ClosedPositionEntry[] = [];

    if (currentPositions?.length > 0) {
      data = currentPositions.map(item => {
        const realizedPnlCC = ABK64x64ToFloat(BigNumber.from(item.totalPnLCC));
        const pair =
          PerpetualPairDictionary.getById(item?.perpetual?.id) ||
          PerpetualPairDictionary.get(PerpetualPairType.BTCUSD);

        const { ammState } = perpetuals[pair.id];

        return {
          id: item.id,
          pair,
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
    perpetuals,
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

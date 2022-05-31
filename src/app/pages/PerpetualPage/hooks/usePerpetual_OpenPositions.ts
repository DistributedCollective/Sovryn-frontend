import { TradingPosition } from '../../../../types/trading-position';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTradeType, PerpetualPositionEvent } from '../types';
import {
  Event,
  OrderDirection,
  useGetTraderEvents,
  EventQuery,
} from './graphql/useGetTraderEvents';
import { useContext, useMemo, useEffect } from 'react';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { BigNumber } from 'ethers';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { RecentTradesContext } from '../contexts/RecentTradesContext';
import debounce from 'lodash.debounce';
import { perpUtils } from '@sovryn/perpetual-swap';

export type OpenPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  type?: PerpetualTradeType;
  position?: TradingPosition;
  amount?: number;
  entryPrice?: number;
  averagePrice?: number;
  liquidationPrice?: number;
  margin: number;
  leverage?: number;
  unrealized?: { baseValue: number; quoteValue: number };
  realized?: { baseValue: number; quoteValue: number };
};

type OpenPositionsHookResult = {
  loading: boolean;
  data?: OpenPositionEntry[];
};

const {
  getAverageEntryPrice,
  calculateApproxLiquidationPrice,
  getTraderPnL,
  getBase2CollateralFX,
  getBase2QuoteFX,
  getTraderLeverage,
} = perpUtils;

export const usePerpetual_OpenPositions = (
  address: string,
  pairType: PerpetualPairType,
): OpenPositionsHookResult => {
  const eventQuery = useMemo(
    (): EventQuery[] => [
      {
        event: Event.POSITION,
        orderBy: 'startDate',
        orderDirection: OrderDirection.desc,
        whereCondition: `isClosed_not: true`,
        page: 1, // TODO: Add a proper pagination once we have a total open positions field in the subgraph
        perPage: 10,
      },
    ],
    [],
  );

  const {
    data: tradeEvents,
    previousData: previousTradeEvents,
    refetch,
    loading,
  } = useGetTraderEvents(address.toLowerCase(), eventQuery);

  const { latestTradeByUser } = useContext(RecentTradesContext);

  const { perpetuals } = useContext(PerpetualQueriesContext);

  const data = useMemo(() => {
    const currentPositions: PerpetualPositionEvent[] | undefined =
      tradeEvents?.trader?.positions || previousTradeEvents?.trader?.positions;

    if (!currentPositions) {
      return;
    }

    const result: OpenPositionEntry[] = currentPositions.reduce(
      (acc, position) => {
        const {
          ammState,
          traderState,
          perpetualParameters: perpParameters,
          averagePrice,
        } = perpetuals[position.perpetual.id];

        const base2quote = getBase2QuoteFX(ammState, true);
        const base2collateral = getBase2CollateralFX(ammState, true);
        const pair = PerpetualPairDictionary.getById(position.perpetual.id);

        if (traderState.marginBalanceCC === 0 || !pair) {
          return acc;
        }

        const margin = traderState.availableCashCC;

        if (traderState.marginAccountPositionBC === 0) {
          acc.push({
            id: pair.id,
            pairType: pair.pairType,
            margin,
          });
          return acc;
        }

        const tradeAmount = traderState.marginAccountPositionBC;

        const entryPrice = getAverageEntryPrice(traderState);

        const liquidationPrice = calculateApproxLiquidationPrice(
          traderState,
          ammState,
          perpParameters,
          0,
          0,
        );

        const leverage = getTraderLeverage(traderState, ammState);

        const unrealizedQuote = getTraderPnL(
          traderState,
          ammState,
          perpParameters,
        );
        const unrealized: OpenPositionEntry['unrealized'] = {
          baseValue: unrealizedQuote / base2quote,
          quoteValue: unrealizedQuote,
        };

        const totalPnLCC = position
          ? ABK64x64ToFloat(BigNumber.from(position.totalPnLCC))
          : 0;
        const realized: OpenPositionEntry['realized'] = {
          baseValue: totalPnLCC / base2collateral,
          quoteValue: (totalPnLCC / base2collateral) * base2quote,
        };

        acc.push({
          id: pair.id,
          pairType: pair.pairType,
          type: PerpetualTradeType.MARKET,
          position:
            tradeAmount > 0 ? TradingPosition.LONG : TradingPosition.SHORT,
          amount: tradeAmount,
          entryPrice,
          averagePrice,
          liquidationPrice,
          leverage,
          margin,
          unrealized,
          realized,
        });

        return acc;
      },
      [] as any,
    );

    return result;
  }, [
    tradeEvents?.trader?.positions,
    previousTradeEvents?.trader?.positions,
    perpetuals,
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
    if (latestTradeByUser) {
      refetchDebounced();
    }
  }, [latestTradeByUser, refetchDebounced]);

  return { data, loading };
};

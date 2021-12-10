import { useAccount } from 'app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { useContext, useMemo } from 'react';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { getQuote2CollateralFX } from '../utils/perpUtils';
import {
  Event,
  useGetTraderEvents,
  OrderDirection,
} from './graphql/useGetTraderEvents';

export type ClosedPositionEntry = {
  id: string;
  pairType: PerpetualPairType;
  datetime: string;
  positionSize: string;
  realizedPnl: { baseValue: number; quoteValue: number };
};

type ClosedPositionHookResult = {
  loading: boolean;
  data?: ClosedPositionEntry[];
  totalCount: number;
};

export const usePerpetual_ClosedPositions = (
  pairType: PerpetualPairType.BTCUSD,
  page: number,
  perPage: number,
): ClosedPositionHookResult => {
  const address = useAccount();

  const { ammState } = useContext(PerpetualQueriesContext);

  const {
    data: positions,
    previousData: previousPositions,
    loading,
  } = useGetTraderEvents(
    [Event.POSITION],
    address.toLowerCase(),
    'endDate',
    OrderDirection.desc,
    page,
    perPage,
    'isClosed: true',
  );

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
          positionSize: ABK64x64ToFloat(
            BigNumber.from(item.currentPositionSizeBC),
          ),
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

  return {
    data,
    loading,
    totalCount,
  };
};

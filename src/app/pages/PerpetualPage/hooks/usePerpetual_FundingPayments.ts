import { useAccount } from 'app/hooks/useAccount';
import { useMemo, useContext } from 'react';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import {
  Event,
  OrderDirection,
  useGetTraderEvents,
} from './graphql/useGetTraderEvents';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';

export type FundingPaymentsEntry = {
  id: string;
  pairType: PerpetualPairType;
  datetime: string;
  payment: string;
  rate: number;
  timeSinceLastPayment: string;
};

type FundingPaymentsHookResult = {
  loading: boolean;
  data?: FundingPaymentsEntry[];
  totalCount: number;
};

export const usePerpetual_FundingPayments = (
  pairType: PerpetualPairType.BTCUSD,
  page: number,
  perPage: number,
): FundingPaymentsHookResult => {
  const address = useAccount();
  const { ammState } = useContext(PerpetualQueriesContext);

  const {
    data: fundingEvents,
    previousData: previousFundingEvents,
    loading,
  } = useGetTraderEvents(
    [Event.FUNDING_PAYMENT],
    address.toLowerCase(),
    'blockTimestamp',
    OrderDirection.desc,
    page,
    perPage,
  );

  const data: FundingPaymentsEntry[] = useMemo(() => {
    const currentFundingEvents =
      fundingEvents?.trader?.fundingPayments ||
      previousFundingEvents?.trader?.fundingPayments;

    let data: FundingPaymentsEntry[] = [];

    if (currentFundingEvents?.length > 0) {
      data = currentFundingEvents.map(item => {
        return {
          id: item.id,
          pairType: pairType,
          datetime: item.blockTimestamp,
          payment: item.fFundingPaymentCC,
          rate: numberFromWei(item.fundingRate),
          timeSinceLastPayment: numberFromWei(item.fundingTime),
        };
      });
      return data;
    }

    return data;
  }, [
    fundingEvents?.trader?.fundingPayments,
    pairType,
    previousFundingEvents?.trader?.fundingPayments,
  ]);

  const totalCount = useMemo(
    () =>
      fundingEvents?.trader?.positionsTotalCount ||
      previousFundingEvents?.trader?.positionsTotalCount,
    [
      fundingEvents?.trader?.positionsTotalCount,
      previousFundingEvents?.trader?.positionsTotalCount,
    ],
  );

  return {
    data,
    loading,
    totalCount,
  };
};

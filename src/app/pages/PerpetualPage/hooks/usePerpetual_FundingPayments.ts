import { useAccount } from 'app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import {
  Event,
  OrderDirection,
  useGetTraderEvents,
} from './graphql/useGetTraderEvents';

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

  const {
    data: fundingEvents,
    previousData: previousFundingEvents,
    loading,
  } = useGetTraderEvents(
    [Event.FUNDING_RATE],
    address.toLowerCase(),
    'blockTimestamp',
    OrderDirection.desc,
    page,
    perPage,
    'fundingTime_not: "0"',
  );

  const data: FundingPaymentsEntry[] = useMemo(() => {
    const currentFundingEvents =
      fundingEvents?.trader?.fundingRates ||
      previousFundingEvents?.trader?.fundingRates;

    let data: FundingPaymentsEntry[] = [];

    if (currentFundingEvents?.length > 0) {
      data = currentFundingEvents.reduce((acc, item) => {
        if (item) {
          acc.push({
            id: item.id,
            pairType: pairType,
            datetime: item.blockTimestamp,
            payment: ABK64x64ToFloat(BigNumber.from(item.fFundingPaymentCC)),
            rate: ABK64x64ToFloat(BigNumber.from(item.fundingRate)),
            timeSinceLastPayment: BigNumber.from(item.deltaTime).toNumber(),
          });
        }

        return acc;
      }, []);
    }

    return data;
  }, [
    fundingEvents?.trader?.fundingRates,
    pairType,
    previousFundingEvents?.trader?.fundingRates,
  ]);

  const totalCount = useMemo(() => {
    const fundingRatesTotalCount =
      fundingEvents?.trader?.fundingRatesTotalCount ||
      previousFundingEvents?.trader?.fundingRatesTotalCount;

    const positionsTotalCount =
      fundingEvents?.trader?.positionsTotalCount ||
      previousFundingEvents?.trader?.positionsTotalCount;

    return fundingRatesTotalCount - positionsTotalCount; // because we always receive a 0 funding payment when we open a position
  }, [
    fundingEvents?.trader?.fundingRatesTotalCount,
    fundingEvents?.trader?.positionsTotalCount,
    previousFundingEvents?.trader?.fundingRatesTotalCount,
    previousFundingEvents?.trader?.positionsTotalCount,
  ]);

  return {
    data,
    loading,
    totalCount,
  };
};

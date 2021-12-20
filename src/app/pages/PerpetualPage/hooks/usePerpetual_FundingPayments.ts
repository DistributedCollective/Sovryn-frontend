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
    [Event.FUNDING_PAYMENT],
    address.toLowerCase(),
    'lastBlockTimestamp',
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
        const fundingRateObject = item.fundingRates[0];

        return {
          id: item.id,
          pairType: pairType,
          datetime: fundingRateObject.blockTimestamp,
          payment: ABK64x64ToFloat(
            BigNumber.from(fundingRateObject.fFundingPaymentCC),
          ),
          rate: ABK64x64ToFloat(BigNumber.from(fundingRateObject.fundingRate)),
          timeSinceLastPayment: ABK64x64ToFloat(
            BigNumber.from(fundingRateObject.fundingTime),
          ),
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

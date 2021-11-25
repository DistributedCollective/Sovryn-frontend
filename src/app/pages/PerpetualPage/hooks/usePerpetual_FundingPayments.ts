import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';
import { toWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { Event, useGetTraderEvents } from './graphql/useGetTraderEvents';

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
};

export const usePerpetual_FundingPayments = (
  pairType: PerpetualPairType.BTCUSD,
): FundingPaymentsHookResult => {
  const address = useAccount();

  const {
    data: fundingEvents,
    previousData: previousFundingEvents,
    loading,
  } = useGetTraderEvents([Event.UPDATE_MARGIN_ACCOUNT], address.toLowerCase());

  const data = useMemo(() => {
    const currentFundingEvents =
      fundingEvents?.trader?.updateMarginAccount ||
      previousFundingEvents?.trader?.updateMarginAccount;
  }, [
    previousFundingEvents?.trader?.updateMarginAccount,
    fundingEvents?.trader?.updateMarginAccount,
  ]);

  return {
    data: [
      {
        id: '1',
        pairType: pairType,
        datetime: '1637367029',
        payment: toWei(0.000234),
        rate: 0.00003,
        timeSinceLastPayment: 'D.H.M.S',
      },
    ],
    loading: false,
  };
};

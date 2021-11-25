import { toWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';

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
  // TODO: implement FundingPayments hook
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

import { useAccount } from 'app/hooks/useAccount';
import { BigNumber } from 'ethers';
import { bignumber } from 'mathjs';
import { useMemo, useContext } from 'react';
import { toWei } from 'utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { getBase2CollateralFX } from '../utils/perpUtils';
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
};

export const usePerpetual_FundingPayments = (
  pairType: PerpetualPairType.BTCUSD,
): FundingPaymentsHookResult => {
  const address = useAccount();
  const { ammState } = useContext(PerpetualQueriesContext);

  const {
    data: fundingEvents,
    previousData: previousFundingEvents,
    loading,
  } = useGetTraderEvents(
    [Event.UPDATE_MARGIN_ACCOUNT],
    address.toLowerCase(),
    'blockTimestamp',
    OrderDirection.desc,
  );

  const data: FundingPaymentsEntry[] = useMemo(() => {
    const currentFundingEvents =
      fundingEvents?.trader?.updateMarginAccount ||
      previousFundingEvents?.trader?.updateMarginAccount;

    const currentFundingEventsLength = currentFundingEvents?.length;

    let data: FundingPaymentsEntry[] = [];

    if (currentFundingEvents?.length > 0) {
      data = currentFundingEvents.map((item, index) => {
        if (item.fFundingPaymentCC === '0') {
          return null;
        }
        if (index === currentFundingEventsLength - 1) {
          return {
            id: item.id,
            pairType: pairType,
            datetime: item.blockTimestamp,
            payment: ABK64x64ToFloat(BigNumber.from(item.fFundingPaymentCC)),
            rate: 0,
            timeSinceLastPayment: '-',
          };
        }

        const timeSinceLastPayment = bignumber(item.blockTimestamp)
          .minus(currentFundingEvents[index + 1].blockTimestamp)
          .toString();

        const fundingPayment = ABK64x64ToFloat(
          BigNumber.from(item.fFundingPaymentCC),
        );
        const positionCc =
          ABK64x64ToFloat(
            BigNumber.from(
              currentFundingEvents[index + 1].fPositionBC === '0'
                ? currentFundingEvents[index + 2].fPositionBC
                : currentFundingEvents[index + 1].fPositionBC,
            ),
          ) * getBase2CollateralFX(ammState, false);

        const fundingTime = Number(timeSinceLastPayment) / (8 * 60 * 60);

        const fundingRate = fundingPayment / positionCc / fundingTime;

        return {
          id: item.id,
          pairType: pairType,
          datetime: item.blockTimestamp,
          payment: toWei(
            ABK64x64ToFloat(BigNumber.from(item.fFundingPaymentCC)),
          ),
          rate: fundingRate,
          timeSinceLastPayment: timeSinceLastPayment,
        };
      });
    }
    return data.filter(item => item !== null);
  }, [
    ammState,
    fundingEvents?.trader?.updateMarginAccount,
    pairType,
    previousFundingEvents?.trader?.updateMarginAccount,
  ]);

  return {
    data,
    loading,
  };
};

import { useQuery, gql } from '@apollo/client';
import { BigNumber } from 'ethers';
import { ABK64x64ToFloat } from '../../utils/contractUtils';
import { TraderState } from '../../utils/perpUtils';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../../utils/dictionaries/perpetual-pair-dictionary';
import { useMemo } from 'react';

const fields = [
  'id',
  'marginBalanceCC',
  'availableMarginCC',
  'availableCashCC',
  'marginAccountCashCC',
  'marginAccountPositionBC',
  'marginAccountLockedInValueQC',
  'fUnitAccumulatedFundingStart',
];

export type TraderStatesItem = TraderState & {
  id: string;
};

export const useGetTraderStates = (
  pairType: PerpetualPairType,
): TraderStatesItem[] => {
  const pair = useMemo(() => PerpetualPairDictionary.get(pairType), [pairType]);
  const { data } = useQuery(gql`
  {
    traderStates (where: {perpetual: ${JSON.stringify(pair.id)}}) {
      ${fields.toString()}
    }
  }
`);

  const result: TraderStatesItem[] = data?.traderStates?.map(item => ({
    id: item.id,
    ...parseTraderState(item),
  }));

  return result;
};

const parseTraderState = (traderState: TraderStatesItem): TraderState => ({
  marginBalanceCC: ABK64x64ToFloat(BigNumber.from(traderState.marginBalanceCC)), // current margin balance
  availableMarginCC: ABK64x64ToFloat(
    BigNumber.from(traderState.availableMarginCC),
  ), // amount over initial margin
  availableCashCC: ABK64x64ToFloat(BigNumber.from(traderState.availableCashCC)), // cash minus unpaid funding
  marginAccountCashCC: ABK64x64ToFloat(
    BigNumber.from(traderState.marginAccountCashCC),
  ), // from margin account
  marginAccountPositionBC: ABK64x64ToFloat(
    BigNumber.from(traderState.marginAccountPositionBC),
  ), // from margin account
  marginAccountLockedInValueQC: ABK64x64ToFloat(
    BigNumber.from(traderState.marginAccountLockedInValueQC),
  ), // from margin account
  fUnitAccumulatedFundingStart: ABK64x64ToFloat(
    BigNumber.from(traderState.fUnitAccumulatedFundingStart),
  ), // from margin account
});

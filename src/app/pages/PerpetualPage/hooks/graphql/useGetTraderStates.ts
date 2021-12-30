import { useQuery, gql } from '@apollo/client';
import { BigNumber } from 'ethers';
import { ABK64x64ToFloat } from '../../utils/contractUtils';
import { TraderState } from '../../utils/perpUtils';

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

const graphQuery = gql`
  {
    traderStates {
      ${fields.toString()}
    }
  }
`;

export type TraderStatesItem = TraderState & {
  id: string;
};

export const useGetTraderStates = (): TraderStatesItem[] => {
  const { data } = useQuery(graphQuery);

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

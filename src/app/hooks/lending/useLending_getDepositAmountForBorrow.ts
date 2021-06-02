import { Asset } from 'types/asset';
import {
  getLendingContractName,
  getTokenContract,
} from 'utils/blockchain/contract-helpers';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethGenesisAddress } from '../../../utils/classifiers';

export function useLending_getDepositAmountForBorrow(
  borrowToken: Asset,
  collateralToken: Asset,
  borrowAmount: string,
  initialLoanDuration: string,
) {
  return useCacheCallWithValue(
    getLendingContractName(borrowToken),
    'getDepositAmountForBorrow',
    '0',
    borrowAmount,
    initialLoanDuration,
    collateralToken === Asset.RBTC
      ? ethGenesisAddress
      : getTokenContract(collateralToken).address,
  );
}

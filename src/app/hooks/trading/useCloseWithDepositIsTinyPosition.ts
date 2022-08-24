import { useCacheCallWithValue } from '../useCacheCallWithValue';

type Response = {
  isTinyPosition: boolean;
  tinyPositionAmount: string;
};

export const useCloseWithDepositIsTinyPosition = (
  loanId: string,
  depositAmount: string,
) =>
  useCacheCallWithValue<Response>(
    'sovrynProtocol',
    'checkCloseWithDepositIsTinyPosition',
    '0',
    loanId,
    depositAmount,
  );

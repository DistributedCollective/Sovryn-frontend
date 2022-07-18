import { useCacheCallWithValue } from '../useCacheCallWithValue';

type Response = {
  isTinyPosition: boolean;
  tinyPositionAmount: string;
};

export function useCloseWithDepositIsTinyPosition(
  loanId: string,
  depositAmount: string,
) {
  return useCacheCallWithValue<Response>(
    'sovrynProtocol',
    'checkCloseWithDepositIsTinyPosition',
    '0',
    loanId,
    depositAmount,
  );
}

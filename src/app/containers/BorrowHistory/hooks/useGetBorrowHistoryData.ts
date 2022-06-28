import { useAccount } from 'app/hooks/useAccount';
import { useGetBorrowHistoryQuery } from 'utils/graphql/rsk/generated';
export function useGetBorrowHistoryData() {
  const account = useAccount();
  return useGetBorrowHistoryQuery({
    variables: {
      user: account.toLowerCase(),
    },
  });
}

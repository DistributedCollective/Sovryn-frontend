import { useAccount } from 'app/hooks/useAccount';
import { useMemo } from 'react';
import { useGetMarginLoansDataQuery } from 'utils/graphql/rsk/generated';

/** Hook to return loans data for Margin open or closed positions */

export const useGetMarginLoansData = (
  page: number,
  isOpen: boolean,
  pageSize: number,
) => {
  const account = useAccount();
  const skip = useMemo(() => {
    if (page === 1) {
      return 0;
    }
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  return useGetMarginLoansDataQuery({
    variables: {
      user: account.toLowerCase(),
      skip: skip,
      pageSize: pageSize,
      isOpen: isOpen,
    },
  });
};

/**
 *
 * ActiveUserBorrows
 *
 */
import React from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { ActiveBorrowTable } from '../../components/ActiveBorrowTable';

interface Props {}

export function ActiveUserBorrows(props: Props) {
  const account = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, loading } = useGetActiveLoans(
    account,
    0,
    1000,
    2,
    false,
    false,
  );

  if (loading && !value.length) {
    return <SkeletonRow />;
  }

  if (!value.length && !loading) {
    return (
      <div className="container pt-4">You do not have any active loans.</div>
    );
  }

  return <>{value.length && <ActiveBorrowTable data={value} />}</>;
}

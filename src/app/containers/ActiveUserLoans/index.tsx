/**
 *
 * ActiveUserLoans
 *
 */
import React from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { ActiveLoanTable } from 'app/components/ActiveLoanTable';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';

interface Props {}

export function ActiveUserLoans(props: Props) {
  const account = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, error, loading } = useGetActiveLoans(
    account,
    0,
    100000,
    0,
    false,
    false,
  );

  if (loading && !value.length) {
    return <SkeletonRow />;
  }

  if (!value.length && !loading) {
    return (
      <div className="container" style={{ padding: '20px' }}>
        You do not have any active trades.
      </div>
    );
  }

  return (
    <>{value.length && <ActiveLoanTable data={value} activeTrades={true} />}</>
  );
}

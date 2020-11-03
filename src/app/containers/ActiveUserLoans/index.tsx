/**
 *
 * ActiveUserLoans
 *
 */
import React from 'react';
import { useAccount } from 'app/hooks/useAccount';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { ActiveLoanTableContainer } from 'app/components/ActiveUserLoanContainer/components/ActiveLoanTableContainer';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { InfoBox } from '../../components/InfoBox';

interface Props {
  loanType: number;
}

export function ActiveUserLoans(props: Props) {
  const account = useAccount();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { value, loading } = useGetActiveLoans(
    account,
    0,
    1000,
    props.loanType,
    false,
    false,
  );

  if (loading && !value.length) {
    return <SkeletonRow />;
  }

  if (!value.length && !loading) {
    return (
      <>
        <div className="container" style={{ padding: '20px' }}>
          You do not have any active trades.
        </div>
        <InfoBox
          icon="info-sign"
          content={
            <>
              Need help making a transaction? Read our guide on{' '}
              <a
                href="https://sovryn.app/blog/how-to-earn-and-leverage-bitcoin.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                how to trade and lend with Sovryn
              </a>
              .
            </>
          }
          localStorageRef="txHelpInfoBox"
        />
      </>
    );
  }

  return (
    <>
      {value.length && (
        <ActiveLoanTableContainer data={value} activeTrades={true} />
      )}
    </>
  );
}

ActiveUserLoans.defaultProps = {
  loanType: 0,
};

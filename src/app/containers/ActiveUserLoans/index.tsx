/**
 *
 * ActiveUserLoans
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useAccount } from 'app/hooks/useAccount';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { ActiveLoanTableContainer } from 'app/components/ActiveUserLoanContainer/components/ActiveLoanTableContainer';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { InfoBox } from '../../components/InfoBox';

interface Props {
  loanType: number;
}

export function ActiveUserLoans(props: Props) {
  const { t } = useTranslation();
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
          {t(translations.activeUserLoans.text)}
        </div>
        <InfoBox
          icon="info-sign"
          content={
            <>
              {t(translations.activeUserLoans.info.line_1)}
              <a
                href="https://sovryn.app/blog/how-to-earn-and-leverage-bitcoin.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(translations.activeUserLoans.info.line_2)}
              </a>
              {t(translations.activeUserLoans.info.line_3)}
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

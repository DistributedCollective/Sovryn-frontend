/**
 *
 * ActiveUserBorrows
 *
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'app/hooks/useAccount';
import { useGetActiveLoans } from 'app/hooks/trading/useGetActiveLoans';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { ActiveBorrowTable } from '../../components/ActiveBorrowTable';
import { translations } from 'locales/i18n';

interface Props {}

export function ActiveUserBorrows(props: Props) {
  const { t } = useTranslation();
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
      <div className="tw-container tw-mx-auto tw-px-4 tw-pt-6">
        {t(translations.activeUserBorrows.text)}
      </div>
    );
  }

  return <>{value.length && <ActiveBorrowTable data={value} />}</>;
}

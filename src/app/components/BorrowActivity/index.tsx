/**
 *
 * BorrowActivity
 *
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { useIsConnected } from 'app/hooks/useAccount';
import { ActiveUserBorrows } from 'app/containers/ActiveUserBorrows';
import { BorrowHistory } from 'app/containers/BorrowHistory/Loadable';

import { Tab } from '../Tab';
import { SkeletonRow } from '../Skeleton/SkeletonRow';

interface Props {}

export function BorrowActivity(props: Props) {
  const { t } = useTranslation();
  const isConnected = useIsConnected();
  const [activeBorrows, setActiveBorrows] = useState(true);
  return (
    <div>
      <div className="tw-mt-12 tw-mb-6 tw-flex tw-flex-col md:tw-flex-row md:tw-justify-between md:tw-items-center">
        <h3 className="tw-mt-0 tw-mb-4 md:tw-mb-0 tw-text-sov-white">
          {t(translations.borrowActivity.title)}
        </h3>

        <div className="tw-flex tw-flex-row tw-items-center tw-justify-start md:justify-content-end">
          <Tab
            text={t(translations.borrowActivity.tabs.active)}
            active={activeBorrows}
            onClick={() => setActiveBorrows(true)}
            className="tw-mr-4"
          />
          <Tab
            text={t(translations.borrowActivity.tabs.history)}
            active={!activeBorrows}
            onClick={() => setActiveBorrows(false)}
          />
        </div>
      </div>
      <div className="tw-grid tw-gap-8 tw-grid-cols-12">
        <div className="tw-col-span-12">
          {!isConnected ? (
            <SkeletonRow
              loadingText={t(translations.borrowActivity.walletNote)}
            />
          ) : activeBorrows ? (
            <ActiveUserBorrows />
          ) : (
            <BorrowHistory />
          )}
        </div>
      </div>
    </div>
  );
}

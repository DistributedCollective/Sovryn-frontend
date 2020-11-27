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
      <div className="mt-5 mb-4 d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
        <h3 className="mt-0 mb-3 mb-md-0 text-white">
          {t(translations.borrowActivity.title)}
        </h3>

        <div className="d-flex flex-row align-items-center justify-content-start justify-content-md-end">
          <div className="mr-3">
            <Tab
              text={t(translations.borrowActivity.tabs.active)}
              active={activeBorrows}
              onClick={() => setActiveBorrows(true)}
            />
          </div>
          <div>
            <Tab
              text={t(translations.borrowActivity.tabs.history)}
              active={!activeBorrows}
              onClick={() => setActiveBorrows(false)}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
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

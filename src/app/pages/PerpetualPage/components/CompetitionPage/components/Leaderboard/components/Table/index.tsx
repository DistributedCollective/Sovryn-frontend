import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';

type TableProps = {
  header: React.ReactNode;
  children: React.ReactNode;
  scrollRow: React.ReactNode;
  userRowVisible: boolean;
  isEmpty: boolean;
  isLoading: boolean;
  isHidden: boolean;
};

export const Table: React.FC<TableProps> = ({
  header,
  children,
  scrollRow,
  userRowVisible,
  isEmpty,
  isLoading,
  isHidden,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="leaderboard-table">
        <div className="tw-flex tw-flex-row tw-items-end tw-text-xs tw-tracking-tighter tw-mb-3 tw-mr-8">
          {header}
        </div>
        <div
          className={classNames(
            'tw-scrollbars-thin tw-overflow-y-auto tw-text-sm tw-align-middle',
            styles.leaderboardContainer,
          )}
        >
          {children}
          {isLoading && <SkeletonRow />}
          {isEmpty && (
            <div className="tw-flex tw-flex-row tw-justify-center tw-py-5 tw-mb-2 tw-mr-4 tw-font-thin tw-bg-gray-3 tw-rounded tw-border tw-border-transparent">
              {t(translations.competitionPage.table.empty)}
            </div>
          )}
        </div>
        <div
          className={classNames('tw-my-2 tw-h-16', {
            'tw-hidden': isHidden,
          })}
        >
          <div className={classNames({ 'tw-hidden': userRowVisible })}>
            <div className="tw-mb-2 tw-ml-4">...</div>
            <div className="tw-mr-4 tw-text-sm tw-align-middle">
              {scrollRow}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

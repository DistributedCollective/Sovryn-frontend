import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';
import { useIntersection } from 'app/hooks/useIntersection';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { RegisteredTraderData } from '../../../../types';
import { TraderRow } from './TraderRow';
import styles from '../BestReturnTable/index.module.scss';
import { useGetData } from './hooks/useGetData';

type HighestVolumeTableProps = {
  data: RegisteredTraderData[];
  showUserRow: boolean;
  pair: PerpetualPair;
};

export const HighestVolumeTable: React.FC<HighestVolumeTableProps> = ({
  data,
  showUserRow,
  pair,
}) => {
  const { t } = useTranslation();
  const userRowRef = useRef<HTMLDivElement>(null);
  const userRowVisible = useIntersection(userRowRef.current);
  const account = useAccount();

  const { items, userData, loaded } = useGetData(data);

  return (
    <>
      <div className="leaderboard-table">
        <div className="tw-flex tw-flex-row tw-items-end tw-text-xs tw-tracking-tighter tw-mb-3 tw-mr-8">
          <div className="tw-px-1 tw-w-3/12">
            {t(translations.competitionPage.table.rank)}
          </div>
          <div className="tw-px-1 tw-w-7/12">
            {t(translations.competitionPage.table.name)}
          </div>
          <div className="tw-px-1 tw-w-2/12">
            {t(
              translations.competitionPage.leaderboard.tables.highestVolumeTable
                .volume,
            )}
          </div>
        </div>
        <div
          className={classNames(
            'tw-scrollbars-thin tw-overflow-y-auto tw-text-sm tw-align-middle',
            styles.leaderboardContainer,
          )}
        >
          {items.map(val => {
            const isUser = val.walletAddress === account?.toLowerCase();
            return (
              <TraderRow
                ref={isUser ? userRowRef : null}
                data={val}
                key={val.walletAddress}
                isUser={isUser}
              />
            );
          })}
          {(!data || (!loaded && !items?.length)) && <SkeletonRow />}
          {loaded && items && items.length === 0 && (
            <div className="tw-flex tw-flex-row tw-justify-center tw-py-5 tw-mb-2 tw-mr-4 tw-font-thin tw-bg-gray-3 tw-rounded tw-border tw-border-transparent">
              {t(translations.competitionPage.table.empty)}
            </div>
          )}
        </div>
        <div
          className={classNames('tw-my-2 tw-h-16', {
            'tw-hidden': !showUserRow || !userData,
          })}
        >
          <div className={classNames({ 'tw-hidden': userRowVisible })}>
            <div className="tw-mb-2 tw-ml-4">...</div>
            <div className="tw-mr-4 tw-text-sm tw-align-middle">
              {userData && <TraderRow data={userData} isUser />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

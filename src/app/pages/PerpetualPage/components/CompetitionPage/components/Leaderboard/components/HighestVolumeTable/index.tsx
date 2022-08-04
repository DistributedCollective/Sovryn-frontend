import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useAccount } from 'app/hooks/useAccount';
import { useIntersection } from 'app/hooks/useIntersection';
import { useGetLeaderboardData } from 'app/pages/PerpetualPage/hooks/graphql/useGetLeaderboardData';
import classNames from 'classnames';
import { translations } from 'locales/i18n';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { Nullable } from 'types';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { HighestVolumeData, RegisteredTraderData } from '../../../../types';
import { readTraderVolume } from '../../utils';
import { TraderRow } from './TraderRow';
import styles from '../BestReturnTable/index.module.scss';

const START_TIMESTAMP = '1654061182'; // 01/06/2022

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

  const [items, setItems] = useState<HighestVolumeData[]>([]);
  const [userData, setUserData] = useState<Nullable<HighestVolumeData>>(null);
  const [loaded, setLoaded] = useState(false);

  const { data: leaderboardData } = useGetLeaderboardData(
    PerpetualPairType.BTCUSD,
    data.map(val => val.walletAddress),
    START_TIMESTAMP,
  );

  const volumeData = useMemo(
    () => readTraderVolume(leaderboardData?.traders || []),
    [leaderboardData?.traders],
  );

  const updateItems = useCallback(() => {
    // const items: HighestVolumeData[] = [];
    setLoaded(false);

    const result: HighestVolumeData[] = data.map(item => {
      const trader = volumeData.find(
        trader => trader.trader === item.walletAddress,
      );

      return {
        rank: trader?.rank || '-',
        userName: item.userName,
        walletAddress: item.walletAddress,
        volume: trader?.volume || 0,
      };
    });

    const sortedResult = result
      .sort((a, b) => {
        if (a.volume === 0 || b.volume === 0) {
          if (a.volume === 0 && b.volume === 0) {
            return a.walletAddress.localeCompare(b.walletAddress);
          }
          return a.volume === 0 ? 1 : -1;
        }
        return Math.sign(b.volume - a.volume);
      })
      .map((value, index) => ({
        ...value,
        rank: (index + 1).toString(),
      }));

    setItems(sortedResult);
    setLoaded(true);

    if (account) {
      const userRow = result.find(
        row => row.walletAddress.toLowerCase() === account.toLowerCase(),
      );
      if (userRow) {
        setUserData(userRow);
      }
    }
  }, [account, data, volumeData]);

  useEffect(() => updateItems(), [updateItems]);

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

import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import { ethGenesisAddress } from 'utils/classifiers';
import { eventReader } from 'utils/sovryn/event-reader';
import { Pagination } from 'app/components/Pagination';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { useStaking_getStakes } from 'app/hooks/staking/useStaking_getStakes';
import { useVesting_getOriginVesting } from 'app/hooks/staking/useVesting_getOriginVesting';
import { useVesting_getRewards } from 'app/hooks/staking/useVesting_getRewards';
import { useVesting_getTeamVesting } from 'app/hooks/staking/useVesting_getTeamVesting';
import { useVesting_getVesting } from 'app/hooks/staking/useVesting_getVesting';
import { useAccount } from 'app/hooks/useAccount';
import { VestedHistoryTable } from './components/VestedHistoryTable';
import { useVesting_getFourYearVesting } from 'app/hooks/staking/useVesting_getFourYearVesting';

export function VestedHistory() {
  const { t } = useTranslation();
  const account = useAccount();
  const getStakes = useStaking_getStakes(account);
  const [loading, setLoading] = useState(false);
  const vesting = useVesting_getVesting(account);
  const rewards = useVesting_getRewards(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const vestingOrigin = useVesting_getOriginVesting(account);
  const vestingFourYear = useVesting_getFourYearVesting(account);
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>([]);
  const [eventsHistoryRewards, setEventsHistoryRewards] = useState([]) as any;
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<any>(
    [],
  );
  const [eventsHistoryVestingOrigin, setEventsHistoryVestingOrigin] = useState<
    any
  >([]);
  const [
    eventsHistoryVestingFourYear,
    setEventsHistoryVestingFourYear,
  ] = useState<any>([]);
  const [currentHistory, setCurrentHistory] = useState([]) as any;

  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(
      [
        ...eventsHistoryVesting,
        ...eventsHistoryVestingOrigin,
        ...eventsHistoryVestingTeam,
        ...eventsHistoryRewards,
        ...eventsHistoryVestingFourYear,
      ]
        .sort(
          (x, y) => dayjs(y.eventDate).valueOf() - dayjs(x.eventDate).valueOf(),
        )
        .slice(offset, offset + pageLimit),
    );
  };

  useEffect(() => {
    async function getHistory() {
      setLoading(true);
      try {
        if (rewards.value !== ethGenesisAddress) {
          await eventReader
            .getPastEvents('staking', 'TokensStaked', {
              staker: rewards.value,
            })
            .then(res => {
              const newRes = res.map(v => ({
                ...v,
                type: t(translations.stake.currentVests.assetType.reward),
              }));
              setEventsHistoryRewards(newRes);
            });
        }
        if (vesting.value !== ethGenesisAddress) {
          await eventReader
            .getPastEvents('staking', 'TokensStaked', {
              staker: vesting.value,
            })
            .then(res => {
              const newRes = res.map(v => ({
                ...v,
                type: 'Genesis SOV',
              }));
              setEventsHistoryVesting(newRes);
            });
        }
        if (vestingTeam.value !== ethGenesisAddress) {
          await eventReader
            .getPastEvents('staking', 'TokensStaked', {
              staker: vestingTeam.value,
            })
            .then(res => {
              const newRes = res.map(v => ({ ...v, type: 'Team SOV' }));
              setEventsHistoryVestingTeam(newRes);
            });
        }
        if (vestingOrigin.value !== ethGenesisAddress) {
          await eventReader
            .getPastEvents('staking', 'TokensStaked', {
              staker: vestingOrigin.value,
            })
            .then(res => {
              const newRes = res.map(v => ({ ...v, type: 'Origin SOV' }));
              setEventsHistoryVestingOrigin(newRes);
            });
        }
        if (vestingFourYear.value !== ethGenesisAddress) {
          await eventReader
            .getPastEvents('staking', 'TokensStaked', {
              staker: vestingFourYear.value,
            })
            .then(res => {
              const newRes = res.map(v => ({
                ...v,
                type: t(translations.stake.currentVests.assetType.fouryear),
              }));
              setEventsHistoryVestingFourYear(newRes);
            });
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    getHistory();
  }, [
    account,
    vestingTeam.value,
    vestingOrigin.value,
    vesting.value,
    rewards.value,
    vestingFourYear.value,
    getStakes.value,
    setEventsHistoryRewards,
    t,
  ]);

  return (
    <div className="sovryn-table tw-p-4 tw-mb-12">
      <table className="tw-w-full">
        <thead>
          <tr>
            <th className="tw-text-left assets">
              {t(translations.vestedHistory.tableHeaders.time)}
            </th>
            <th className="tw-text-left">
              {t(translations.vestedHistory.tableHeaders.vestingSchedule)}
            </th>
            <th className="tw-text-left">
              {t(translations.vestedHistory.tableHeaders.amount)}
            </th>
            <th className="tw-text-left tw-hidden lg:tw-table-cell">
              {t(translations.vestedHistory.tableHeaders.hash)}
            </th>
            <th className="tw-text-left tw-hidden lg:tw-table-cell">
              {t(translations.vestedHistory.tableHeaders.status)}
            </th>
          </tr>
        </thead>
        <tbody className="tw-mt-5 tw-font-body">
          {loading && (
            <tr key={'loading'}>
              <td colSpan={99}>
                <SkeletonRow
                  loadingText={t(translations.topUpHistory.loading)}
                />
              </td>
            </tr>
          )}
          {eventsHistoryRewards.length === 0 &&
            eventsHistoryVesting.length === 0 &&
            eventsHistoryVestingTeam.length === 0 &&
            eventsHistoryVestingOrigin.length === 0 &&
            eventsHistoryVestingFourYear.length === 0 &&
            !loading && (
              <tr key={'empty'}>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.stake.history.emptyHistory)}
                </td>
              </tr>
            )}
          {currentHistory && !loading && (
            <>
              <VestedHistoryTable items={currentHistory} />
            </>
          )}
        </tbody>
      </table>
      {currentHistory && !loading && (
        <Pagination
          totalRecords={
            eventsHistoryRewards.length +
            eventsHistoryVesting.length +
            eventsHistoryVestingTeam.length +
            eventsHistoryVestingOrigin.length +
            eventsHistoryVestingFourYear.length
          }
          pageLimit={6}
          pageNeighbours={1}
          onChange={onPageChanged}
        />
      )}
    </div>
  );
}

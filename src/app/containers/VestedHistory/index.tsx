import dayjs from 'dayjs';
import { bignumber } from 'mathjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import logoSvg from 'assets/images/tokens/sov.svg';
import { translations } from 'locales/i18n';
import { TxStatus } from 'store/global/transactions-store/types';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { weiToUSD } from 'utils/display-text/format';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LoadableValue } from '../../components/LoadableValue';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { eventReader } from 'utils/sovryn/event-reader';

import { Asset } from '../../../types/asset';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { Pagination } from '../../components/Pagination';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useVesting_getOriginVesting } from '../../hooks/staking/useVesting_getOriginVesting';
import { useVesting_getRewards } from '../../hooks/staking/useVesting_getRewards';
import { useVesting_getTeamVesting } from '../../hooks/staking/useVesting_getTeamVesting';
import { useVesting_getVesting } from '../../hooks/staking/useVesting_getVesting';
import { useVesting_getFourYearVesting } from '../../hooks/staking/useVesting_getFourYearVesting';
import { useAccount } from '../../hooks/useAccount';

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
        <tbody className="tw-mt-5 tw-font-body tw-text-xs">
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
                  History is empty.
                </td>
              </tr>
            )}
          {currentHistory && !loading && (
            <>
              <HistoryTable items={currentHistory} />
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

interface HisoryAsset {
  item: any;
}

const HisoryTableAsset: React.FC<HisoryAsset> = ({ item }) => {
  const { t } = useTranslation();
  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = useMemo(() => {
    if (item.returnVal.amount === undefined) return '';
    return bignumber(item.returnVal.amount)
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, item.returnVal.amount, SOV.decimals]);
  return (
    <tr>
      <td>
        {dayjs
          .tz(item.eventDate, 'UTC')
          .tz(dayjs.tz.guess())
          .format('L - LTS Z')}
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        <div className="assetname tw-flex tw-items-center">
          <div>
            <img src={logoSvg} className="tw-mr-3" alt="sov" />
          </div>
          <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block tw-pl-3">
            {item.type}
          </div>
        </div>
      </td>
      <td className="tw-text-left tw-font-normal tw-tracking-normal">
        {numberFromWei(item.returnValues.amount)} SOV
        <br />≈{' '}
        <LoadableValue
          value={weiToUSD(dollarValue)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
        <LinkToExplorer
          txHash={item.transactionHash}
          startLength={6}
          className="tw-text-secondary hover:tw-underline"
        />
      </td>
      <td>
        <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
          <div>
            {!item.status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {item.status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {item.status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={item.transaction_hash}
              className="tw-text-primary tw-font-normal tw-text-nowrap"
            />
          </div>
          <div>
            {!item.status && (
              <img src={iconSuccess} title="Confirmed" alt="Confirmed" />
            )}
            {item.status === TxStatus.FAILED && (
              <img src={iconRejected} title="Failed" alt="Failed" />
            )}
            {item.status === TxStatus.PENDING && (
              <img src={iconPending} title="Pending" alt="Pending" />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

interface History {
  items: any;
}

const HistoryTable: React.FC<History> = ({ items }) => {
  return (
    <>
      {items.map((item, index) => {
        return (
          <HisoryTableAsset key={item.transactionHash + index} item={item} />
        );
      })}
    </>
  );
};

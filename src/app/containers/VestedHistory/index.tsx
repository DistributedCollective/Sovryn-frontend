import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment-timezone';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { Pagination } from '../../components/Pagination';
import { Asset } from '../../../types/asset';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { numberToUSD } from 'utils/display-text/format';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LoadableValue } from '../../components/LoadableValue';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { LinkToExplorer } from '../../components/LinkToExplorer';
import { eventReader } from 'utils/sovryn/event-reader';
import { useAccount } from '../../hooks/useAccount';
import { useVesting_getRewards } from '../../hooks/staking/useVesting_getRewards';
import { useStaking_getStakes } from '../../hooks/staking/useStaking_getStakes';
import { useVesting_getVesting } from '../../hooks/staking/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../hooks/staking/useVesting_getTeamVesting';
import { useVesting_getOriginVesting } from '../../hooks/staking/useVesting_getOriginVesting';
import { TxStatus } from 'store/global/transactions-store/types';

export function VestedHistory() {
  const { t } = useTranslation();
  const account = useAccount();
  const getStakes = useStaking_getStakes(account);
  const [loading, setLoading] = useState(false);
  const vesting = useVesting_getVesting(account);
  const rewards = useVesting_getRewards(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const vestingOrigin = useVesting_getOriginVesting(account);
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>([]);
  const [eventsHistoryRewards, setEventsHistoryRewards] = useState([]) as any;
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<any>(
    [],
  );
  const [eventsHistoryVestingOrigin, setEventsHistoryVestingOrigin] = useState<
    any
  >([]);
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
      ].slice(offset, offset + pageLimit),
    );
  };

  useEffect(() => {
    async function getHistory() {
      setLoading(true);
      let reward: void, genesis: void, team: void, origin: void;
      if (rewards.value !== ethGenesisAddress) {
        reward = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: rewards.value,
          })
          .then(res => {
            const newRes = res.map(v => ({ ...v, type: 'Reward SOV' }));
            setEventsHistoryRewards(
              (newRes as any).sort(
                (x, y) =>
                  new Date(y.eventDate).getTime() -
                  new Date(x.eventDate).getTime(),
              ),
            );
          });
      }
      if (vesting.value !== ethGenesisAddress) {
        genesis = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vesting.value,
          })
          .then(res => {
            const newRes = res.map(v => ({ ...v, type: 'Genesis SOV' }));
            setEventsHistoryVesting(
              (newRes as any).sort(
                (x, y) =>
                  new Date(y.eventDate).getTime() -
                  new Date(x.eventDate).getTime(),
              ),
            );
          });
      }
      if (vestingTeam.value !== ethGenesisAddress) {
        team = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vestingTeam.value,
          })
          .then(res => {
            const newRes = res.map(v => ({ ...v, type: 'Team SOV' }));
            setEventsHistoryVestingTeam(
              (newRes as any).sort(
                (x, y) =>
                  new Date(y.eventDate).getTime() -
                  new Date(x.eventDate).getTime(),
              ),
            );
          });
      }
      if (vestingOrigin.value !== ethGenesisAddress) {
        origin = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vestingOrigin.value,
          })
          .then(res => {
            const newRes = res.map(v => ({ ...v, type: 'Origin SOV' }));
            setEventsHistoryVestingOrigin(
              (newRes as any).sort(
                (x, y) =>
                  new Date(y.eventDate).getTime() -
                  new Date(x.eventDate).getTime(),
              ),
            );
          });
      }
      try {
        Promise.all([reward, genesis, team, origin]).then(_ =>
          setLoading(false),
        );
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }

    getHistory();
  }, [
    account,
    vestingTeam.value,
    vestingOrigin.value,
    vesting.value,
    rewards.value,
    getStakes.value,
    setEventsHistoryRewards,
  ]);

  return (
    <div className="sovryn-table p-3 mb-5">
      <table className="w-100">
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
            <th className="tw-text-left hidden lg:tw-table-cell">
              {t(translations.vestedHistory.tableHeaders.hash)}
            </th>
            <th className="tw-text-left hidden lg:tw-table-cell">
              {t(translations.vestedHistory.tableHeaders.status)}
            </th>
          </tr>
        </thead>
        <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
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
            !loading && (
              <tr key={'empty'}>
                <td className="text-center" colSpan={99}>
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
            eventsHistoryVestingOrigin.length
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
        {moment
          .tz(new Date(item.eventDate), 'GMT')
          .format('DD/MM/YYYY - h:mm:ss a z')}
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
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
        <LinkToExplorer
          txHash={item.transactionHash}
          startLength={6}
          className="tw-text-theme-blue hover:tw-underline"
        />
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-between col-lg-10 col-md-12 p-0">
          <div>
            {!item.status && (
              <p className="m-0">{t(translations.common.confirmed)}</p>
            )}
            {item.status === TxStatus.FAILED && (
              <p className="m-0">{t(translations.common.failed)}</p>
            )}
            {item.status === TxStatus.PENDING && (
              <p className="m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={item.transaction_hash}
              className="text-gold font-weight-normal text-nowrap"
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

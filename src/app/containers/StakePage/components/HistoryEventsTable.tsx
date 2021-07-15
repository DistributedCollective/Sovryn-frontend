import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment-timezone';
import styled from 'styled-components/macro';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { Pagination } from '../../../components/Pagination';
import { Asset } from '../../../../types/asset';
import { useCachedAssetPrice } from '../../../hooks/trading/useCachedAssetPrice';
import { numberToUSD } from 'utils/display-text/format';
import { bignumber } from 'mathjs';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { LoadableValue } from '../../../components/LoadableValue';
import { weiTo4 } from 'utils/blockchain/math-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { StyledTable } from './StyledTable';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { eventReader } from 'utils/sovryn/event-reader';
import { useAccount } from '../../../hooks/useAccount';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useVesting_getVesting } from '../../../hooks/staking/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/staking/useVesting_getTeamVesting';
import { useVesting_getOriginVesting } from '../../../hooks/staking/useVesting_getOriginVesting';
import { TxStatus } from 'store/global/transactions-store/types';

export function HistoryEventsTable() {
  const { t } = useTranslation();
  const account = useAccount();
  const getStakes = useStaking_getStakes(account);
  const vesting = useVesting_getVesting(account);
  const vestingTeam = useVesting_getTeamVesting(account);
  const vestingOrigin = useVesting_getOriginVesting(account);
  const [eventsHistory, setEventsHistory] = useState<any>([]);
  const [eventsHistoryVesting, setEventsHistoryVesting] = useState<any>([]);
  const [eventsHistoryVestingTeam, setEventsHistoryVestingTeam] = useState<any>(
    [],
  );
  const [eventsHistoryVestingOrigin, setEventsHistoryVestingOrigin] = useState<
    any
  >([]);
  const [viewHistory, setViewHistory] = useState(false);
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(eventsHistory.slice(offset, offset + pageLimit));
  };

  useEffect(() => {
    async function getHistory() {
      let genesis: void, team: void, origin: void;
      const stake = await eventReader
        .getPastEvents('staking', 'TokensStaked', {
          staker: account,
        })
        .then(res => {
          setEventsHistory(
            (res as any).sort(
              (x, y) =>
                new Date(y.eventDate).getTime() -
                new Date(x.eventDate).getTime(),
            ),
          );
        });

      if (vesting.value !== ethGenesisAddress) {
        genesis = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vesting.value,
          })
          .then(res => {
            setEventsHistoryVesting(
              (res as any).sort(
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
            setEventsHistoryVestingTeam(
              (res as any).sort(
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
            setEventsHistoryVestingOrigin(
              (res as any).sort(
                (x, y) =>
                  new Date(y.eventDate).getTime() -
                  new Date(x.eventDate).getTime(),
              ),
            );
          });
      }
      try {
        Promise.all([stake, genesis, team, origin]).then(_ =>
          setViewHistory(false),
        );
        setViewHistory(false);
      } catch (e) {
        console.error(e);
        setViewHistory(false);
      }
    }

    if (viewHistory) getHistory();
  }, [
    account,
    viewHistory,
    vestingTeam.value,
    vestingOrigin.value,
    vesting.value,
    getStakes.value,
  ]);

  return (
    <>
      <div className="history-table tw-bg-gray-light tw-rounded-b tw-mb-10">
        <p className="tw-font-normal tw-text-lg tw-ml-6 tw-mb-1 tw-mt-16">
          {t(translations.stake.history.title)}
        </p>
        <div className="tw-rounded-lg tw-sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5">
          <StyledTable className="w-full">
            <thead>
              <tr>
                <th className="tw-text-left assets">
                  {t(translations.stake.history.stakingDate)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.history.stakedAmount)}
                </th>
                <th className="tw-text-left hidden lg:tw-table-cell">
                  {t(translations.stake.history.hash)}
                </th>
                <th className="tw-text-left hidden lg:tw-table-cell">
                  {t(translations.stake.history.status)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
              {currentHistory.length > 0 && (
                <HistoryTable items={currentHistory} />
              )}

              {viewHistory ? (
                <tr>
                  <td colSpan={5} className="tw-text-center tw-font-normal">
                    <StyledLoading className="loading">
                      <div className="loading__letter">L</div>
                      <div className="loading__letter">o</div>
                      <div className="loading__letter">a</div>
                      <div className="loading__letter">d</div>
                      <div className="loading__letter">i</div>
                      <div className="loading__letter">n</div>
                      <div className="loading__letter">g</div>
                      <div className="loading__letter">.</div>
                      <div className="loading__letter">.</div>
                      <div className="loading__letter">.</div>
                    </StyledLoading>
                  </td>
                </tr>
              ) : (
                <>
                  {eventsHistory.length === 0 &&
                    eventsHistoryVesting.length === 0 &&
                    eventsHistoryVestingTeam.length === 0 &&
                    eventsHistoryVestingOrigin.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="tw-text-center tw-font-normal"
                        >
                          <button
                            type="button"
                            className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mr-1 xl:tw-mr-7 tw-px-4 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-montserrat"
                            onClick={() => setViewHistory(true)}
                          >
                            {t(translations.stake.history.viewHistory)}
                          </button>
                        </td>
                      </tr>
                    )}
                </>
              )}
            </tbody>
          </StyledTable>
          {eventsHistory.length > 0 && (
            <Pagination
              totalRecords={eventsHistory.length}
              pageLimit={6}
              pageNeighbours={1}
              onChange={onPageChanged}
            />
          )}
        </div>
      </div>
    </>
  );
}

interface HisoryAsset {
  item: any;
  index: number;
}

const HisoryTableAsset: React.FC<HisoryAsset> = ({ item, index }) => {
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
      <td className="tw-text-left tw-font-normal">
        {weiTo4(item.returnValues.amount)} SOV
        <br />≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiTo4(dollarValue)), 4)}
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
          <HisoryTableAsset
            key={item.transactionHash}
            item={item}
            index={index}
          />
        );
      })}
    </>
  );
};

const StyledLoading = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  & > div {
    animation-name: bounce;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    &:nth-child(3) {
      animation-delay: 0.2s;
    }
    &:nth-child(4) {
      animation-delay: 0.3s;
    }
    &:nth-child(5) {
      animation-delay: 0.4s;
    }
    &:nth-child(6) {
      animation-delay: 0.5s;
    }
    &:nth-child(7) {
      animation-delay: 0.6s;
    }
    &:nth-child(8) {
      animation-delay: 0.8s;
    }
    &:nth-child(9) {
      animation-delay: 1s;
    }
    &:nth-child(10) {
      animation-delay: 1.2s;
    }
  }
  @keyframes bounce {
    0% {
      transform: translateY(0px);
    }
    40% {
      transform: translateY(-10px);
    }
    80%,
    100% {
      transform: translateY(0px);
    }
  }
`;

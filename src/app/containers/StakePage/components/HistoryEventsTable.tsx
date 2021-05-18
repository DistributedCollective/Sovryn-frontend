import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';
import moment from 'moment-timezone';
import styled from 'styled-components/macro';
import logoSvg from 'assets/images/sovryn-icon.svg';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { ethGenesisAddress } from 'utils/classifiers';
import { StyledTable } from './StyledTable';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { eventReader } from 'utils/sovryn/event-reader';
import { useAccount } from '../../../hooks/useAccount';
import { useStaking_getStakes } from '../../../hooks/staking/useStaking_getStakes';
import { useVesting_getVesting } from '../../../hooks/staking/useVesting_getVesting';
import { useVesting_getTeamVesting } from '../../../hooks/staking/useVesting_getTeamVesting';
import { useVesting_getOriginVesting } from '../../../hooks/staking/useVesting_getOriginVesting';

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

  useEffect(() => {
    async function getHistory() {
      let genesys: void, team: void, origin: void;
      const stake = await eventReader
        .getPastEvents('staking', 'TokensStaked', {
          staker: account,
        })
        .then(res => {
          setEventsHistory(res);
        });

      if (vesting.value !== ethGenesisAddress) {
        genesys = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vesting.value,
          })
          .then(res => {
            setEventsHistoryVesting(res);
          });
      }
      if (vestingTeam.value !== ethGenesisAddress) {
        team = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vestingTeam.value,
          })
          .then(res => {
            setEventsHistoryVestingTeam(res);
          });
      }
      if (vestingOrigin.value !== ethGenesisAddress) {
        origin = await eventReader
          .getPastEvents('staking', 'TokensStaked', {
            staker: vestingOrigin.value,
          })
          .then(res => {
            setEventsHistoryVestingOrigin(res);
          });
      }
      try {
        Promise.all([stake, genesys, team, origin]).then(_ =>
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
      <p className="tw-font-normal tw-text-lg tw-ml-6 tw-mb-1 tw-mt-16">
        {t(translations.stake.history.title)}
      </p>
      <div className="tw-bg-gray-light tw-rounded-b tw-shadow max-h-96 tw-overflow-y-auto tw-mb-10">
        <div className="tw-rounded-lg tw-border tw-sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5 tw-max-h-96 tw-overflow-y-auto">
          <StyledTable className="w-full">
            <thead>
              <tr>
                <th className="tw-text-left assets">
                  {t(translations.stake.history.asset)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.history.stakedAmount)}
                </th>
                <th className="tw-text-left hidden lg:tw-table-cell">
                  {t(translations.stake.history.stakingDate)}
                </th>
                <th className="tw-text-left hidden lg:tw-table-cell">
                  {t(translations.stake.history.totalStaked)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-montserrat tw-text-xs">
              {eventsHistory.length > 0 && (
                <HistoryTable items={eventsHistory} />
              )}
              {eventsHistoryVesting.length > 0 && (
                <HistoryTable items={eventsHistoryVesting} />
              )}
              {eventsHistoryVestingTeam.length > 0 && (
                <HistoryTable items={eventsHistoryVestingTeam} />
              )}
              {eventsHistoryVestingOrigin.length > 0 && (
                <HistoryTable items={eventsHistoryVestingOrigin} />
              )}
              {viewHistory ? (
                <tr>
                  <td colSpan={4} className="tw-text-center tw-font-normal">
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
                          colSpan={4}
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
        </div>
      </div>
    </>
  );
}

interface History {
  items: any;
}

const HistoryTable: React.FC<History> = ({ items }) => {
  return (
    <>
      {items.map(item => {
        return (
          <tr key={item.id}>
            <td>
              <div className="username tw-flex tw-items-center">
                <div>
                  <img src={logoSvg} className="tw-ml-3 tw-mr-3" alt="sov" />
                </div>
                <div className="tw-text-sm tw-font-normal tw-hidden xl:tw-block">
                  SOV
                </div>
              </div>
            </td>
            <td className="tw-text-left tw-font-normal">
              {numberFromWei(item.returnValues.amount)} SOV
              <br />
            </td>
            <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
              <div className="tw-flex tw-items-center">
                <div>
                  {moment
                    .tz(
                      new Date(parseInt(item.returnValues.lockedUntil) * 1e3),
                      'GMT',
                    )
                    .format('DD/MM/YYYY - h:mm:ss a z')}
                  <br />
                  <LinkToExplorer
                    txHash={item.transactionHash}
                    className="tw-text-gold hover:tw-text-gold hover:tw-underline tw-font-medium tw-font-montserrat tw-tracking-normal"
                  />
                </div>
              </div>
            </td>
            <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal">
              {numberFromWei(item.returnValues.totalStaked)} SOV
            </td>
          </tr>
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

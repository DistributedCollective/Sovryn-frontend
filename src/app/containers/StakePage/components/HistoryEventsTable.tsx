import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import axios from 'axios';
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
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { StyledTable } from './StyledTable';
import { LinkToExplorer } from '../../../components/LinkToExplorer';
import { useAccount } from '../../../hooks/useAccount';
import { TxStatus } from 'store/global/transactions-store/types';
import { backendUrl } from 'utils/classifiers';
import { useSelector } from 'react-redux';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';

export function HistoryEventsTable() {
  const { t } = useTranslation();
  const account = useAccount();
  const { chainId } = useSelector(selectWalletProvider);
  const [eventsHistory, setEventsHistory] = useState<any>([]);
  const [isHistoryLoading, seIsHistoryLoading] = useState(false);
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(eventsHistory.slice(offset, offset + pageLimit));
  };

  const getHistory = useCallback(() => {
    seIsHistoryLoading(true);
    axios
      .get(`${backendUrl[chainId]}/events/stake/${account}`)
      .then(({ data }) => {
        setEventsHistory(data?.events);
        seIsHistoryLoading(false);
      });
  }, [account, chainId]);

  return (
    <>
      <div className="history-table tw-bg-gray-light tw-rounded-b tw-mb-10">
        <p className="tw-font-normal tw-text-lg tw-ml-6 tw-mb-1 tw-mt-16">
          {t(translations.stake.history.title)}
        </p>
        <div className="tw-rounded-lg tw-sovryn-table tw-pt-1 tw-pb-0 tw-pr-5 tw-pl-5 tw-mb-5">
          <StyledTable className="tw-w-full">
            <thead>
              <tr>
                <th className="tw-text-left assets">
                  {t(translations.stake.history.stakingDate)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.history.action)}
                </th>
                <th className="tw-text-left">
                  {t(translations.stake.history.stakedAmount)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.history.hash)}
                </th>
                <th className="tw-text-left tw-hidden lg:tw-table-cell">
                  {t(translations.stake.history.status)}
                </th>
              </tr>
            </thead>
            <tbody className="tw-mt-5 tw-font-body tw-text-xs">
              {currentHistory.length > 0 && (
                <HistoryTable items={currentHistory} />
              )}

              {isHistoryLoading ? (
                <tr>
                  <td colSpan={5} className="tw-text-center tw-font-normal">
                    <StyledLoading className="loading">
                      {t(translations.stake.history.loading)
                        .split('')
                        .map((item, index) => (
                          <div className="loading__letter" key={index}>
                            {item}
                          </div>
                        ))}
                    </StyledLoading>
                  </td>
                </tr>
              ) : (
                <>
                  {eventsHistory.length === 0 && (
                    <tr>
                      <td colSpan={5} className="tw-text-center tw-font-normal">
                        <button
                          type="button"
                          className="tw-text-gold tw-tracking-normal hover:tw-text-gold hover:tw-no-underline hover:tw-bg-gold hover:tw-bg-opacity-30 tw-mr-1 xl:tw-mr-7 tw-px-4 tw-py-2 tw-bordered tw-transition tw-duration-500 tw-ease-in-out tw-rounded-full tw-border tw-border-gold tw-text-sm tw-font-light tw-font-body"
                          onClick={getHistory}
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

type HistoryItem = {
  action: string;
  amount: string;
  lockedUntil: number;
  status?: string;
  staker: string; //address
  timestamp: number;
  txHash: string;
};

interface HistoryAsset {
  item: HistoryItem;
  index: number;
}

const getActionName = action => {
  switch (action) {
    case 'Stake':
      return <Trans i18nKey={translations.stake.history.actions.stake} />;
    case 'Unstake':
      return <Trans i18nKey={translations.stake.history.actions.unstake} />;
    case 'Fee Withdraw':
      return <Trans i18nKey={translations.stake.history.actions.feeWithdraw} />;
    case 'Increase Stake':
      return <Trans i18nKey={translations.stake.history.actions.increase} />;
    case 'Extend Stake':
      return <Trans i18nKey={translations.stake.history.actions.extend} />;
    case 'Delegate':
      return <Trans i18nKey={translations.stake.history.actions.delegate} />;
    case 'Withdraw':
      return <Trans i18nKey={translations.stake.history.actions.withdraw} />;
    default:
      return action;
  }
};

const HistoryTableAsset: React.FC<HistoryAsset> = ({ item }) => {
  const { t } = useTranslation();
  const SOV = AssetsDictionary.get(Asset.SOV);
  const dollars = useCachedAssetPrice(Asset.SOV, Asset.USDT);
  const dollarValue = useMemo(() => {
    if (!item.amount) return '';
    return bignumber(item.amount)
      .mul(dollars.value)
      .div(10 ** SOV.decimals)
      .toFixed(0);
  }, [dollars.value, item.amount, SOV.decimals]);
  return (
    <tr>
      <td>
        {moment
          .tz(new Date(item.timestamp * 1e3), 'GMT')
          .format('DD/MM/YYYY - h:mm:ss a z')}
      </td>
      <td>{getActionName(item.action)}</td>
      <td className="tw-text-left tw-font-normal">
        {item.action !== t(translations.stake.actions.delegate) ? (
          <>
            {numberFromWei(item.amount)} SOV
            <br />≈{' '}
            <LoadableValue
              value={numberToUSD(Number(weiTo4(dollarValue)), 4)}
              loading={dollars.loading}
            />
          </>
        ) : (
          <>-</>
        )}
      </td>
      <td className="tw-text-left tw-hidden lg:tw-table-cell tw-font-normal tw-relative">
        <LinkToExplorer
          txHash={item.txHash}
          startLength={6}
          className="tw-text-theme-blue hover:tw-underline"
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
              txHash={item.txHash}
              className="tw-text-gold tw-font-normal tw-whitespace-nowrap"
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
          <HistoryTableAsset
            key={item.txHash + item.newBalance}
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
    animation-duration: 4s;
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
    &:nth-child(11) {
      animation-delay: 1.4s;
    }
    &:nth-child(12) {
      animation-delay: 1.6s;
    }
    &:nth-child(13) {
      animation-delay: 1.8s;
    }
    &:nth-child(14) {
      animation-delay: 2s;
    }
    &:nth-child(15) {
      animation-delay: 2.2s;
    }
    &:nth-child(16) {
      animation-delay: 2.4s;
    }
    &:nth-child(17) {
      animation-delay: 2.6s;
    }
    &:nth-child(18) {
      animation-delay: 2.8s;
    }
    &:nth-child(19) {
      animation-delay: 3s;
    }
    &:nth-child(20) {
      animation-delay: 3.2s;
    }
    &:nth-child(21) {
      animation-delay: 3.4s;
    }
    &:nth-child(22) {
      animation-delay: 3.6s;
    }
    &:nth-child(23) {
      animation-delay: 3.8s;
    }
    &:nth-child(24) {
      animation-delay: 4s;
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

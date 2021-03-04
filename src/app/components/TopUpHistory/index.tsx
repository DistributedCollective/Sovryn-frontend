/**
 *
 * TopUpHistory
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';
import { useAccount, useIsConnected } from '../../hooks/useAccount';
import { useDispatch, useSelector } from 'react-redux';
import { selectFastBtcForm } from '../../containers/FastBtcForm/selectors';
import { actions } from '../../containers/FastBtcForm/slice';
import { SkeletonRow } from '../Skeleton/SkeletonRow';
import { LinkToExplorer } from '../LinkToExplorer';
import { weiToFixed } from '../../../utils/blockchain/math-helpers';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { Asset } from '../../../types/asset';
import { DisplayDate } from '../ActiveUserLoanContainer/components/DisplayDate';
import { numberToUSD } from '../../../utils/display-text/format';

export function TopUpHistory() {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  const account = useAccount();
  const state = useSelector(selectFastBtcForm);
  const dispatch = useDispatch();

  const asset = AssetsDictionary.get(Asset.BTC);

  useEffect(() => {
    if (isConnected && account) {
      dispatch(actions.changeReceiverAddress(account));
    }
  }, [account, isConnected, dispatch]);

  return (
    <section>
      <div className="tw-flex tw-items-center tw-justify-start tw-mb-3">
        <h2 className="tw-flex-shrink-0 tw-flex-grow-0 sov-title">
          {t(translations.topUpHistory.meta.title)}
        </h2>
      </div>
      <div className="sovryn-table tw-p-3 tw-mb-5">
        <table className="tw-w-full">
          <thead>
            <tr>
              <th className="tw-text-left tw-hidden md:tw-table-cell">
                {t(translations.topUpHistory.tableHeaders.time)}
              </th>
              <th className="tw-text-left tw-hidden md:tw-table-cell">
                {t(translations.topUpHistory.tableHeaders.asset)}
              </th>
              <th className="tw-text-right">
                {t(translations.topUpHistory.tableHeaders.amount)}
              </th>
              <th className="tw-text-right">
                <span className="tw-hidden md:tw-inline">
                  {t(translations.topUpHistory.tableHeaders.depositTx)}
                </span>
                <span className="tw-inline md:tw-hidden">
                  {t(translations.topUpHistory.tableHeaders.txHash)}
                </span>
              </th>
              <th className="tw-text-right tw-hidden md:tw-table-cell">
                {t(translations.topUpHistory.tableHeaders.transferTx)}
              </th>
            </tr>
          </thead>
          <tbody className="tw-mt-5">
            {!state.history.length && !state.isHistoryLoading && (
              <tr>
                <td colSpan={99}>{t(translations.topUpHistory.emptyState)}</td>
              </tr>
            )}
            {state.isHistoryLoading && !state.history.length && (
              <tr>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={
                      !account
                        ? t(translations.topUpHistory.walletHistory)
                        : t(translations.topUpHistory.loading)
                    }
                  />
                </td>
              </tr>
            )}
            {state.history.map(item => (
              <tr key={item.txHash}>
                <td className="tw-text-left tw-hidden md:tw-table-cell">
                  <DisplayDate
                    timestamp={(
                      new Date(item.dateAdded).getTime() / 1000
                    ).toString()}
                  />
                </td>
                <td className="tw-text-left tw-hidden md:tw-table-cell">
                  <img
                    className="tw-inline"
                    style={{ height: '40px' }}
                    src={asset.logoSvg}
                    alt={asset.asset}
                  />{' '}
                  {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                </td>
                <td>
                  <div className="tw-flex tw-flex-nowrap tw-text-right tw-justify-end">
                    <small>{weiToFixed(item.valueBtc * 1e10, 4)}&nbsp;</small>
                    <small className="text-muted">
                      {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                    </small>
                  </div>
                  <div className="tw-flex tw-flex-nowrap tw-mt-1 tw-text-right tw-justify-end">
                    <small>{numberToUSD(item.valueUsd, 4)}</small>
                  </div>
                </td>
                <td
                  className={`tw-text-right ${
                    item.type !== 'deposit' && 'tw-hidden md:tw-table-cell'
                  }`}
                >
                  {item.type === 'deposit' && (
                    <LinkToExplorer
                      txHash={item.txHash}
                      realBtc
                      className="text-gold"
                    />
                  )}
                </td>
                <td
                  className={`tw-text-right ${
                    item.type !== 'transfer' && 'tw-hidden md:tw-table-cell'
                  }`}
                >
                  {item.type === 'transfer' && (
                    <LinkToExplorer
                      txHash={item.txHash}
                      className="text-gold"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

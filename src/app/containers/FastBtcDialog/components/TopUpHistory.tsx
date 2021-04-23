/**
 *
 * TopUpHistory
 *
 */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { LinkToExplorer } from 'app/components/LinkToExplorer';

import { translations } from '../../../../locales/i18n';
import { Asset } from '../../../../types/asset';
import { weiToFixed } from '../../../../utils/blockchain/math-helpers';
import { AssetsDictionary } from '../../../../utils/dictionaries/assets-dictionary';
import { DisplayDate } from '../../../components/ActiveUserLoanContainer/components/DisplayDate';
import { SkeletonRow } from '../../../components/Skeleton/SkeletonRow';
import { useAccount, useIsConnected } from '../../../hooks/useAccount';
import { selectFastBtcDialog } from '../selectors';
import { actions } from '../slice';

export function TopUpHistory() {
  const { t } = useTranslation();

  const isConnected = useIsConnected();
  const account = useAccount();
  const state = useSelector(selectFastBtcDialog);
  const dispatch = useDispatch();

  const asset = AssetsDictionary.get(Asset.RBTC);

  useEffect(() => {
    if (isConnected && account) {
      dispatch(actions.init());
    }
  }, [account, isConnected, dispatch]);

  useEffect(() => {
    if (state.ready && account) {
      dispatch(actions.getHistory(account));

      const timer = setInterval(() => {
        dispatch(actions.getHistory(account));
      }, 15e3);

      return () => clearInterval(timer);
    }
  }, [state.ready, account, dispatch]);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
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
          <tbody className="tw-mt-12">
            {state.history.items.length === 0 && !state.history.loading && (
              <tr>
                <td className="text-center" colSpan={99}>
                  {t(translations.topUpHistory.emptyState)}
                </td>
              </tr>
            )}
            {state.history.loading && !state.history.items.length && (
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
            {state.history.items.map(item => (
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
                    <small className="tw-text-muted">
                      {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                    </small>
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
                      className="tw-text-gold"
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
                      className="tw-text-gold"
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

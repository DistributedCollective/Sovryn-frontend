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
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th className="text-left d-none d-md-table-cell">
                {t(translations.topUpHistory.tableHeaders.time)}
              </th>
              <th className="text-left d-none d-md-table-cell">
                {t(translations.topUpHistory.tableHeaders.asset)}
              </th>
              <th className="text-right">
                {t(translations.topUpHistory.tableHeaders.amount)}
              </th>
              <th className="text-right">
                <span className="d-none d-md-inline">
                  {t(translations.topUpHistory.tableHeaders.depositTx)}
                </span>
                <span className="d-inline d-md-none">
                  {t(translations.topUpHistory.tableHeaders.txHash)}
                </span>
              </th>
              <th className="text-right d-none d-md-table-cell">
                {t(translations.topUpHistory.tableHeaders.transferTx)}
              </th>
            </tr>
          </thead>
          <tbody className="mt-5">
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
                <td className="text-left d-none d-md-table-cell">
                  <DisplayDate
                    timestamp={(
                      new Date(item.dateAdded).getTime() / 1000
                    ).toString()}
                  />
                </td>
                <td className="text-left d-none d-md-table-cell">
                  <img
                    className="d-inline"
                    style={{ height: '40px' }}
                    src={asset.logoSvg}
                    alt={asset.asset}
                  />{' '}
                  {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                </td>
                <td>
                  <div className="d-flex flex-nowrap text-right justify-content-end">
                    <small>{weiToFixed(item.valueBtc * 1e10, 4)}&nbsp;</small>
                    <small className="text-muted">
                      {item.type === 'deposit' ? 'BTC' : 'rBTC'}
                    </small>
                  </div>
                </td>
                <td
                  className={`text-right ${
                    item.type !== 'deposit' && 'd-none d-md-table-cell'
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
                  className={`text-right ${
                    item.type !== 'transfer' && 'd-none d-md-table-cell'
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

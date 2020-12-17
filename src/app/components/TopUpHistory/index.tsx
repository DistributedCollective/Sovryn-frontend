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

  useEffect(() => {
    console.log(state.history);
  }, [state.history]);

  return (
    <section>
      <div className="d-flex align-items-center justify-content-start mb-3">
        <h2 className="flex-shrink-0 flex-grow-0 mr-3">
          {t(translations.topUpHistory.meta.title)}
        </h2>
      </div>
      <div className="sovryn-border sovryn-table p-3 mb-5">
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
                  <div className="d-flex flex-nowrap mt-1 text-right justify-content-end">
                    <small>{numberToUSD(item.valueUsd, 4)}</small>
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
                {/*<td>*/}
                {/*  <div*/}
                {/*    className="d-flex flex-row justify-content-between w-100"*/}
                {/*  >*/}
                {/*    <div className="d-flex flex-row align-items-center mr-3">*/}
                {/*      <div className="mr-3">*/}
                {/*        <Icon*/}
                {/*          icon={*/}
                {/*            item.type === 'deposit'*/}
                {/*              ? 'chevron-right'*/}
                {/*              : 'chevron-left'*/}
                {/*          }*/}
                {/*        />*/}
                {/*      </div>*/}
                {/*      <LinkToExplorer*/}
                {/*        txHash={item.txHash}*/}
                {/*        realBtc={item.type === 'deposit'}*/}
                {/*      />*/}
                {/*    </div>*/}
                {/*    <div>*/}
                {/*      {weiToFixed(item.valueBtc * 1e10, 4)}{' '}*/}
                {/*      <span className="text-muted">*/}
                {/*        {item.type === 'deposit' ? 'BTC' : 'rBTC'}*/}
                {/*      </span>{' '}*/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*</td>*/}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

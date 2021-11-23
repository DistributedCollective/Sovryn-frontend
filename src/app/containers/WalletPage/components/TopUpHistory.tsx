import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import {
  HistoryItem,
  useDepositSocket,
} from 'app/pages/FastBtcPage/hooks/useDepositSocket';
import { useAccount } from 'app/hooks/useAccount';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { Asset } from 'types/asset';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { DisplayDate } from 'app/components/ActiveUserLoanContainer/components/DisplayDate';
import { toNumberFormat } from 'utils/display-text/format';
import { AssetSymbolRenderer } from 'app/components/AssetSymbolRenderer';
import { btcInSatoshis } from 'app/constants';

export const TopUpHistory: React.FC = () => {
  const { t } = useTranslation();

  const account = useAccount();

  const { ready, getDepositHistory } = useDepositSocket();

  const [state, setState] = useState<{
    items: HistoryItem[];
    loading: boolean;
  }>({ items: [], loading: false });

  const asset = AssetsDictionary.get(Asset.RBTC);

  const sortedHistoryItems = useMemo(
    () =>
      [...state.items].sort(
        (x, y) =>
          new Date(y.dateAdded).getTime() - new Date(x.dateAdded).getTime(),
      ),
    [state.items],
  );

  const getHistory = useCallback(() => {
    if (ready && account) {
      setState(prevState => ({ ...prevState, loading: true }));
      getDepositHistory(account)
        .then(response => {
          setState({ loading: false, items: response });
        })
        .catch(error => {
          console.error(error);
          setState({ loading: false, items: [] });
        });
    }
  }, [ready, account, getDepositHistory]);

  useEffect(() => {
    if (ready && account) {
      getHistory();

      const timer = setInterval(() => {
        getHistory();
      }, 15e3);

      return () => clearInterval(timer);
    }
  }, [ready, account, getHistory]);

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
            {state.items.length === 0 && !state.loading && (
              <tr>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.topUpHistory.emptyState)}
                </td>
              </tr>
            )}
            {state.loading && !state.items.length && (
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
            {sortedHistoryItems.map(item => (
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
                  {item.type === 'deposit' ? (
                    'BTC'
                  ) : (
                    <AssetSymbolRenderer asset={Asset.RBTC} />
                  )}
                </td>
                <td>
                  <div className="tw-flex tw-flex-nowrap tw-text-right tw-justify-end">
                    <small>
                      {toNumberFormat(item.valueBtc / btcInSatoshis, 6)}
                    </small>{' '}
                    <small className="tw-text-gray-6">
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
                      className="tw-text-primary"
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
                      className="tw-text-primary"
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
};

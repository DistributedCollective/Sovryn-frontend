import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { fromWei } from 'utils/blockchain/math-helpers';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetDetails } from 'utils/models/asset-details';

import { translations } from '../../../locales/i18n';
import { Pagination } from '../../components/Pagination';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useAccount } from '../../hooks/useAccount';
import { useGetSwapHistoryQuery } from 'utils/graphql/rsk/generated';
import { AssetRow, IAssetRowData } from './components/AssetRow';

interface ISwapHistoryProps {
  perPage?: number;
}

export const SwapHistory: React.FC<ISwapHistoryProps> = ({ perPage = 6 }) => {
  const transactions = useSelector(selectTransactionArray);
  const account = useAccount();
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();
  const [hasOngoingTransactions, setHasOngoingTransactions] = useState(false);
  const [page, setPage] = useState(1);

  const { data, loading } = useGetSwapHistoryQuery({
    variables: { user: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });

  const history = useMemo(() => {
    if (loading || !data) return [];

    return data.swaps.map(item => ({
      fromToken: item.fromToken.id,
      fromAmount: item.fromAmount,
      toToken: item.toToken.id,
      toAmount: item.toAmount,
      timestamp: item.transaction.timestamp,
      transactionHash: item.transaction.id,
    }));
  }, [data, loading]);

  const onPageChanged = useCallback(data => setPage(data.currentPage), []);

  const items = useMemo(
    () => history.slice(page * perPage - perPage, page * perPage),
    [perPage, page, history],
  );
  const onGoingTransactions = useMemo(() => {
    return transactions
      .filter(
        tx =>
          tx.type === TxType.CONVERT_BY_PATH &&
          [TxStatus.FAILED, TxStatus.PENDING].includes(tx.status),
      )
      .map(item => {
        const { customData } = item;

        if (!hasOngoingTransactions) {
          setHasOngoingTransactions(true);
        }

        const assetFrom = assets.find(
          currency => currency.asset === customData?.sourceToken,
        );
        const assetTo = assets.find(
          currency => currency.asset === customData?.targetToken,
        );

        const data: IAssetRowData = {
          status: item.status,
          timestamp: customData?.date,
          transactionHash: item.transactionHash,
          fromAmount: fromWei(customData?.amount),
          toAmount: fromWei(customData?.minReturn) || null,
        };

        return (
          <AssetRow
            key={item.transactionHash}
            data={data}
            itemFrom={assetFrom!}
            itemTo={assetTo!}
          />
        );
      });
  }, [assets, hasOngoingTransactions, transactions]);

  return (
    <section>
      <p className="tw-font-normal tw-m-0 tw-px-4">
        {t(translations.swapHistory.recentSwapHistory)}
      </p>
      <div className="tw-p-4 tw-pt-0 tw-mb-12">
        <table className="tw-table tw-w-full">
          {history.length !== 0 && !loading && (
            <thead>
              <tr className="tw-mt-5">
                <th className="tw-hidden lg:tw-table-cell">
                  {t(translations.swapHistory.tableHeaders.time)}
                </th>
                <th className="tw-hidden lg:tw-table-cell">
                  {t(translations.swapHistory.tableHeaders.from)}
                </th>
                <th>{t(translations.swapHistory.tableHeaders.amountSent)}</th>
                <th>{t(translations.swapHistory.tableHeaders.to)}</th>
                <th className="tw-hidden lg:tw-table-cell">
                  {t(translations.swapHistory.tableHeaders.amountReceived)}
                </th>
                <th>{t(translations.swapHistory.tableHeaders.status)}</th>
              </tr>
            </thead>
          )}
          <tbody className="tw-mt-12">
            {loading && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.loading)}
                  />
                </td>
              </tr>
            )}
            {!hasOngoingTransactions && history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.swapHistory.emptyState)}
                </td>
              </tr>
            )}
            {onGoingTransactions}
            {items.map(item => {
              let assetFrom = {} as AssetDetails;
              let assetTo = {} as AssetDetails;
              assets.map(currency => {
                if (
                  getContractNameByAddress(item.fromToken)?.includes(
                    currency.asset,
                  )
                ) {
                  assetFrom = currency;
                }
                if (
                  getContractNameByAddress(item.toToken)?.includes(
                    currency.asset,
                  )
                ) {
                  assetTo = currency;
                }
                return null;
              });

              return (
                <AssetRow
                  key={item.transactionHash}
                  data={item}
                  itemFrom={assetFrom}
                  itemTo={assetTo}
                />
              );
            })}
          </tbody>
        </table>
        {history.length > 0 && (
          <Pagination
            totalRecords={history.length}
            pageLimit={perPage}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )}
      </div>
    </section>
  );
};

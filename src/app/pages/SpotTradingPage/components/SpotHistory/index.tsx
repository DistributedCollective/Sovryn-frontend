import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { useSelector } from 'react-redux';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { AssetRow } from './AssetRow';
import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Pagination } from 'app/components/Pagination';
import { useGetSwapHistoryQuery } from 'utils/graphql/rsk/generated';
import { fromWei } from 'web3-utils';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { AssetDetails } from 'utils/models/asset-details';

interface ISpotHistoryProps {
  perPage?: number;
}

export const SpotHistory: React.FC<ISpotHistoryProps> = ({ perPage = 6 }) => {
  const transactions = useSelector(selectTransactionArray);
  const account = useAccount();
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();

  const [page, setPage] = useState(1);

  const { data, loading } = useGetSwapHistoryQuery({
    variables: { user: account.toLowerCase() },
    pollInterval: APOLLO_POLL_INTERVAL,
  });

  const history = useMemo(() => {
    if (loading || !data) return [];

    return data.swaps
      .map(item => {
        const { assetFrom, assetTo } = extractAssets(
          item.fromToken.id,
          item.toToken.id,
        );

        if (!assetFrom || !assetTo) return null;
        return {
          toAmount: item.toAmount,
          fromAmount: item.fromAmount,
          timestamp: item.transaction.timestamp,
          transactionHash: item.transaction.id,
          assetFrom,
          assetTo,
        };
      })
      .filter(item => item);
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

        const assetFrom = assets.find(
          currency => currency.asset === customData?.sourceToken,
        );
        const assetTo = assets.find(
          currency => currency.asset === customData?.targetToken,
        );
        if (!assetFrom || !assetTo) return null;

        const data = {
          status: item.status,
          timestamp: customData?.date,
          transactionHash: item.transactionHash,
          fromAmount: fromWei(customData?.amount),
          toAmount: fromWei(customData?.minReturn) || null,
          assetFrom,
          assetTo,
        };

        return <AssetRow key={item.transactionHash} {...data} />;
      })
      .filter(item => item);
  }, [assets, transactions]);

  return (
    <section>
      <div className="tw-mb-12">
        <table className="tw-table tw-table-auto">
          <thead>
            <tr>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.spotHistory.tableHeaders.time)}
              </th>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.spotHistory.tableHeaders.pair)}
              </th>
              <th>{t(translations.spotHistory.tableHeaders.orderType)}</th>
              <th>{t(translations.spotHistory.tableHeaders.amountPaid)}</th>
              <th className="tw-hidden lg:tw-table-cell">
                {t(translations.spotHistory.tableHeaders.amountReceived)}
              </th>
              <th>{t(translations.spotHistory.tableHeaders.status)}</th>
            </tr>
          </thead>
          <tbody className="tw-mt-12">
            {loading && history.length === 0 && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow
                    loadingText={t(translations.topUpHistory.loading)}
                  />
                </td>
              </tr>
            )}
            {history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="tw-text-center" colSpan={99}>
                  {t(translations.spotHistory.emptyState)}
                </td>
              </tr>
            )}
            {onGoingTransactions}
            {items.map(item => {
              if (!item) {
                return null;
              }
              return <AssetRow key={item?.transactionHash} {...item} />;
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

const extractAssets = (fromToken, toToken) => {
  const assets = AssetsDictionary.list();

  let assetFrom = {} as AssetDetails;
  let assetTo = {} as AssetDetails;

  assets.map(currency => {
    if (getContractNameByAddress(fromToken)?.includes(currency.asset)) {
      assetFrom = currency;
    }
    if (getContractNameByAddress(toToken)?.includes(currency.asset)) {
      assetTo = currency;
    }
    return null;
  });

  return {
    assetFrom,
    assetTo,
  };
};

import { bignumber } from 'mathjs';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconSuccess from 'assets/images/icon-success.svg';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { fromWei } from 'utils/blockchain/math-helpers';
import { APOLLO_POLL_INTERVAL } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { AssetDetails } from 'utils/models/asset-details';

import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from '../../components/AssetRenderer';
import { LoadableValue } from '../../components/LoadableValue';
import { Pagination } from '../../components/Pagination';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useAccount } from '../../hooks/useAccount';
import { Nullable } from 'types';
import { useGetSwapHistoryQuery } from 'utils/graphql/rsk/generated';
import { toNumberFormat } from 'utils/display-text/format';

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

  const onPageChanged = data => setPage(data.currentPage);

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

        const data: AssetRowData = {
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

interface AssetRowData {
  status?: TxStatus;
  timestamp: number;
  transactionHash: string;
  fromAmount: string;
  toAmount: Nullable<string>;
}

interface IAssetProps {
  data: AssetRowData;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
}

const AssetRow: React.FC<IAssetProps> = ({ data, itemFrom, itemTo }) => {
  const { t } = useTranslation();
  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);
  const dollarValue = useMemo(() => {
    if (data.toAmount === null) return '';
    return bignumber(data.toAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, data.toAmount, itemTo.decimals]);

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <img
          className="tw-hidden lg:tw-inline tw-mr-1"
          style={{ height: '29px' }}
          src={itemFrom.logoSvg}
          alt={itemFrom.asset}
        />{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td>
        {toNumberFormat(data.fromAmount, 4)}{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td>
        <img
          className="lg:tw-inline tw-mr-1"
          style={{ height: '29px' }}
          src={itemTo.logoSvg}
          alt={itemTo.asset}
        />{' '}
        <AssetRenderer asset={itemTo.asset} />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <div>
          {toNumberFormat(data.toAmount || 0, 4)}{' '}
          <AssetRenderer asset={itemTo.asset} />
        </div>
        ≈{' '}
        <LoadableValue
          value={toNumberFormat(dollarValue, 2) || '0'}
          loading={dollars.loading}
        />
      </td>
      <td className="sm:tw-w-48">
        <div className="tw-flex tw-items-center tw-justify-between tw-p-0">
          <div>
            {!data.status && (
              <p className="tw-m-0">{t(translations.common.confirmed)}</p>
            )}
            {data.status === TxStatus.FAILED && (
              <p className="tw-m-0">{t(translations.common.failed)}</p>
            )}
            {data.status === TxStatus.PENDING && (
              <p className="tw-m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={data.transactionHash}
              className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
              startLength={5}
              endLength={5}
            />
          </div>
          <div className="tw-hidden sm:tw-block lg:tw-hidden xl:tw-block">
            {!data.status && (
              <img
                src={iconSuccess}
                title={t(translations.common.confirmed)}
                alt={t(translations.common.confirmed)}
              />
            )}
            {data.status === TxStatus.FAILED && (
              <img
                src={iconRejected}
                title={t(translations.common.failed)}
                alt={t(translations.common.failed)}
              />
            )}
            {data.status === TxStatus.PENDING && (
              <img
                className="tw-animate-spin"
                src={iconPending}
                title={t(translations.common.pending)}
                alt={t(translations.common.pending)}
              />
            )}
          </div>
        </div>
      </td>
    </tr>
  );
};

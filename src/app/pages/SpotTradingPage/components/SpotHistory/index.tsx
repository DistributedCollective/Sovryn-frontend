import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import { AssetDetails } from 'utils/models/asset-details';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { useSelector } from 'react-redux';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { getOrder } from 'app/pages/SpotTradingPage/types';
import { useTradeHistoryRetry } from 'app/hooks/useTradeHistoryRetry';
import { AssetRow } from './AssetRow';
import { useAccount } from 'app/hooks/useAccount';
import { translations } from 'locales/i18n';
import { SkeletonRow } from 'app/components/Skeleton/SkeletonRow';
import { Pagination } from 'app/components/Pagination';

export const SpotHistory: React.FC = () => {
  const transactions = useSelector(selectTransactionArray);
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState<any[]>([]);
  const [currentHistory, setCurrentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();
  const retry = useTradeHistoryRetry();

  const cancelTokenSource = useRef<CancelTokenSource>();

  const getData = useCallback(() => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    cancelTokenSource.current = axios.CancelToken.source();

    axios
      .get(`${url}/events/conversion-swap/${account}`, {
        cancelToken: cancelTokenSource.current.token,
      })
      .then(res => {
        setHistory(
          res.data
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime(),
            )
            .map(item => {
              const { assetFrom, assetTo } = extractAssets(
                item.from_token,
                item.to_token,
              );
              const order = getOrder(assetFrom.asset, assetTo.asset);
              if (!order) return null;

              return {
                assetFrom,
                assetTo,
                order,
                item,
              };
            })
            .filter(item => item),
        );
        setLoading(false);
      })
      .catch(e => {
        setHistory([]);
        setCurrentHistory([]);
        setLoading(false);
      });
  }, [account, url]);

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);
    setCurrentHistory([]);

    getData();
  }, [getData]);

  //GET HISTORY
  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory, retry]);

  const onPageChanged = useCallback(
    data => {
      const { currentPage, pageLimit } = data;
      const offset = (currentPage - 1) * pageLimit;
      setCurrentHistory(history.slice(offset, offset + pageLimit));
    },
    [history],
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

        const data = {
          status: item.status,
          timestamp: customData?.date,
          transaction_hash: item.transactionHash,
          returnVal: {
            _fromAmount: customData?.amount,
            _toAmount: customData?.minReturn || null,
          },
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
            {currentHistory.map(({ item, assetFrom, assetTo }) => {
              return (
                <AssetRow
                  key={item.transaction_hash}
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
            pageLimit={6}
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

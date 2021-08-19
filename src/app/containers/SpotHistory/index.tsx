import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import axios, { CancelTokenSource } from 'axios';
import { useTranslation } from 'react-i18next';

import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import iconPending from 'assets/images/icon-pending.svg';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { numberToUSD } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Pagination } from '../../components/Pagination';
import { useAccount } from '../../hooks/useAccount';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { translations } from '../../../locales/i18n';
import { LoadableValue } from '../../components/LoadableValue';
import { useSelector } from 'react-redux';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { getOrder, TradingTypes } from 'app/pages/SpotTradingPage/types';
import { AssetRenderer } from 'app/components/AssetRenderer';
import { useGetProfitDollarValue } from 'app/hooks/trading/useGetProfitDollarValue';
import { useTradeHistoryRetry } from 'app/hooks/useTradeHistoryRetry';

export function SpotHistory() {
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
        console.log(e);
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
        let assetFrom = [] as any;
        let assetTo = [] as any;

        assetFrom = assets.find(
          currency => currency.asset === customData?.sourceToken,
        );
        assetTo = assets.find(
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
            itemFrom={assetFrom}
            itemTo={assetTo}
          />
        );
      });
  }, [assets, transactions]);

  return (
    <section>
      <div className="sovryn-table tw-p-4 tw-mb-12">
        <table className="tw-w-full">
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
            {loading && (
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
}

interface AssetProps {
  data: any[] | any;
  itemFrom: AssetDetails;
  itemTo: AssetDetails;
}

function AssetRow({ data, itemFrom, itemTo }: AssetProps) {
  const { t } = useTranslation();

  const [dollarValue, dollarsLoading] = useGetProfitDollarValue(
    itemTo.asset,
    data.returnVal._toAmount,
  );

  const order = getOrder(itemFrom.asset, itemTo.asset);
  if (!order) return null;

  return (
    <tr>
      <td className="tw-hidden lg:tw-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <AssetRenderer asset={order.pairAsset[0]} />-
        <AssetRenderer asset={order.pairAsset[1]} />
      </td>
      <td className="tw-font-bold">
        <span
          className={
            order.orderType === TradingTypes.BUY
              ? 'tw-text-trade-long'
              : 'tw-text-trade-short'
          }
        >
          {order.orderType === TradingTypes.BUY
            ? t(translations.spotTradingPage.tradeForm.buy)
            : t(translations.spotTradingPage.tradeForm.sell)}
        </span>
      </td>
      <td>
        {numberFromWei(data.returnVal._fromAmount)}{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td className="tw-hidden lg:tw-table-cell">
        <div>{numberFromWei(data.returnVal._toAmount)}</div>≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollarsLoading}
        />
      </td>

      <td>
        <div className="tw-flex tw-items-center tw-justify-between lg:tw-w-5/6 tw-p-0">
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
              txHash={data.transaction_hash}
              className="tw-text-primary tw-font-normal tw-whitespace-nowrap"
              startLength={5}
              endLength={5}
            />
          </div>
          <div className="tw-hidden 2xl:tw-block">
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
}

function extractAssets(fromToken, toToken) {
  const assets = AssetsDictionary.list();

  let assetFrom = [] as any;
  let assetTo = [] as any;

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
}

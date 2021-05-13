import React, { useCallback, useMemo, useEffect, useState } from 'react';
import axios from 'axios';
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

export function SpotHistory() {
  const transactions = useSelector(selectTransactionArray);
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();

  let cancelTokenSource;
  const getData = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();
    axios
      .get(`${url}/events/conversion-swap/${account}`, {
        cancelToken: cancelTokenSource.token,
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
  };

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);
    setCurrentHistory([]);

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setHistory, url, setCurrentHistory]);

  //GET HISTORY
  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory, setCurrentHistory]);

  const onPageChanged = data => {
    const { currentPage, pageLimit } = data;
    const offset = (currentPage - 1) * pageLimit;
    setCurrentHistory(history.slice(offset, offset + pageLimit));
  };

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
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">
                {t(translations.spotHistory.tableHeaders.time)}
              </th>
              <th className="d-none d-md-table-cell">
                {t(translations.spotHistory.tableHeaders.pair)}
              </th>
              <th>{t(translations.spotHistory.tableHeaders.orderType)}</th>
              <th>{t(translations.spotHistory.tableHeaders.amountPaid)}</th>
              <th className="d-none d-md-table-cell">
                {t(translations.spotHistory.tableHeaders.amountReceived)}
              </th>
              <th>{t(translations.spotHistory.tableHeaders.status)}</th>
            </tr>
          </thead>
          <tbody className="mt-5">
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
                <td className="text-center" colSpan={99}>
                  History is empty.
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
      <td className="d-none d-md-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="d-none d-md-table-cell">
        <AssetRenderer asset={order.pairAsset[0]} /> -
        <AssetRenderer asset={order.pairAsset[1]} />
      </td>
      <td className="tw-font-bold">
        <span
          className={
            order.orderType === TradingTypes.BUY
              ? 'tw-text-tradingLong'
              : 'tw-text-tradingShort'
          }
        >
          {order.orderType}
        </span>
      </td>
      <td>
        {numberFromWei(data.returnVal._fromAmount)}{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td className="d-none d-md-table-cell">
        <div>{numberFromWei(data.returnVal._toAmount)}</div>≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollarsLoading}
        />
      </td>

      <td>
        <div className="d-flex align-items-center justify-content-between col-lg-10 col-md-12 p-0">
          <div>
            {!data.status && (
              <p className="m-0">{t(translations.common.confirmed)}</p>
            )}
            {data.status === TxStatus.FAILED && (
              <p className="m-0">{t(translations.common.failed)}</p>
            )}
            {data.status === TxStatus.PENDING && (
              <p className="m-0">{t(translations.common.pending)}</p>
            )}
            <LinkToExplorer
              txHash={data.transaction_hash}
              className="text-gold font-weight-normal text-nowrap"
            />
          </div>
          <div>
            {!data.status && (
              <img src={iconSuccess} title="Confirmed" alt="Confirmed" />
            )}
            {data.status === TxStatus.FAILED && (
              <img src={iconRejected} title="Failed" alt="Failed" />
            )}
            {data.status === TxStatus.PENDING && (
              <img src={iconPending} title="Pending" alt="Pending" />
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

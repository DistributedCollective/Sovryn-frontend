import axios from 'axios';
import { bignumber } from 'mathjs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { LinkToExplorer } from 'app/components/LinkToExplorer';
import iconPending from 'assets/images/icon-pending.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
// import ReactPaginate from 'react-paginate';
import iconSuccess from 'assets/images/icon-success.svg';
import { selectTransactionArray } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { numberToUSD } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';

import { translations } from '../../../locales/i18n';
import { Asset } from '../../../types/asset';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { AssetRenderer } from '../../components/AssetRenderer';
import { LoadableValue } from '../../components/LoadableValue';
import { Pagination } from '../../components/Pagination';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';
import { useAccount } from '../../hooks/useAccount';

export function SwapHistory() {
  const transactions = useSelector(selectTransactionArray);
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const assets = AssetsDictionary.list();
  const [hasOngoingTransactions, setHasOngoingTransactions] = useState(false);

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
        setHistory(res.data.sort((x, y) => y.timestamp - x.timestamp));
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

        if (!hasOngoingTransactions) {
          setHasOngoingTransactions(true);
        }

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
  }, [assets, hasOngoingTransactions, transactions]);

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th className="d-none d-lg-table-cell">
                {t(translations.swapHistory.tableHeaders.time)}
              </th>
              <th className="d-none d-lg-table-cell">
                {t(translations.swapHistory.tableHeaders.from)}
              </th>
              <th>{t(translations.swapHistory.tableHeaders.amountSent)}</th>
              <th>{t(translations.swapHistory.tableHeaders.to)}</th>
              <th className="d-none d-lg-table-cell">
                {t(translations.swapHistory.tableHeaders.amountReceived)}
              </th>
              <th>{t(translations.swapHistory.tableHeaders.status)}</th>
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
            {!hasOngoingTransactions && history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="text-center" colSpan={99}>
                  {t(translations.swapHistory.emptyState)}
                </td>
              </tr>
            )}
            {onGoingTransactions}
            {currentHistory.map(item => {
              let assetFrom = [] as any;
              let assetTo = [] as any;
              assets.map(currency => {
                if (
                  getContractNameByAddress(item.from_token)?.includes(
                    currency.asset,
                  )
                ) {
                  assetFrom = currency;
                }
                if (
                  getContractNameByAddress(item.to_token)?.includes(
                    currency.asset,
                  )
                ) {
                  assetTo = currency;
                }
                return null;
              });

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
  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);
  const dollarValue = useMemo(() => {
    if (data.returnVal._toAmount === null) return '';
    return bignumber(data.returnVal._toAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, data.returnVal._toAmount, itemTo.decimals]);

  return (
    <tr>
      <td className="d-none d-lg-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="d-none d-lg-table-cell">
        <img
          className="d-none d-lg-inline mr-2"
          style={{ height: '40px' }}
          src={itemFrom.logoSvg}
          alt={itemFrom.asset}
        />{' '}
        <AssetRenderer asset={itemFrom.asset} />
      </td>
      <td>{numberFromWei(data.returnVal._fromAmount)}</td>
      <td>
        <img
          className="d-none d-lg-inline mr-2"
          style={{ height: '40px' }}
          src={itemTo.logoSvg}
          alt={itemTo.asset}
        />{' '}
        <AssetRenderer asset={itemTo.asset} />
      </td>
      <td className="d-none d-lg-table-cell">
        <div>{numberFromWei(data.returnVal._toAmount)}</div>≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-between col-lg-12 col-md-12 p-0">
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
          <div className="d-none d-sm-block d-lg-none d-xl-block">
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

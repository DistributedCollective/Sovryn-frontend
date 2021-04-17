import React, { useCallback, useMemo, useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import ReactPaginate from 'react-paginate';
import iconSuccess from 'assets/images/icon-success.svg';
import iconRejected from 'assets/images/icon-rejected.svg';
import { Sovryn } from 'utils/sovryn';
import { bignumber } from 'mathjs';
import { weiToFixed } from 'utils/blockchain/math-helpers';
import { numberToUSD } from 'utils/display-text/format';
import { AssetDetails } from 'utils/models/asset-details';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { Asset } from '../../../types/asset';
import { Pagination } from '../../components/Pagination';
import { useAccount } from '../../hooks/useAccount';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { translations } from '../../../locales/i18n';
import { LoadableValue } from '../../components/LoadableValue';
import { useCachedAssetPrice } from '../../hooks/trading/useCachedAssetPrice';

export function SwapHistory() {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

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
        setHistory(res.data);
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

  const assets = AssetsDictionary.list();

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">
                {t(translations.swapHistory.tableHeaders.time)}
              </th>
              <th className="d-none d-md-table-cell">
                {t(translations.swapHistory.tableHeaders.from)}
              </th>
              <th>{t(translations.swapHistory.tableHeaders.amountSent)}</th>
              <th>{t(translations.swapHistory.tableHeaders.to)}</th>
              <th className="d-none d-md-table-cell">
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
            {history.length === 0 && !loading && (
              <tr key={'empty'}>
                <td className="text-center" colSpan={99}>
                  History is empty.
                </td>
              </tr>
            )}
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
  const txStatus = async (hash: string) => {
    return await Sovryn.getWeb3().eth.getTransactionReceipt(hash);
  };
  const tx = txStatus(data.transaction_hash).then(res => {
    return res;
  });

  const dollars = useCachedAssetPrice(itemTo.asset, Asset.USDT);
  const dollarValue = useMemo(() => {
    return bignumber(data.returnVal._toAmount)
      .mul(dollars.value)
      .div(10 ** itemTo.decimals)
      .toFixed(0);
  }, [dollars.value, data.returnVal._toAmount, itemTo.decimals]);

  return (
    <tr>
      <td className="d-none d-md-table-cell">
        <DisplayDate
          timestamp={new Date(data.timestamp).getTime().toString()}
        />
      </td>
      <td className="d-none d-md-table-cell">
        <img
          className="d-none d-md-inline mr-2"
          style={{ height: '40px' }}
          src={itemFrom.logoSvg}
          alt={itemFrom.asset}
        />{' '}
        {itemFrom.asset}
      </td>
      <td>{numberFromWei(data.returnVal._fromAmount)}</td>
      <td>
        <img
          className="d-none d-md-inline mr-2"
          style={{ height: '40px' }}
          src={itemTo.logoSvg}
          alt={itemTo.asset}
        />{' '}
        {itemTo.asset}
      </td>
      <td className="d-none d-md-table-cell">
        <div>{numberFromWei(data.returnVal._toAmount)}</div>≈{' '}
        <LoadableValue
          value={numberToUSD(Number(weiToFixed(dollarValue, 4)), 4)}
          loading={dollars.loading}
        />
      </td>
      <td>
        <div className="d-flex align-items-center justify-content-between col-lg-10 col-md-12 p-0">
          <div>
            {tx && <p className="m-0">Confirmed</p>}
            {!tx && <p className="m-0">Failed</p>}
            <LinkToExplorer
              txHash={data.transaction_hash}
              className="text-gold font-weight-normal text-nowrap"
            />
          </div>
          <div>
            {tx && <img src={iconSuccess} title="Confirmed" alt="Confirmed" />}
            {!tx && <img src={iconRejected} title="Failed" alt="Failed" />}
          </div>
        </div>
      </td>
    </tr>
  );
}

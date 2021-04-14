import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
// import ReactPaginate from 'react-paginate';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useAccount } from '../../hooks/useAccount';
import { translations } from '../../../locales/i18n';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';
import { Pagination } from '../../components/Pagination';

export function SwapHistory() {
  const account = useAccount();
  const assets = AssetsDictionary.list();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [currentHistory, setCurrentHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);
    setCurrentHistory([]);
    axios
      .get(`${url}/events/conversion-swap/${account}`, {})
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
            {currentHistory.map(item => (
              <tr key={item.transaction_hash}>
                <td className="d-none d-md-table-cell">
                  <DisplayDate
                    timestamp={new Date(item.timestamp).getTime().toString()}
                  />
                </td>
                <td className="d-none d-md-table-cell">
                  {assets.map((currency, index) => (
                    <div key={index}>
                      {getContractNameByAddress(item.from_token)?.includes(
                        currency.asset,
                      ) && (
                        <>
                          <img
                            className="d-inline mr-2"
                            style={{ height: '40px' }}
                            src={currency.logoSvg}
                            alt={currency.asset}
                          />{' '}
                          {currency.asset}
                        </>
                      )}
                    </div>
                  ))}
                </td>
                <td>{numberFromWei(item.returnVal._fromAmount)}</td>
                <td>
                  {assets.map((currency, index) => (
                    <div key={index}>
                      {getContractNameByAddress(item.to_token)?.includes(
                        currency.asset,
                      ) && (
                        <>
                          <img
                            className="d-inline mr-2"
                            style={{ height: '40px' }}
                            src={currency.logoSvg}
                            alt={currency.asset}
                          />{' '}
                          {currency.asset}
                        </>
                      )}
                    </div>
                  ))}
                </td>
                <td className="d-none d-md-table-cell">
                  <div>{numberFromWei(item.returnVal._toAmount)}</div>
                </td>
                <td>
                  <LinkToExplorer
                    txHash={item.transaction_hash}
                    className="text-gold font-weight-normal"
                  />
                </td>
              </tr>
            ))}
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

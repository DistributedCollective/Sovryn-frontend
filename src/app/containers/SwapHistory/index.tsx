import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { numberToUSD } from 'utils/display-text/format';
import { numberFromWei } from 'utils/blockchain/math-helpers';
import { getContractNameByAddress } from 'utils/blockchain/contract-helpers';
import { LinkToExplorer } from 'app/components/LinkToExplorer';
import { useAccount } from '../../hooks/useAccount';
import { DisplayDate } from '../../components/ActiveUserLoanContainer/components/DisplayDate';
import { SkeletonRow } from '../../components/Skeleton/SkeletonRow';
import { AssetsDictionary } from '../../../utils/dictionaries/assets-dictionary';

export function SwapHistory() {
  const account = useAccount();
  const assets = AssetsDictionary.list();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);

  const getHistory = useCallback(() => {
    setLoading(true);
    axios
      .get(`${url}/events/conversion-swap/${account}`)
      .then(res => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setLoading(false);
      });
  }, [account, setHistory, url]);

  //GET HISTORY
  useEffect(() => {
    if (account) {
      getHistory();
    }
  }, [account, getHistory]);

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <div className="d-flex align-items-center justify-content-start mb-3">
          <h2 className="flex-shrink-0 flex-grow-0 sov-title">Swap History</h2>
        </div>
        <table className="w-100">
          <thead>
            <tr>
              <th className="d-none d-md-table-cell">Date/Time</th>
              <th className="d-none d-md-table-cell">From</th>
              <th>Amount Sent</th>
              <th>To</th>
              <th className="d-none d-md-table-cell">Amount Received</th>
              <th> Status</th>
            </tr>
          </thead>
          <tbody className="mt-5">
            {loading && (
              <tr key={'loading'}>
                <td colSpan={99}>
                  <SkeletonRow />
                </td>
              </tr>
            )}
            {history.map(item => (
              <tr key={item.id}>
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
                  <div>
                    {numberFromWei(item.returnVal._toAmount)}
                    <br />≈{' '}
                    {numberToUSD(numberFromWei(item.returnVal._fromAmount), 2)}
                  </div>
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
      </div>
    </section>
  );
}

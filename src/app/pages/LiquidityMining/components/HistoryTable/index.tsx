import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

import { backendUrl, currentChainId } from 'utils/classifiers';
import { useAccount } from 'app/hooks/useAccount';
import { TableBody } from './TableBody';
import { TableHeader } from './TableHeader';

export const HistoryTable: React.FC = () => {
  const account = useAccount();
  const url = backendUrl[currentChainId];
  const [history, setHistory] = useState([]) as any;
  const [loading, setLoading] = useState(false);

  let cancelTokenSource;
  const getData = () => {
    if (cancelTokenSource) {
      cancelTokenSource.cancel();
    }

    cancelTokenSource = axios.CancelToken.source();
    axios
      .get(
        `http://13.59.52.224:3010/liquidity-history/${account}?page=1&pageSize=10`,
        {
          cancelToken: cancelTokenSource.token,
        },
      )
      .then(res => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setHistory([]);
        setLoading(false);
      });
  };

  const getHistory = useCallback(() => {
    setLoading(true);
    setHistory([]);

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, setHistory, url]);

  useEffect(() => {
    console.log('account ** : ', account);
    if (account) {
      getHistory();
    }
  }, [account, getHistory]);

  return (
    <section>
      <div className="sovryn-table p-3 mb-5">
        <table className="w-100">
          <TableHeader />
          <TableBody items={history} loading={loading} />
        </table>
        {/* {history.length > 0 && (
          <Pagination
            totalRecords={history.length}
            pageLimit={6}
            pageNeighbours={1}
            onChange={onPageChanged}
          />
        )} */}
      </div>
    </section>
  );
};

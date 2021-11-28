import { useState } from 'react';
import { BigNumber } from 'ethers';
import { LimitOrder, IApiLimitOrder } from 'app/pages/SpotTradingPage/types';
import { backendUrl, currentChainId } from 'utils/classifiers';
import axios, { Canceler } from 'axios';
import { useCallback, useRef } from 'react';
import { useInterval } from '../useInterval';
import { contractReader } from 'utils/sovryn/contract-reader';

function orderParser(order: IApiLimitOrder): LimitOrder {
  return {
    ...order,
    amountIn: BigNumber.from(order.amountIn.hex),
    amountOutMin: BigNumber.from(order.amountOutMin.hex),
    deadline: BigNumber.from(order.deadline.hex),
    created: BigNumber.from(order.created.hex),
    filledAmount: BigNumber.from(order.filled.hex).toString(),
  };
}

const deadlinePassed = (date: number) => new Date(date * 1000) < new Date();

export function useGetLimitOrders(account: string) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const cancelDataRequest = useRef<Canceler>();

  const url = `${backendUrl[currentChainId]}/limitOrder/orders`;

  const getData = useCallback(async () => {
    const total = await contractReader.call<[string]>(
      'orderBook',
      'numberOfAllHashes',
      [],
    );

    if (!account) return;

    cancelDataRequest.current && cancelDataRequest.current();

    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });
    axios
      .get(url + `/${account}?offset=0&limit=${total}`, { cancelToken })
      .then(res => {
        setOrders(
          res.data.data
            .map(orderParser)
            .filter(
              item =>
                item.filledAmount !== '0' ||
                !deadlinePassed(item.deadline.toNumber()),
            ),
        );
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [account, url]);

  useInterval(getData, 60 * 1e3, { immediate: true });

  return {
    value: orders.filter(item => !item.canceled),
    loading,
  };
}

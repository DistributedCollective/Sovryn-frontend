import { useState } from 'react';
import { BigNumber } from 'ethers';
import { LimitOrder, IApiLimitOrder } from 'app/pages/SpotTradingPage/types';
import { limitOrderUrl, currentChainId } from 'utils/classifiers';
import axios, { Canceler } from 'axios';
import { useCallback, useRef } from 'react';
import { useInterval } from '../useInterval';
import { contractReader } from 'utils/sovryn/contract-reader';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { IApiLimitMarginOrder } from './types';

export const marginOrderParser = (
  order: IApiLimitMarginOrder,
): MarginLimitOrder => ({
  ...order,
  leverageAmount: BigNumber.from(order.leverageAmount.hex),
  loanTokenSent: BigNumber.from(order.loanTokenSent.hex),
  collateralTokenSent: BigNumber.from(order.collateralTokenSent.hex),
  minEntryPrice: BigNumber.from(order.minEntryPrice.hex),
  deadline: BigNumber.from(order.deadline.hex),
  createdTimestamp: BigNumber.from(order.createdTimestamp.hex),
  filled: BigNumber.from(order.filled.hex),
  filledAmount: BigNumber.from(order.filled.hex).toString(),
});

export const orderParser = (order: IApiLimitOrder): LimitOrder => ({
  ...order,
  amountIn: BigNumber.from(order.amountIn.hex),
  amountOutMin: BigNumber.from(order.amountOutMin.hex),
  deadline: BigNumber.from(order.deadline.hex),
  created: BigNumber.from(order.created.hex),
  filledAmount: BigNumber.from(order.filled.hex).toString(),
});

const deadlinePassed = (date: number) => new Date(date * 1000) < new Date();
const url = `${limitOrderUrl[currentChainId]}/orders`;

export const useGetLimitOrders = <T>(
  account: string,
  isMargin: boolean = false,
) => {
  const [orders, setOrders] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const cancelDataRequest = useRef<Canceler>();

  const getData = useCallback(async () => {
    if (!account) {
      return;
    }
    const total = await contractReader.call<[string]>(
      isMargin ? 'orderBookMargin' : 'orderBook',
      'numberOfAllHashes',
      [],
    );

    cancelDataRequest.current?.();
    const cancelToken = new axios.CancelToken(c => {
      cancelDataRequest.current = c;
    });

    axios
      .get(
        url +
          `/${account}?offset=0&limit=${total}&isMargin=${isMargin ? 1 : 0}`,
        { cancelToken },
      )
      .then(res => {
        setOrders(
          res.data.data
            .map(item =>
              isMargin ? marginOrderParser(item) : orderParser(item),
            )
            .filter(
              item =>
                item.filledAmount !== '0' ||
                !deadlinePassed(item.deadline.toNumber()),
            ),
        );
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [account, isMargin]);

  useInterval(getData, 30 * 1e3, { immediate: true });

  return {
    value: orders,
    loading,
  };
};

import { useEffect, useState } from 'react';
import {
  getContract,
  getWeb3Contract,
} from './../../../utils/blockchain/contract-helpers';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { Chain } from 'types';
import { ethers } from 'ethers';
import { LimitOrder } from 'app/pages/SpotTradingPage/types';

function orderParser(orderArray = []): LimitOrder {
  const [
    maker,
    fromToken,
    toToken,
    amountIn,
    amountOutMin,
    recipient,
    deadline,
    created,
    v,
    r,
    s,
  ] = orderArray;

  return {
    maker,
    fromToken,
    toToken,
    amountIn,
    amountOutMin,
    recipient,
    deadline,
    created,
    v,
    r,
    s,
  };
}

interface ICanceledOrders {
  [key: string]: boolean;
}
interface IFilledOrders {
  [key: string]: number;
}

export function useGetLimitOrders(
  account: string,
  page: number = 0,
  limit: number = 100,
) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [canceledOrders, setCanceledOrders] = useState<null | ICanceledOrders>(
    null,
  );
  const [filledOrders, setFilledOrders] = useState<null | IFilledOrders>(null);

  const { value: hashes, loading: loadingHashes } = useCacheCallWithValue<
    Array<String>
  >('orderBook', 'hashesOfMaker', [], account, page, limit);

  const { address, abi } = getContract('settlement');
  const settlement = getWeb3Contract(address, abi);

  const getCanceledOrders = async () => {
    const events = await settlement.getPastEvents('OrderCanceled', {
      filter: {
        value: hashes
          .filter(hash => hash !== ethers.constants.HashZero)
          .map(hash => `${hash}`),
      },
      fromBlock: 0,
    });

    const orderStatus = {};
    events.forEach(event => (orderStatus[event.returnValues?.hash] = true));
    setCanceledOrders({ ...orderStatus });

    return canceledOrders;
  };

  const getFilledOrders = async () => {
    const events = await settlement.getPastEvents('OrderFilled', {
      filter: {
        value: hashes
          .filter(hash => hash !== ethers.constants.HashZero)
          .map(hash => `${hash}`),
      },
      fromBlock: 0,
    });
    console.log('FilledOrders: ', events);

    // const orderStatus = {};
    // events.forEach(event => (orderStatus[event.returnValues?.hash] = true));

    // setFilledOrders({ ...orderStatus });

    // return canceledOrders;
  };

  useEffect(() => {
    if (hashes.length) {
      getCanceledOrders();
      if (!filledOrders) {
        getFilledOrders();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hashes]);

  useEffect(() => {
    setLoading(true);
    bridgeNetwork
      .multiCall<{ [key: string]: LimitOrder }>(
        Chain.RSK,
        hashes
          .filter(hash => hash !== ethers.constants.HashZero)
          .flatMap(hash => {
            return [
              {
                address: getContract('orderBook').address,
                abi: getContract('orderBook').abi,
                fnName: 'orderOfHash',
                args: [hash],
                key: `${hash}`,
                parser: value => orderParser(value),
              },
            ];
          }),
      )
      .then(result => {
        const orders = result?.returnData;
        setOrders(
          Object.keys(orders).map(orderHash => ({
            hash: orderHash,
            maker: orders[orderHash].maker,
            fromToken: orders[orderHash].fromToken,
            toToken: orders[orderHash].toToken,
            amountIn: orders[orderHash].amountIn,
            amountOutMin: orders[orderHash].amountOutMin,
            recipient: orders[orderHash].recipient,
            deadline: orders[orderHash].deadline,
            created: orders[orderHash].created,
            v: orders[orderHash].v,
            r: orders[orderHash].r,
            s: orders[orderHash].s,
          })),
        );
      })
      .catch(error => {
        console.error('e', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [hashes]);
  return {
    value: orders.filter(
      order => order.hash && canceledOrders && !canceledOrders[order.hash],
    ),
    loading: loadingHashes || loading || !canceledOrders,
  };
}

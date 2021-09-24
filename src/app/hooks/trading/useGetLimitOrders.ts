import { useEffect, useState } from 'react';
import { getContract } from './../../../utils/blockchain/contract-helpers';
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
    v,
    r,
    s,
  };
}

// async function getCanceledHashes() {
//   const settlement = new ethers.Contract(
//     config.contracts.settlement,
//     settlementAbi,
//     provider,
//   );
//   const filter = settlement.filters.OrderCanceled(null);
//   const events = await settlement.queryFilter(filter);
//   return events.map(event => event.args && event.args[0]).filter(h => !!h);
// }

export function useGetLimitOrders(
  account: string,
  page: number = 0,
  limit: number = 100,
) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const { value: hashes, loading: loadingHashes } = useCacheCallWithValue<
    Array<String>
  >('orderBook', 'hashesOfMaker', [], account, page, limit);

  const {
    value: canceledOrders,
    loading: loadingCanceledOrders,
  } = useCacheCallWithValue<Array<String>>(
    'settlement',
    'canceledOfHash',
    false,
    '0xe384588b31c03959a897f983c9ba18e653100c9fdcfe019f2282a5ff078c49a2',
  );

  useEffect(() => {
    if (!loadingCanceledOrders) {
      console.log('canceledOrders: ', canceledOrders);
    }
  }, [canceledOrders, loadingCanceledOrders]);

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
  return { value: orders, loading: loadingHashes || loading };
}

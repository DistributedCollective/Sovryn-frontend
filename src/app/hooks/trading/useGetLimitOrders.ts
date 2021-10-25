import { contractReader } from '../../../utils/sovryn/contract-reader';
import { Order } from '../../pages/SpotTradingPage/helpers';
import { useEffect, useState } from 'react';
import { useCacheCallWithValue } from '../useCacheCallWithValue';
import { ethers, BigNumber } from 'ethers';
import { LimitOrder } from 'app/pages/SpotTradingPage/types';
import { AssetsDictionary } from 'utils/dictionaries/assets-dictionary';

function orderParser(orderArray: string[]): LimitOrder {
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
  const order = new Order(
    maker,
    AssetsDictionary.getByTokenContractAddress(fromToken).asset,
    AssetsDictionary.getByTokenContractAddress(toToken).asset,
    amountIn,
    amountOutMin,
    recipient,
    deadline,
    created,
  );
  const hash = order.hash();
  return {
    maker,
    fromToken,
    toToken,
    amountIn: BigNumber.from(amountIn),
    amountOutMin: BigNumber.from(amountOutMin),
    recipient,
    deadline: BigNumber.from(deadline),
    created: BigNumber.from(created),
    v,
    r,
    s,
    hash,
  };
}

export function useGetLimitOrders(
  account: string,
  page: number = 0,
  limit: number = 100,
  isMargin = false,
) {
  const [orders, setOrders] = useState<LimitOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const { value: hashes, loading: loadingHashes } = useCacheCallWithValue<
    Array<Array<string>>
  >('orderBook', 'getOrders', [], account, page, limit);

  useEffect(() => {
    const updateResult = async () => {
      const list = hashes
        .filter(hash => hash['0'] !== ethers.constants.AddressZero)
        .map(item => orderParser(item));

      const canceledOrders = await contractReader.call(
        'settlement',
        'checkCanceledHashes',
        [list.map(item => item.hash)],
      );
      const filledOrders = await contractReader.call(
        'settlement',
        'checkFilledAmountHashes',
        [list.map(item => item.hash)],
      );

      list.forEach((item, i) => {
        item.canceled = !!canceledOrders[i]?.canceled;
        item.filledAmount = filledOrders[i]?.amount;
      });
      console.log('list: ', list);
      setOrders(list);
      setLoading(false);
    };

    if (hashes && !loadingHashes) {
      updateResult();
    }
  }, [hashes, loadingHashes]);

  return {
    value: orders,
    loading: loadingHashes || loading,
  };
}

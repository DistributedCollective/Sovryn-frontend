import { contractReader } from './../../utils/sovryn/contract-reader';
import { getContract as getContractData } from '../../utils/blockchain/contract-helpers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from '../../types';

import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { Order } from '../pages/SpotTradingPage/helpers';
import { gas } from '../../utils/blockchain/gas-price';
import { useCallback } from 'react';
import { TransactionConfig } from 'web3-core';
import { useSendTx } from './useSendTx';

const getDeadline = daysFromNow =>
  ethers.BigNumber.from(
    Math.floor(Date.now() / 1000 + daysFromNow * 24 * 3600),
  );

export function useLimitOrder(
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
  amountOutMin: string,
  duration: number = 365,
) {
  const account = useAccount();
  const { chainId } = useSelector(selectWalletProvider);

  const { send, ...tx } = useSendTx();

  const createOrder = useCallback(async () => {
    let tx: CheckAndApproveResult = {};
    if (sourceToken !== Asset.RBTC) {
      tx = await contractWriter.checkAndApprove(
        sourceToken,
        getContract('settlement').address,
        amount,
      );
      if (tx.rejected) {
        return;
      }
    } else {
      try {
        await contractWriter.send('settlement', 'deposit', [account], {
          value: amount,
        });
      } catch (error) {
        return;
      }
    }

    const created = ethers.BigNumber.from(Math.floor(Date.now() / 1000));

    const order = new Order(
      account,
      sourceToken,
      targetToken,
      amount,
      amountOutMin,
      account,
      getDeadline(duration > 0 ? duration : 365).toString(),
      created.toString(),
    );

    console.log({ order });

    // todo: signing inside of order.toArgs works only for browser wallets :(
    const args = await order.toArgs(chainId!);

    console.log({ args });

    const contract = getContract('orderBook');

    const populated = await contract.populateTransaction.createOrder(args);

    console.log({ populated });

    const nonce = await contractReader.nonce(account);

    send({
      ...populated,
      gas: '600000',
      gasPrice: gas.get(),
      nonce,
    } as TransactionConfig);
  }, [
    sourceToken,
    account,
    targetToken,
    amount,
    amountOutMin,
    duration,
    chainId,
    send,
  ]);

  return { createOrder, ...tx };
}

export function useCancelLimitOrder(sourceToken: Asset, amount: string) {
  const account = useAccount();

  const { send, ...tx } = useSendTx();

  const cancelOrder = useCallback(
    async (orderHash: string) => {
      const contract = getContract('settlement');

      // try {
      //   if (sourceToken === Asset.RBTC) {
      //     await contractReader.call('settlement', 'withdraw', [amount]);
      //   }
      // } catch (error) {
      //   return;
      // }

      const populated = await contract.populateTransaction.cancelOrder(
        orderHash,
      );

      console.log({ populated });

      const nonce = await contractReader.nonce(account);

      send({
        ...populated,
        gas: '600000',
        gasPrice: gas.get(),
        nonce,
      } as TransactionConfig);
    },
    [account, amount, send, sourceToken],
  );

  return { cancelOrder, ...tx };
}

const getContract = contract => {
  const { address, abi } = getContractData(contract);
  return new ethers.Contract(address, abi);
};

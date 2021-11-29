import { LimitOrder } from 'app/pages/SpotTradingPage/types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getContract as getContractData } from 'utils/blockchain/contract-helpers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { ethers } from 'ethers';
import { SignatureLike } from '@ethersproject/bytes';
import { useSelector } from 'react-redux';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { useCallback } from 'react';
import { TransactionConfig } from 'web3-core';
import { gas } from 'utils/blockchain/gas-price';
import { Order } from 'app/pages/SpotTradingPage/helpers';
import { useSendTx } from '../useSendTx';
import { signTypeData } from './utils';
import axios from 'axios';
import { backendUrl, currentChainId } from 'utils/classifiers';

export function useLimitOrder(
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
  amountOutMin: string,
  duration: number = 365,
  onSuccess: Function,
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

    try {
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

      const signature = await signTypeData(order, account, chainId);

      console.log({ signature });

      const sig = ethers.utils.splitSignature(signature as SignatureLike);

      console.log({ sig });

      const args = [
        order.maker,
        order.fromToken,
        order.toToken,
        order.amountIn,
        order.amountOutMin,
        order.recipient,
        order.deadline,
        order.created,
        sig.v,
        sig.r,
        sig.s,
      ];

      const contract = getContract('orderBook');

      const populated = await contract.populateTransaction.createOrder(args);

      console.log('populated: ', populated);

      const { status, data } = await axios.post(
        backendUrl[currentChainId] + '/limitOrder/createOrder',
        {
          data: populated.data,
          from: account,
        },
      );

      onSuccess({ status, data });

      return { status, data };
    } catch (error) {
      console.log('error', error);
    }
  }, [
    sourceToken,
    amount,
    account,
    targetToken,
    amountOutMin,
    duration,
    chainId,
    onSuccess,
  ]);

  return { createOrder, ...tx };
}

export function useCancelLimitOrder(order: LimitOrder, sourceToken: Asset) {
  const account = useAccount();

  const { send, ...tx } = useSendTx();

  const cancelOrder = useCallback(async () => {
    const contract = getContract('settlement');

    try {
      if (sourceToken === Asset.RBTC) {
        await contractWriter.send('settlement', 'withdraw', [
          order.amountIn.toString(),
        ]);
      }
    } catch (error) {
      console.error('error', error);
      return;
    }

    const args = [
      order.maker,
      order.fromToken,
      order.toToken,
      order.amountIn.toString(),
      order.amountOutMin.toString(),
      order.recipient,
      order.deadline.toString(),
      order.created.toString(),
      order.v,
      order.r,
      order.s,
    ];

    const populated = await contract.populateTransaction.cancelOrder(args);

    console.log({ populated });

    const nonce = await contractReader.nonce(account);

    send({
      ...populated,
      gas: '600000',
      gasPrice: gas.get(),
      nonce,
    } as TransactionConfig);
  }, [
    account,
    order.amountIn,
    order.amountOutMin,
    order.created,
    order.deadline,
    order.fromToken,
    order.maker,
    order.r,
    order.recipient,
    order.s,
    order.toToken,
    order.v,
    send,
    sourceToken,
  ]);

  return { cancelOrder, ...tx };
}

export const getDeadline = daysFromNow =>
  ethers.BigNumber.from(
    Math.floor(Date.now() / 1000 + daysFromNow * 24 * 3600),
  );

export const getContract = contract => {
  const { address, abi } = getContractData(contract);
  return new ethers.Contract(address, abi);
};

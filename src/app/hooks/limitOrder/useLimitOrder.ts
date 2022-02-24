import { ILimitOrder } from 'app/pages/SpotTradingPage/types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { getContract as getContractData } from 'utils/blockchain/contract-helpers';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { ethers, BigNumber } from 'ethers';
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
import { limitOrderUrl, currentChainId, gasLimit } from 'utils/classifiers';

export const useLimitOrder = (
  sourceToken: Asset,
  targetToken: Asset,
  amount: string,
  amountOutMin: string,
  duration: number = 365,
  onSuccess: (order: ILimitOrder, data) => void,
  onError: () => void,
  onStart: () => void,
) => {
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
      const created = BigNumber.from(Math.floor(Date.now() / 1000));

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

      const signature = await signTypeData(order, account, chainId);

      const expandedSignature = ethers.utils.splitSignature(
        signature as SignatureLike,
      );

      const args = [
        order.maker,
        order.fromToken,
        order.toToken,
        order.amountIn,
        order.amountOutMin,
        order.recipient,
        order.deadline,
        order.created,
        expandedSignature.v,
        expandedSignature.r,
        expandedSignature.s,
      ];

      const contract = getContract('orderBook');

      const populated = await contract.populateTransaction.createOrder(args);

      onStart();

      const { data } = await axios.post(
        limitOrderUrl[currentChainId] + '/createOrder',
        {
          data: populated.data,
          from: account,
        },
      );
      if (data.success) {
        const newOrder: ILimitOrder = {
          maker: order.maker,
          fromToken: order.fromToken,
          toToken: order.toToken,
          recipient: order.recipient,
          amountIn: order.amountIn,
          amountOutMin: order.amountOutMin,
          deadline: order.deadline,
          created: order.created,
          filled: '0',
          canceled: false,
          v: data?.data?.v,
          r: data?.data?.r,
          s: data?.data?.s,
          hash: data?.data?.hash,
        };
        onSuccess(newOrder, data.data);
      } else {
        throw new Error();
      }
    } catch (error) {
      onError();
      if (sourceToken === Asset.RBTC) {
        await contractWriter.send('settlement', 'withdraw', [amount]);
      }
    }
  }, [
    sourceToken,
    amount,
    account,
    targetToken,
    amountOutMin,
    duration,
    chainId,
    onStart,
    onSuccess,
    onError,
  ]);

  return { createOrder, ...tx };
};

export const useCancelLimitOrder = (order: ILimitOrder, sourceToken: Asset) => {
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

    const nonce = await contractReader.nonce(account);

    send({
      ...populated,
      gas: gasLimit.limit_order,
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
};

export const getDeadline = daysFromNow =>
  ethers.BigNumber.from(
    Math.floor(Date.now() / 1000 + daysFromNow * 24 * 3600),
  );

export const getContract = contract => {
  const { address, abi } = getContractData(contract);
  return new ethers.Contract(address, abi);
};

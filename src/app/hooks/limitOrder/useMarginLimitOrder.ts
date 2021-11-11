import { contractReader } from 'utils/sovryn/contract-reader';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { ethers } from 'ethers';
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
import { getContract, getDeadline } from './useLimitOrder';

export function useMarginLimitOrder(
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

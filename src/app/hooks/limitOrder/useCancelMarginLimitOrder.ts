import { assetByLoanTokenAddress } from './../../../utils/blockchain/contract-helpers';
import { useCallback } from 'react';
import { TransactionConfig } from 'web3-core';

import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { useAccount } from 'app/hooks/useAccount';
import { useSendTx } from '../useSendTx';
import { getContract } from './useLimitOrder';
import { gasLimit } from 'utils/classifiers';
import { contractReader } from 'utils/sovryn/contract-reader';
import { gas } from 'utils/blockchain/gas-price';
import { assetByTokenAddress } from 'utils/blockchain/contract-helpers';
import { contractWriter } from 'utils/sovryn/contract-writer';
import { Asset } from 'types';
import { TxType } from 'store/global/transactions-store/types';

export const useCancelMarginLimitOrder = (order: MarginLimitOrder) => {
  const account = useAccount();

  const { send, ...tx } = useSendTx();

  const cancelOrder = useCallback(async () => {
    const contract = getContract('settlement');

    const loanAsset = assetByLoanTokenAddress(order.loanTokenAddress);
    const collateralAsset = assetByTokenAddress(order.collateralTokenAddress);

    try {
      if (collateralAsset === Asset.RBTC) {
        await contractWriter.send(
          'settlement',
          'withdraw',
          [order.collateralTokenSent.toString()],
          { gas: gasLimit[TxType.SETTLEMENT_WITDHRAW] },
        );
      }
      if (loanAsset === Asset.RBTC) {
        await contractWriter.send(
          'settlement',
          'withdraw',
          [order.loanTokenSent.toString()],
          { gas: gasLimit[TxType.SETTLEMENT_WITDHRAW] },
        );
      }
    } catch (error) {
      return;
    }

    const args = [
      order.loanId,
      order.leverageAmount.toString(),
      order.loanTokenAddress,
      order.loanTokenSent.toString(),
      order.collateralTokenSent.toString(),
      order.collateralTokenAddress,
      order.trader,
      order.minEntryPrice.toString(),
      order.loanDataBytes,
      order.deadline.toString(),
      order.createdTimestamp.toString(),
      order.v,
      order.r,
      order.s,
    ];

    const populated = await contract.populateTransaction.cancelMarginOrder(
      args,
    );

    const nonce = await contractReader.nonce(account);

    send({
      ...populated,
      gas: gasLimit.limit_order,
      gasPrice: gas.get(),
      nonce,
    } as TransactionConfig);
  }, [
    account,
    order.collateralTokenAddress,
    order.collateralTokenSent,
    order.createdTimestamp,
    order.deadline,
    order.leverageAmount,
    order.loanDataBytes,
    order.loanId,
    order.loanTokenAddress,
    order.loanTokenSent,
    order.minEntryPrice,
    order.r,
    order.s,
    order.trader,
    order.v,
    send,
  ]);

  return { cancelOrder, ...tx };
};

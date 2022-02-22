import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { BigNumber, ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { MarginOrder } from 'app/pages/MarginTradePage/helpers';
import { useSendTx } from '../useSendTx';
import { getContract, getDeadline } from './useLimitOrder';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { useTrading_resolvePairTokens } from '../trading/useTrading_resolvePairTokens';
import { toWei } from 'web3-utils';
import { currentChainId, gasLimit, limitOrderUrl } from 'utils/classifiers';
import axios from 'axios';
import { SignatureLike } from 'ethers/node_modules/@ethersproject/bytes';
import { signTypeMarginOrderData } from './utils';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { gas } from 'utils/blockchain/gas-price';
import { TransactionConfig } from 'web3-core';
import { IApiLimitMarginOrder } from './types';

export const useMarginLimitOrder = (
  pair: TradingPair,
  position: TradingPosition,
  collateral: Asset,
  leverage: number,
  collateralTokenSent: string,
  minEntryPrice: string,
  duration: number = 365,
  onSuccess: (order: IApiLimitMarginOrder, data) => void,
  onError: () => void,
  onStart: () => void,
) => {
  const account = useAccount();
  const { chainId } = useSelector(selectWalletProvider);

  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);

  const { send, ...tx } = useSendTx();

  const createOrder = useCallback(async () => {
    try {
      const created = ethers.BigNumber.from(Math.floor(Date.now() / 1000));

      const order = new MarginOrder(
        ethers.constants.HashZero, // loanId
        toWei(String(leverage - 1), 'ether'), // leverageAmount
        loanToken, //  asset: Asset,
        useLoanTokens ? collateralTokenSent : '0', //loanTokenSent
        useLoanTokens ? '0' : collateralTokenSent, //collateralTokenSent
        collateralToken, //collateralToken
        account, // trader
        toWei(minEntryPrice), //minEntryPrice
        ethers.constants.HashZero, //loanDataBytes
        getDeadline(duration > 0 ? duration : 365).toString(),
        created.toString(),
      );

      let tx: CheckAndApproveResult = {};
      if (Number(order.loanTokenSent) > 0) {
        tx = await contractWriter.checkAndApprove(
          loanToken,
          getContract('settlement').address,
          order.loanTokenSent,
        );
        if (tx.rejected) {
          return;
        }
      }
      if (Number(order.collateralTokenSent) > 0) {
        tx = await contractWriter.checkAndApprove(
          collateralToken,
          getContract('settlement').address,
          order.collateralTokenSent,
        );
        if (tx.rejected) {
          return;
        }
      }

      const signature = await signTypeMarginOrderData(order, account, chainId);

      const sig = ethers.utils.splitSignature(signature as SignatureLike);

      const args = [
        order.loanId,
        order.leverageAmount,
        order.loanTokenAddress,
        order.loanTokenSent,
        order.collateralTokenSent,
        order.collateralTokenAddress,
        order.trader,
        order.minEntryPrice,
        order.loanDataBytes,
        order.deadline,
        order.createdTimestamp,
        sig.v,
        sig.r,
        sig.s,
      ];

      const contract = getContract('orderBookMargin');

      const populated = await contract.populateTransaction.createOrder(args);

      onStart();

      const { data } = await axios.post(
        limitOrderUrl[currentChainId] + '/createMarginOrder',
        {
          data: populated.data,
          from: account,
        },
      );

      if (data.success) {
        const newOrder: IApiLimitMarginOrder = {
          loanId: order.loanId,
          loanTokenAddress: order.loanTokenAddress,
          collateralTokenAddress: order.collateralTokenAddress,
          trader: order.trader,
          loanDataBytes: order.loanDataBytes,
          leverageAmount: {
            hex: BigNumber.from(order.leverageAmount).toString(),
          },
          loanTokenSent: {
            hex: BigNumber.from(order.loanTokenSent).toString(),
          },
          collateralTokenSent: {
            hex: BigNumber.from(order.collateralTokenSent).toString(),
          },
          minEntryPrice: {
            hex: BigNumber.from(order.minEntryPrice).toString(),
          },
          deadline: { hex: BigNumber.from(order.deadline).toString() },
          createdTimestamp: {
            hex: BigNumber.from(order.createdTimestamp).toString(),
          },
          filled: { hex: BigNumber.from('0').toString() },
          canceled: false,
          v: data?.data?.v,
          r: data?.data?.r,
          s: data?.data?.s,
          hash: data?.data?.hash,
        };
        onSuccess(newOrder, data.data);
      } else {
        onError();
      }
    } catch (e) {
      onError();
    }
  }, [
    leverage,
    loanToken,
    useLoanTokens,
    collateralTokenSent,
    collateralToken,
    account,
    minEntryPrice,
    duration,
    chainId,
    onStart,
    onSuccess,
    onError,
  ]);

  return { createOrder, ...tx };
};

export const useCancelMarginLimitOrder = (order: MarginLimitOrder) => {
  const account = useAccount();

  const { send, ...tx } = useSendTx();

  const cancelOrder = useCallback(async () => {
    const contract = getContract('settlement');

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

import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { ethers, constants } from 'ethers';
import { SignatureLike } from 'ethers/node_modules/@ethersproject/bytes';
import { toWei } from 'web3-utils';

import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { MarginOrder } from 'app/pages/MarginTradePage/helpers';
import { useSendTx } from '../useSendTx';
import { getContract, getDeadline } from './useLimitOrder';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { useTrading_resolvePairTokens } from '../trading/useTrading_resolvePairTokens';
import { currentChainId, limitOrderUrl } from 'utils/classifiers';
import { signTypeMarginOrderData } from './utils';
import {
  CheckAndApproveResult,
  contractWriter,
} from 'utils/sovryn/contract-writer';
import { MarginLimitOrder } from 'app/pages/MarginTradePage/types';
import { contractReader } from 'utils/sovryn/contract-reader';
import { bignumber } from 'mathjs';

export const useMarginLimitOrder = (
  pair: TradingPair,
  position: TradingPosition,
  collateral: Asset,
  leverage: number,
  collateralTokenSent: string,
  minEntryPrice: string,
  duration: number = 365,
  onSuccess: (order: MarginLimitOrder, data) => void,
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

  const { send, loading, ...tx } = useSendTx();
  const [preparing, setPreparing] = useState(false);

  const createOrder = useCallback(async () => {
    setPreparing(true);
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

      if (Number(order.loanTokenSent) > 0) {
        try {
          await approveSettlement(loanToken, order.loanTokenSent, account);
        } catch {
          return;
        }
      }
      if (Number(order.collateralTokenSent) > 0) {
        try {
          await approveSettlement(
            collateralToken,
            order.collateralTokenSent,
            account,
          );
        } catch {
          return;
        }
      }

      const signature = await signTypeMarginOrderData(order, account, chainId);

      const expandedSignature = ethers.utils.splitSignature(
        signature as SignatureLike,
      );

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
        expandedSignature.v,
        expandedSignature.r,
        expandedSignature.s,
      ];

      const contract = getContract('orderBookMargin');

      const populated = await contract.populateTransaction.createOrder(args);

      onStart();

      const { data: orderResult } = await axios.post(
        limitOrderUrl[currentChainId] + '/createMarginOrder',
        {
          data: populated.data,
          from: account,
        },
      );

      if (orderResult.success) {
        const newOrder: MarginLimitOrder = {
          loanId: order.loanId,
          loanTokenAddress: order.loanTokenAddress,
          collateralTokenAddress: order.collateralTokenAddress,
          trader: order.trader,
          loanDataBytes: order.loanDataBytes,
          leverageAmount: order.leverageAmount,
          loanTokenSent: order.loanTokenSent,
          collateralTokenSent: order.collateralTokenSent,
          minEntryPrice: order.minEntryPrice,
          deadline: order.deadline,
          createdTimestamp: order.createdTimestamp,
          filled: '0',
          filledAmount: '0',
          canceled: false,
          v: orderResult?.data?.v,
          r: orderResult?.data?.r,
          s: orderResult?.data?.s,
          hash: orderResult?.data?.hash,
        };
        onSuccess(newOrder, orderResult.data);
      } else {
        onError();
      }
    } catch (e) {
      onError();
    } finally {
      setPreparing(false);
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

  return { createOrder, loading: loading || preparing, ...tx };
};

export const approveSettlement = async (
  token: Asset,
  amount: string,
  account: string,
) => {
  let tx: CheckAndApproveResult = {};
  if (token !== Asset.RBTC) {
    tx = await contractWriter.checkAndApprove(
      token,
      getContract('settlement').address,
      constants.MaxUint256.toString(),
    );
    if (tx.rejected) {
      throw new Error('User rejected transaction');
    }
  } else {
    const balance = await contractReader.call<string>(
      'settlement',
      'balanceOf',
      [account],
    );
    console.log('balance', balance);
    if (bignumber(balance).lt(amount)) {
      await contractWriter.send('settlement', 'deposit', [account], {
        value: amount,
      });
    }
  }
};

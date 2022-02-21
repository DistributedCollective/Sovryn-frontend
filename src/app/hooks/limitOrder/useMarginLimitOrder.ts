import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { MarginOrder } from 'app/pages/MarginTradePage/helpers';
import { useSendTx } from '../useSendTx';
import { getContract, getDeadline } from './useLimitOrder';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { useTrading_resolvePairTokens } from '../trading/useTrading_resolvePairTokens';
import { toWei } from 'web3-utils';
import { currentChainId, limitOrderUrl } from 'utils/classifiers';
import axios from 'axios';
import { SignatureLike } from 'ethers/node_modules/@ethersproject/bytes';
import { signTypeMarginOrderData } from './utils';

export const useMarginLimitOrder = (
  pair: TradingPair,
  position: TradingPosition,
  collateral: Asset,
  leverage: number,
  collateralTokenSent: string,
  minEntryPrice: string,
  duration: number = 365,
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

      console.log('order:', order);

      const signature = await signTypeMarginOrderData(order, account, chainId);
      console.log({ signature });

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
      console.log('populated: ', populated);

      await axios.post(limitOrderUrl[currentChainId] + '/createMarginOrder', {
        data: populated.data,
        from: account,
      });
    } catch (e) {
      console.log('e:', e);
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
  ]);

  return { createOrder, ...tx };
};

import { contractReader } from 'utils/sovryn/contract-reader';
import { selectWalletProvider } from 'app/containers/WalletProvider/selectors';
import { useAccount } from 'app/hooks/useAccount';
import { Asset } from 'types';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { TransactionConfig } from 'web3-core';
import { gas } from 'utils/blockchain/gas-price';
import { MarginOrder } from 'app/pages/MarginTradePage/helpers';
import { useSendTx } from '../useSendTx';
import { getContract, getDeadline } from './useLimitOrder';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { useTrading_resolvePairTokens } from '../trading/useTrading_resolvePairTokens';
import { toWei } from 'web3-utils';
import { newLoanId } from 'app/constants';

export const useMarginLimitOrder = (
  pair: TradingPair,
  position: TradingPosition,
  collateral: Asset,
  leverage: number,
  collateralTokenSent: string,
  minReturn,
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
    const created = ethers.BigNumber.from(Math.floor(Date.now() / 1000));

    // collateral === Asset.RBTC ? collateralTokenSent : '0', // weiAmount
    const order = new MarginOrder(
      newLoanId, // loanId
      toWei(String(leverage - 1), 'ether'), // leverageAmount
      loanToken, //  asset: Asset,
      useLoanTokens ? collateralTokenSent : '0', //loanTokenSent
      useLoanTokens ? '0' : collateralTokenSent, //collateralTokenSent
      collateralToken, //collateralToken
      account, // trader
      minReturn, //minReturn
      '0x', //loanDataBytes
      getDeadline(duration > 0 ? duration : 365).toString(),
      created.toString(),
    );

    // todo: signing inside of order.toArgs works only for browser wallets :(
    const args = await order.toArgs(chainId!);

    const contract = getContract('orderBook');

    const populated = await contract.populateTransaction.createOrder(args);

    const nonce = await contractReader.nonce(account);

    send({
      ...populated,
      gas: '600000',
      gasPrice: gas.get(),
      nonce,
    } as TransactionConfig);
  }, [
    leverage,
    loanToken,
    useLoanTokens,
    collateralTokenSent,
    collateralToken,
    account,
    minReturn,
    duration,
    chainId,
    send,
  ]);

  return { createOrder, ...tx };
};

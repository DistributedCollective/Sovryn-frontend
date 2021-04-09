// @ts-nocheck
import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useEffect } from 'react';
import { useMarginTrade } from './useMarginTrade';
import { useAccount } from '../useAccount';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';
import { useTrading_resolvePairTokens } from './useTrading_resolvePairTokens';

export function useApproveAndTrade(
  pair: TradingPair,
  position: TradingPosition,
  lendingContract: Asset,
  token: Asset,
  leverage: number,
  collateralTokenSent: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, lendingContract, token);

  const account = useAccount();

  useEffect(() => {
    console.log('.'.repeat(25));
    console.log('A: ', lendingContract, '<-', token);
    console.log('B: ', loanToken, '<-', collateralToken);
    console.log('loanTokenSent', useLoanTokens ? collateralTokenSent : '0');
    console.log(
      'collateralTokenSent',
      useLoanTokens ? '0' : collateralTokenSent,
    );
  }, [
    collateralTokenSent,
    loanToken,
    collateralToken,
    lendingContract,
    token,
    useLoanTokens,
  ]);

  const { trade, ...rest } = useMarginTrade(
    loanToken,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? collateralTokenSent : '0',
    // lendingContract === token ? collateralTokenSent : '0',
    useLoanTokens ? '0' : collateralTokenSent,
    // lendingContract === token ? '0' : collateralTokenSent,
    collateralToken,
    account, // trader
    '0x',
    token === Asset.RBTC ? collateralTokenSent : '0',
  );

  return {
    trade: async () => {
      let tx: CheckAndApproveResult = {};
      if (token !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          token,
          getLendingContract(loanToken).address,
          collateralTokenSent,
        );
        if (tx.rejected) {
          return;
        }
      }
      await trade(tx?.nonce, tx?.approveTx);
    },
    ...rest,
  };
}

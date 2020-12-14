import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useCallback, useEffect } from 'react';
import { useMarginTrade } from './useMarginTrade';
import { useAccount } from '../useAccount';
import {
  CheckAndApproveResult,
  contractWriter,
} from '../../../utils/sovryn/contract-writer';
import { TradingPairDictionary } from '../../../utils/dictionaries/trading-pair-dictionary';
import { TradingPair } from '../../../utils/models/trading-pair';
import { TradingPosition } from '../../../types/trading-position';

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
  const getLendingToken = useCallback(() => {
    if (
      TradingPairDictionary.longPositionTokens.includes(lendingContract) &&
      TradingPairDictionary.longPositionTokens.includes(token)
    ) {
      return token;
    }
    return lendingContract;
  }, [lendingContract, token]);

  const getToken = useCallback(() => {
    if (getLendingToken() === token) {
      return position === TradingPosition.LONG
        ? pair.getShortAsset()
        : pair.getLongAsset();
    }
    return token;
  }, [getLendingToken, token, pair, position]);

  const account = useAccount();

  useEffect(() => {
    console.log('.'.repeat(25));
    console.log('A: ', lendingContract, '<-', token);
    console.log('B: ', getLendingToken(), '<-', getToken());
    console.log(
      'loanTokenSent',
      getLendingToken() === token ? collateralTokenSent : '0',
    );
    console.log(
      'collateralTokenSent',
      getLendingToken() === token ? '0' : collateralTokenSent,
    );
  }, [collateralTokenSent, getLendingToken, getToken, lendingContract, token]);

  const { trade, ...rest } = useMarginTrade(
    getLendingToken(),
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    getLendingToken() === token ? collateralTokenSent : '0',
    // lendingContract === token ? collateralTokenSent : '0',
    getLendingToken() === token ? '0' : collateralTokenSent,
    // lendingContract === token ? '0' : collateralTokenSent,
    getToken(),
    account, // trader
    '0x',
    token === Asset.BTC ? collateralTokenSent : '0',
  );

  return {
    trade: async () => {
      let tx: CheckAndApproveResult = {};
      if (token !== Asset.BTC) {
        tx = await contractWriter.checkAndApprove(
          token,
          getLendingContract(getLendingToken()).address,
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

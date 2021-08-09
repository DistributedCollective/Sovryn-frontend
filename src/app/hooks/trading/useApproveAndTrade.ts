import { toWei } from 'web3-utils';
import { Asset } from 'types/asset';
import { getLendingContract } from 'utils/blockchain/contract-helpers';
import { useMarginTrade } from './useMarginTrade';
import { useMarginTradeAffiliate } from './useMarginTradeAffiliate';
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
  collateral: Asset,
  leverage: number,
  collateralTokenSent: string,
  minReturn,
  affiliateReferrer?: string,
  // loanId,
  // loanTokenSent,
  // collateralTokenAddress,
) {
  const {
    loanToken,
    collateralToken,
    useLoanTokens,
  } = useTrading_resolvePairTokens(pair, position, collateral);

  const account = useAccount();

  const { trade, ...rest } = useMarginTrade(
    loanToken,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? collateralTokenSent : '0',
    useLoanTokens ? '0' : collateralTokenSent,
    collateralToken,
    account, // trader
    minReturn,
    '0x',
    collateral === Asset.RBTC ? collateralTokenSent : '0',
  );

  const { trade: affTrade, ...affRest } = useMarginTradeAffiliate(
    loanToken,
    '0x0000000000000000000000000000000000000000000000000000000000000000', //0 if new loan
    toWei(String(leverage - 1), 'ether'),
    useLoanTokens ? collateralTokenSent : '0',
    useLoanTokens ? '0' : collateralTokenSent,
    collateralToken,
    account, // trader
    minReturn,
    affiliateReferrer,
    '0x',
    collateral === Asset.RBTC ? collateralTokenSent : '0',
  );

  return {
    trade: async (customData?: object) => {
      let tx: CheckAndApproveResult = {};
      if (collateral !== Asset.RBTC) {
        tx = await contractWriter.checkAndApprove(
          collateral,
          getLendingContract(loanToken).address,
          collateralTokenSent,
        );
        if (tx.rejected) {
          return;
        }
      }
      affiliateReferrer
        ? await affTrade(tx?.nonce, tx?.approveTx, customData)
        : await trade(tx?.nonce, tx?.approveTx, customData);
    },
    ...(affiliateReferrer ? affRest : rest),
  };
}

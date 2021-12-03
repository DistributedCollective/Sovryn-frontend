import { useAccount } from 'app/hooks/useAccount';
import { useSendContractTx } from 'app/hooks/useSendContractTx';
import { useContext } from 'react';
import { TxType } from 'store/global/transactions-store/types';
import { Asset } from 'types';
import { TradingPosition } from 'types/trading-position';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from 'utils/blockchain/math-helpers';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import {
  floatToABK64x64,
  PERPETUAL_ID,
  getSignedAmount,
  checkAndApprove,
} from '../utils/contractUtils';
import {
  calculateSlippagePrice,
  getRequiredMarginCollateral,
} from '../utils/perpUtils';
import { usePerpetual_marginAccountBalance } from './usePerpetual_marginAccountBalance';

const MASK_MARKET_ORDER = 0x40000000;
const MASK_CLOSE_ONLY = 0x80000000;

export const usePerpetual_openTradeWithoutManualDeposit = () => {
  const address = useAccount();

  const { ammState, perpetualParameters, averagePrice } = useContext(
    PerpetualQueriesContext,
  );

  const marginBalance = usePerpetual_marginAccountBalance();

  const { send, ...rest } = useSendContractTx('perpetualManager', 'trade');

  return {
    trade: async (
      isClosePosition: boolean | undefined = false,
      /** amount as wei string */
      amount: string = '0',
      leverage: number | undefined = 1,
      slippage: number | undefined = 0.5,
      tradingPosition: TradingPosition | undefined = TradingPosition.LONG,
    ) => {
      const signedAmount = getSignedAmount(tradingPosition, amount);

      let tradeDirection = Math.sign(signedAmount);

      const limitPrice = calculateSlippagePrice(
        averagePrice,
        slippage,
        tradeDirection,
      );

      const marginCollateralAmount = getRequiredMarginCollateral(
        leverage || 1,
        marginBalance.fPositionBC,
        marginBalance.fPositionBC - signedAmount,
        perpetualParameters,
        ammState,
      );

      const marginRequired = Math.max(
        0,
        marginCollateralAmount - marginBalance.fCashCC,
      );

      const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
      const timeNow = Math.round(Date.now() / 1000);

      const tx = await checkAndApprove(
        'PERPETUALS_token',
        getContract('perpetualManager').address,
        toWei(marginRequired),
        Asset.PERPETUALS,
      );

      if (tx.rejected) {
        return;
      }

      const order = [
        PERPETUAL_ID,
        address,
        floatToABK64x64(signedAmount),
        floatToABK64x64(limitPrice),
        deadline,
        ethGenesisAddress,
        isClosePosition ? MASK_CLOSE_ONLY : MASK_MARKET_ORDER,
        floatToABK64x64(leverage),
        timeNow,
      ];

      await send(
        [order],
        {
          from: address,
          gas: gasLimit[TxType.OPEN_PERPETUAL_TRADE],
          gasPrice: 60,
          nonce: tx?.nonce,
        },
        { type: TxType.OPEN_PERPETUAL_TRADE },
      );
    },
    ...rest,
  };
};

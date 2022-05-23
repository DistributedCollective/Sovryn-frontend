import { useAccount } from 'app/hooks/useAccount';
import { useContext } from 'react';
import { TxType } from 'store/global/transactions-store/types';
import { TradingPosition } from 'types/trading-position';
import { ethGenesisAddress, gasLimit } from 'utils/classifiers';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { floatToABK64x64, getSignedAmount } from '../utils/contractUtils';
import {
  PERPETUAL_SLIPPAGE_DEFAULT,
  PERPETUAL_GAS_PRICE_DEFAULT,
  PERPETUAL_CHAIN,
  PERPETUAL_PAYMASTER,
} from '../types';
import {
  PerpetualPairType,
  PerpetualPairDictionary,
} from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';
import { perpUtils } from '@sovryn/perpetual-swap';
import { getFunctionSignature } from 'utils/blockchain/contract-helpers';

const { calculateSlippagePrice } = perpUtils;

const MASK_MARKET_ORDER = 0x40000000;
const MASK_CLOSE_ONLY = 0x80000000;

export const usePerpetual_openTrade = (useGSN: boolean) => {
  const account = useAccount();

  const { perpetuals } = useContext(PerpetualQueriesContext);

  const functionSignature = getFunctionSignature();

  // Uncomment to see that arguments and returnValue are successfully extracted
  // type arguments = Parameters<typeof functionSignature>;
  // type returnValue = ReturnType<typeof functionSignature>;

  // We would need to adjust useGsnSendTx to accept generics and use it like this
  // const { send, ...rest } = useGsnSendTx<
  //   Parameters<typeof functionSignature>,
  //   ReturnType<typeof functionSignature>
  // >(PERPETUAL_CHAIN, 'perpetualManager', 'trade', PERPETUAL_PAYMASTER, useGSN);

  const { send, ...rest } = useGsnSendTx(
    PERPETUAL_CHAIN,
    'perpetualManager',
    'trade',
    PERPETUAL_PAYMASTER,
    useGSN,
  );

  return {
    trade: async (
      isClosePosition: boolean | undefined = false,
      /** amount as wei string */
      amount: string = '0',
      leverage: number | undefined = 1,
      slippage: number | undefined = PERPETUAL_SLIPPAGE_DEFAULT,
      tradingPosition: TradingPosition | undefined = TradingPosition.LONG,
      nonce?: number,
      customData?: PerpetualTx,
    ) => {
      const signedAmount = getSignedAmount(tradingPosition, amount);

      const pair = PerpetualPairDictionary.get(
        customData?.pair || PerpetualPairType.BTCUSD,
      );

      const { averagePrice } = perpetuals[pair.id];

      let tradeDirection = Math.sign(signedAmount);

      const limitPrice = calculateSlippagePrice(
        averagePrice,
        slippage,
        tradeDirection,
      );

      const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
      const timeNow = Math.round(Date.now() / 1000);
      const order = [
        pair.id,
        account,
        floatToABK64x64(signedAmount),
        floatToABK64x64(limitPrice),
        0, // TODO: this is fTriggerPrice, it will need to be adjusted once we have limit orders functionality, it's 0 for market orders
        deadline,
        ethGenesisAddress,
        isClosePosition ? MASK_CLOSE_ONLY : MASK_MARKET_ORDER,
        floatToABK64x64(leverage),
        timeNow,
      ];

      await send(
        [order],
        {
          from: account,
          gas: gasLimit[TxType.PERPETUAL_TRADE],
          gasPrice: PERPETUAL_GAS_PRICE_DEFAULT,
          nonce,
        },
        {
          type: TxType.PERPETUAL_TRADE,
          asset: pair.collateralAsset,
          customData,
        },
      );
    },
    txData: rest.txData,
    txHash: rest.txHash,
    loading: rest.loading,
    status: rest.status,
    reset: rest.reset,
  };
};

import { useAccount } from 'app/hooks/useAccount';
import { useContext, useMemo } from 'react';
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
import { Asset } from '../../../../types';
import { PerpetualTx } from '../components/TradeDialog/types';
import { useGsnSendTx } from '../../../hooks/useGsnSendTx';
import { perpUtils } from '@sovryn/perpetual-swap';
import { usePerpetual_getCurrentPairId } from './usePerpetual_getCurrentPairId';

const { calculateSlippagePrice } = perpUtils;

const MASK_MARKET_ORDER = 0x40000000;
const MASK_CLOSE_ONLY = 0x80000000;

export const usePerpetual_openTrade = (
  pairType: PerpetualPairType,
  useGSN: boolean,
) => {
  const account = useAccount();
  const perpetualId = useMemo(() => PerpetualPairDictionary.get(pairType)?.id, [
    pairType,
  ]);

  const currentPairId = usePerpetual_getCurrentPairId();
  const { perpetuals } = useContext(PerpetualQueriesContext);
  const { averagePrice } = perpetuals[currentPairId];

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

      let tradeDirection = Math.sign(signedAmount);

      const limitPrice = calculateSlippagePrice(
        averagePrice,
        slippage,
        tradeDirection,
      );

      const deadline = Math.round(Date.now() / 1000) + 86400; // 1 day
      const timeNow = Math.round(Date.now() / 1000);
      const order = [
        perpetualId,
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
          asset: Asset.BTCS,
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

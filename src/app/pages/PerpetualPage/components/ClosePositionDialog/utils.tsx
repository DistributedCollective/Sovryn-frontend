import { PerpetualTrade } from '../../types';
import { TradingPosition } from '../../../../../types/trading-position';

export const generateCloseTrade = (trade: PerpetualTrade): PerpetualTrade => ({
  pairType: trade.pairType,
  collateral: trade.collateral,
  tradeType: trade.tradeType,
  position:
    trade.position === TradingPosition.LONG
      ? TradingPosition.SHORT
      : TradingPosition.LONG,
  amount: trade.amount,
  leverage: trade.leverage,
  slippage: trade.slippage,
  entryPrice: trade.entryPrice,
  averagePrice: trade.averagePrice,
  isClosePosition: true,
});

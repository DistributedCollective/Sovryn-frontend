import { createState, useState } from '@hookstate/core';
import { TradingPairType } from '../../../../utils/dictionaries/trading-pair-dictionary';

export const tradeState = createState({
  pairType: TradingPairType.BPRO_USDT,

  amount: ''
});

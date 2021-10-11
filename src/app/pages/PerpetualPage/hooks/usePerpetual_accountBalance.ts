import {
  RecentTradesDataEntry,
  TradePriceChange,
  TradeType,
} from '../components/RecentTradesTable/types';

import { useBlockSync } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpatual-pair-dictionary';

export const usePerpetual_accountBalance = (pairType: PerpetualPairType) => {
  const blockId = useBlockSync();
  const [balance, setBalance] = useState<string | null>(null);

  // TODO: implement perpetual account balance fetching

  useEffect(() => {
    setBalance(toWei(1337.7331));
  }, [blockId]);

  return balance;
};

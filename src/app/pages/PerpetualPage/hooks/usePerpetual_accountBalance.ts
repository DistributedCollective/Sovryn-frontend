import {
  RecentTradesDataEntry,
  TradePriceChange,
  TradeType,
} from '../components/RecentTradesTable/types';

import { useBlockSync } from 'app/hooks/useAccount';
import { useEffect, useState } from 'react';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';

type AccountBalance = {
  total: string;
  available: string;
  inPositions: string;
  unrealized: string;
};

export const usePerpetual_accountBalance = (pairType: PerpetualPairType) => {
  const blockId = useBlockSync();
  const [data, setData] = useState<AccountBalance>({
    total: '',
    available: '',
    inPositions: '',
    unrealized: '',
  });

  // TODO: implement perpetual account Data fetching

  useEffect(() => {
    const unrealized = blockId % 2 === 0 ? 37.7331 : -37.7331;
    setData({
      total: toWei(1300 + unrealized),
      available: toWei(500),
      inPositions: toWei(700),
      unrealized: toWei(unrealized),
    });
  }, [blockId]);

  return data;
};

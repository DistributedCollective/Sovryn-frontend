import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import { usePerpetual_queryTraderState } from './usePerpetual_queryTraderState';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { usePerpetual_marginAccountBalance } from './usePerpetual_marginAccountBalance';
import { usePerpetual_queryAmmState } from './usePerpetual_queryAmmState';
import { getTraderPnL } from '../utils/perpUtils';
import { bignumber } from 'mathjs';

type AccountBalance = {
  total: string;
  available: string;
  inPositions: string;
  unrealized: string;
};

export const usePerpetual_accountBalance = (pairType: PerpetualPairType) => {
  const blockId = useBlockSync();
  const account = useAccount();
  const [data, setData] = useState<AccountBalance>({
    total: '',
    available: '',
    inPositions: '',
    unrealized: '',
  });

  const [availableBalance, setAvailableBalance] = useState('0');

  const traderState = usePerpetual_queryTraderState();
  const ammState = usePerpetual_queryAmmState();
  const marginBalance = usePerpetual_marginAccountBalance();

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('PERPETUALS_token').address,
        marginTokenAbi,
        'balanceOf',
        [account],
      )
      .catch(e => console.log(e))
      .then(result => result && setAvailableBalance(String(result)));
  }, [account]);

  const unrealizedPnl = useMemo(() => getTraderPnL(traderState, ammState), [
    ammState,
    traderState,
  ]);

  useEffect(() => {
    setData({
      total: bignumber(availableBalance).add(marginBalance.fCashCC).toString(),
      available: availableBalance,
      inPositions: toWei(marginBalance.fCashCC),
      unrealized: toWei(unrealizedPnl),
    });
  }, [availableBalance, blockId, marginBalance.fCashCC, unrealizedPnl]);

  return data;
};

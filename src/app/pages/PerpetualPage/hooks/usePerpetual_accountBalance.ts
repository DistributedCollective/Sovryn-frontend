import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { usePerpetual_marginAccountBalance } from './usePerpetual_marginAccountBalance';
import { getTraderPnLInCC } from '../utils/perpUtils';
import { bignumber } from 'mathjs';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';

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

  const { ammState, traderState, perpetualParameters } = useContext(
    PerpetualQueriesContext,
  );

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

  const unrealizedPnl = useMemo(
    () => getTraderPnLInCC(traderState, ammState, perpetualParameters),
    [ammState, perpetualParameters, traderState],
  );

  useEffect(() => {
    setData({
      total: bignumber(availableBalance)
        .add(toWei(marginBalance.fCashCC))
        .toString(),
      available: availableBalance,
      inPositions: toWei(marginBalance.fCashCC),
      unrealized: toWei(unrealizedPnl),
    });
  }, [availableBalance, blockId, marginBalance.fCashCC, unrealizedPnl]);

  return data;
};

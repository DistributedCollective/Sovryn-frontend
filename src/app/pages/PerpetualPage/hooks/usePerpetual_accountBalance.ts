import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { toWei } from '../../../../utils/blockchain/math-helpers';
import { PerpetualPairType } from '../../../../utils/dictionaries/perpetual-pair-dictionary';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import { getTraderPnLInCC, getBase2CollateralFX } from '../utils/perpUtils';
import { bignumber } from 'mathjs';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';

type AccountBalance = {
  total: string;
  available: string;
  inPositions: string;
  unrealized: string;
};

export const usePerpetual_accountBalance = (
  pairType: PerpetualPairType,
): AccountBalance => {
  const blockId = useBlockSync();
  const account = useAccount();

  const [availableBalance, setAvailableBalance] = useState('0');

  const { ammState, traderState, perpetualParameters } = useContext(
    PerpetualQueriesContext,
  );

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
  }, [account, blockId]);

  const unrealizedPnl = useMemo(
    () => getTraderPnLInCC(traderState, ammState, perpetualParameters),
    [ammState, perpetualParameters, traderState],
  );

  const inPosition = useMemo(
    () =>
      traderState.marginAccountPositionBC *
      getBase2CollateralFX(ammState, false),
    [traderState.marginAccountPositionBC, ammState],
  );

  return useMemo(
    () => ({
      total: bignumber(availableBalance)
        .add(toWei(traderState.availableCashCC))
        .toString(),
      available: availableBalance,
      inPositions: toWei(inPosition),
      unrealized: toWei(unrealizedPnl),
    }),
    [availableBalance, traderState.availableCashCC, inPosition, unrealizedPnl],
  );
};

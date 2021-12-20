import { useAccount, useBlockSync } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import {
  numberFromWei,
  toWei,
} from '../../../../utils/blockchain/math-helpers';
import marginTokenAbi from 'utils/blockchain/abi/MarginToken.json';
import {
  getTraderPnLInCC,
  getBase2CollateralFX,
  getQuote2CollateralFX,
} from '../utils/perpUtils';
import { bignumber } from 'mathjs';
import { PerpetualQueriesContext } from '../contexts/PerpetualQueriesContext';
import { PerpetualPairType } from 'utils/dictionaries/perpetual-pair-dictionary';

type AccountBalance = {
  total: {
    collateralValue: string;
    quoteValue: string;
  };
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

  const inPosition = traderState.availableCashCC;

  const totalCollateralValue = useMemo(
    () => bignumber(availableBalance).add(toWei(inPosition)).toString(),
    [availableBalance, inPosition],
  );

  const totalQuoteValue = useMemo(
    () =>
      toWei(
        numberFromWei(totalCollateralValue) / getQuote2CollateralFX(ammState),
      ),
    [ammState, totalCollateralValue],
  );

  return useMemo(
    () => ({
      total: {
        collateralValue: totalCollateralValue,
        quoteValue: totalQuoteValue,
      },
      available: availableBalance,
      inPositions: toWei(inPosition),
      unrealized: toWei(unrealizedPnl),
    }),
    [
      totalCollateralValue,
      totalQuoteValue,
      availableBalance,
      inPosition,
      unrealizedPnl,
    ],
  );
};

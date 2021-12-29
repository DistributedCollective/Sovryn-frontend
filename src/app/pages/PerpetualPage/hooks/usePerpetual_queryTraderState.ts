import { TraderState } from '../utils/perpUtils';
import { useEffect, useState, useCallback, useMemo } from 'react';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { ABK64x64ToFloat } from '../utils/contractUtils';
import { useAccount } from 'app/hooks/useAccount';

export const initialTraderState: TraderState = {
  marginBalanceCC: 0,
  availableMarginCC: 0,
  availableCashCC: 0,
  marginAccountCashCC: 0,
  marginAccountPositionBC: 0,
  marginAccountLockedInValueQC: 0,
  fUnitAccumulatedFundingStart: 0,
};

export const usePerpetual_queryTraderState = (perpetualId: string) => {
  const [traderState, setTraderState] = useState(initialTraderState);
  const account = useAccount();

  const fetch = useCallback(() => {
    if (!account) {
      return;
    }

    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getTraderState',
        [perpetualId, account],
      )
      .catch(console.error)
      .then(result => result && setTraderState(parseTraderState(result)));
  }, [perpetualId, account]);

  useEffect(fetch, [fetch]);

  return useMemo(
    () => ({
      refetch: fetch,
      result: traderState,
    }),
    [fetch, traderState],
  );
};

export const parseTraderState = (traderStateArr: any): TraderState => ({
  marginBalanceCC: ABK64x64ToFloat(traderStateArr[0]), // current margin balance
  availableMarginCC: ABK64x64ToFloat(traderStateArr[1]), // amount over initial margin
  availableCashCC: ABK64x64ToFloat(traderStateArr[2]), // cash minus unpaid funding
  marginAccountCashCC: ABK64x64ToFloat(traderStateArr[3]), // from margin account
  marginAccountPositionBC: ABK64x64ToFloat(traderStateArr[4]), // from margin account
  marginAccountLockedInValueQC: ABK64x64ToFloat(traderStateArr[5]), // from margin account
  fUnitAccumulatedFundingStart: ABK64x64ToFloat(traderStateArr[6]), // from margin account
});

import { TraderState } from '../utils/perpUtils';
import { useEffect, useState } from 'react';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils/contractUtils';
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

export const usePerpetual_queryTraderState = (): TraderState => {
  const [traderState, setTraderState] = useState(initialTraderState);
  const account = useAccount();

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getTraderState',
        [PERPETUAL_ID, account],
      )
      .catch(e => console.error(e))
      .then(result => result && setTraderState(parseTraderState(result)));
  }, [account]);

  return traderState;
};

const parseTraderState = (response: any): TraderState => ({
  marginBalanceCC: ABK64x64ToFloat(response[0]),
  availableMarginCC: ABK64x64ToFloat(response[1]),
  availableCashCC: ABK64x64ToFloat(response[2]),
  marginAccountCashCC: ABK64x64ToFloat(response[3]),
  marginAccountPositionBC: ABK64x64ToFloat(response[4]),
  marginAccountLockedInValueQC: ABK64x64ToFloat(response[5]),
  fUnitAccumulatedFundingStart: ABK64x64ToFloat(response[6]),
});

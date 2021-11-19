import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';
import { ABK64x64ToFloat, PERPETUAL_ID } from '../utils/contractUtils';
import perpetualManagerAbi from 'utils/blockchain/abi/PerpetualManager.json';
import { useAccount } from 'app/hooks/useAccount';

type marginAccountBalance = {
  fCashCC: number;
  fLockedInValueQC: number;
  fPositionBC: number;
};

export const usePerpetual_marginAccountBalance = () => {
  const address = useAccount();
  const [marginAccountBalance, setMarginAccountBalance] = useState<
    marginAccountBalance
  >({
    fCashCC: -1,
    fLockedInValueQC: -1,
    fPositionBC: -1,
  });

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        getContract('perpetualManager').address,
        perpetualManagerAbi,
        'getMarginAccount',
        [PERPETUAL_ID, address],
      )
      .then(result => {
        const [fLockedInValueQC, fCashCC, fPositionBC] = result;

        setMarginAccountBalance({
          fCashCC: fCashCC ? ABK64x64ToFloat(fCashCC) : 0,
          fLockedInValueQC: fLockedInValueQC
            ? ABK64x64ToFloat(fLockedInValueQC)
            : 0,
          fPositionBC: fPositionBC ? ABK64x64ToFloat(fPositionBC) : 0,
        });
      })
      .catch(e => console.error(e.message));
  }, [address]);

  return marginAccountBalance;
};

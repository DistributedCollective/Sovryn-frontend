import { useAccount } from 'app/hooks/useAccount';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { useEffect, useMemo, useState } from 'react';
import { Chain } from 'types';
import { getContract } from 'utils/blockchain/contract-helpers';

// IMPORTANT: Do not use anywhere, this is here just in case we decide to turn on whitelist before the mainnet launch/during the mainnet competition. It will be deleted after the launch.
export const usePerpetual_isAddressWhitelisted = (): boolean => {
  const [isAddressWhitelisted, setIsAddressWhitelisted] = useState(false);
  const account = useAccount();

  const perpetualManagerContract = useMemo(
    () => getContract('perpetualManager'),
    [],
  );

  useEffect(() => {
    bridgeNetwork
      .call(
        Chain.BSC,
        perpetualManagerContract.address,
        perpetualManagerContract.abi,
        'isAddrWhitelisted',
        [account],
      )
      .then(result => setIsAddressWhitelisted(result))
      .catch(e => console.log(e));
  }, [account, perpetualManagerContract.abi, perpetualManagerContract.address]);

  return isAddressWhitelisted;
};

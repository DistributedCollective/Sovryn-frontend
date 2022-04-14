import { useMemo, useState } from 'react';
import { constants } from 'ethers';
import { useSelector } from 'react-redux';
import { Chain } from 'types';
import { selectWalletProvider } from '../containers/WalletProvider/selectors';
import { useAccount } from './useAccount';
import { useDebouncedEffect } from './useDebouncedEffect';
import { bridgeNetwork } from 'app/pages/BridgeDepositPage/utils/bridge-network';
import { getContract } from 'utils/blockchain/contract-helpers';

const { abi: erc20TokenAbi } = getContract('SOV_token');

export function useBridgeNetworkBalance(
  chain: Chain,
  tokenAddress: string = constants.AddressZero,
  ownerAddress?: string,
) {
  const { syncBlockNumber } = useSelector(selectWalletProvider);
  const address = useAccount();

  const owner = useMemo(() => ownerAddress || address, [ownerAddress, address]);

  const [state, setState] = useState({
    value: '0',
    loading: true,
    error: null,
  });

  useDebouncedEffect(
    () => {
      setState(prevState => ({ ...prevState, loading: true, error: null }));
      if (tokenAddress === constants.AddressZero) {
        bridgeNetwork
          .getProvider(chain)
          .getBalance(owner)
          .then(balance => {
            setState(prevState => ({
              ...prevState,
              value: balance.toString(),
              loading: false,
              error: null,
            }));
          })
          .catch(error => {
            setState(prevState => ({ ...prevState, error }));
          });
      } else {
        bridgeNetwork
          .call(chain, tokenAddress, erc20TokenAbi, 'balanceOf', [owner])
          .then(balance => {
            setState(prevState => ({
              ...prevState,
              value: balance.toString(),
              loading: false,
              error: null,
            }));
          })
          .catch(error => {
            setState(prevState => ({ ...prevState, error }));
          });
      }
    },
    [chain, tokenAddress, syncBlockNumber, owner],
    300,
  );
  return state;
}

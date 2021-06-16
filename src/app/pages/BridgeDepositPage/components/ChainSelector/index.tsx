/**
 *
 * BridgeDepositPage
 *
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';

import { actions } from '../../slice';
import { Chain } from '../../../../../types';
import { getBridgeChainId } from '../../utils/helpers';
import { selectBridgeDepositPage } from '../../selectors';
import { BridgeNetworkDictionary } from '../../dictionaries/bridge-network-dictionary';
import { BridgeDictionary } from '../../dictionaries/bridge-dictionary';
import { currentChainId } from '../../../../../utils/classifiers';

interface Props {}

export function ChainSelector(props: Props) {
  const { chain } = useSelector(selectBridgeDepositPage);
  const dispatch = useDispatch();

  const walletContext = useWalletContext();

  const selectNetwork = useCallback(
    (chain: Chain) => {
      dispatch(actions.selectNetwork({ chain, walletContext }));
    },
    [dispatch, walletContext],
  );

  const state = useMemo(() => {
    if (
      chain !== null &&
      web3Wallets.includes(walletContext.wallet.providerType) &&
      walletContext.wallet.isConnected() &&
      walletContext.wallet.chainId !== getBridgeChainId(chain as Chain)
    ) {
      return 'wrong-network';
    }

    return 'choose-network';
  }, [walletContext, chain]);

  const network = useMemo(() => BridgeNetworkDictionary.get(chain as Chain), [
    chain,
  ]);

  // It excludes current dapp chain (no RSK network), but i think it should be there in the end.
  const networks = useMemo(
    () =>
      BridgeDictionary.listNetworks().filter(
        item => item.chainId !== currentChainId,
      ),
    [],
  );

  return (
    <div>
      <h1>Select Network to deposit from</h1>
      {state === 'wrong-network' && (
        <>Switch your wallet to {network?.name} network.</>
      )}
      {state === 'choose-network' && (
        <div className="tw-grid tw-gap-5 tw-grid-cols-4">
          {networks.map(item => (
            <button
              key={item.chain}
              onClick={() => selectNetwork(item.chain)}
              className="tw-p-3 tw-bg-gray-800 hover:tw-bg-gray-900"
            >
              <img src={item.logo} alt={item.name} className="tw-w-8 tw-h-8" />
              {item.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

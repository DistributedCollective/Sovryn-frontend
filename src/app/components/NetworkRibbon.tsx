import React, { useMemo } from 'react';
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import { currentChainId, currentNetwork } from '../../utils/classifiers';

export function NetworkRibbon() {
  const { connected, wallet } = useWalletContext();

  const show = useMemo(() => {
    return (
      connected &&
      web3Wallets.includes(wallet.providerType) &&
      wallet.chainId !== currentChainId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId, wallet.providerType]);

  return (
    <>
      {show && (
        <div className="bg-red py-3">
          <div className="container text-center">
            You are connected to wrong network. Please switch to RSK{' '}
            {currentNetwork}.
          </div>
        </div>
      )}
    </>
  );
}

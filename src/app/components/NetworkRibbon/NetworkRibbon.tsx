import { useWalletContext, walletService } from '@sovryn/react-wallet';
import { ProviderType, web3Wallets } from '@sovryn/wallet';
import React, { useEffect, useState } from 'react';

import { currentChainId } from '../../../utils/classifiers';
import { NetworkDialog } from '../NetworkDialog';

import './_networkRibbon.scss';

export function NetworkRibbon() {
  const { connected, wallet } = useWalletContext();
  console.log(useWalletContext());
  const getStatus = () =>
    connected &&
    web3Wallets.includes(wallet.providerType) &&
    wallet.chainId !== currentChainId;
  const [isConnect, setShow] = useState(getStatus());
  console.log('current', wallet);
  console.log('provider', walletService.providerType === ProviderType.WEB3);
  console.log('chainId', currentChainId);

  useEffect(() => {
    setShow(getStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId, wallet.providerType]);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <NetworkDialog
        isOpen={isConnect}
        onClose={handleClose}
        className="fw-900"
        size="normal"
      >
        <div className="py-1 font-family-montserrat">
          <div className="container text-center title">
            Change to RSK Network{' '}
          </div>
        </div>
        <div className="py-3 font-family-montserrat">
          <div className="container text-left subtitle">
            We detected that you are on Ethereum Mainnet
            <br /> Please switch to RSK Mainnet in your Metamask wallet
          </div>
        </div>
      </NetworkDialog>
    </>
  );
}

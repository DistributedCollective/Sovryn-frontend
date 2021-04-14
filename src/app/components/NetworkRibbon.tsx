import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import React, { useEffect, useState } from 'react';

import { currentChainId, currentNetwork } from '../../utils/classifiers';
import { Dialog } from '../containers/Dialog/Loadable';

export function NetworkRibbon() {
  const { connected, wallet } = useWalletContext();
  const getStatus = () =>
    connected &&
    web3Wallets.includes(wallet.providerType) &&
    wallet.chainId !== currentChainId;
  const [isConnect, setShow] = useState(getStatus());

  useEffect(() => {
    setShow(getStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId, wallet.providerType]);
  const handleClose = () => {
    setShow(false);
  };
  return (
    <>
      <Dialog
        isOpen={isConnect}
        onClose={handleClose}
        canOutsideClickClose={false}
        isCloseButtonShown={true}
        canEscapeKeyClose={false}
        className="fw-900 p-4"
      >
        <div className="py-3">
          <div className="container text-center">
            You are connected to wrong network. Please switch to RSK{' '}
            {currentNetwork}.
          </div>
        </div>
      </Dialog>
    </>
  );
}

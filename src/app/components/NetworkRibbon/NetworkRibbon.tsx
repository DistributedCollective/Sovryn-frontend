/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import React, { useEffect, useState } from 'react';

import { currentChainId } from '../../../utils/classifiers';
import { detectWeb3Wallet } from '../../../utils/helpers';
import { NetworkDialog } from '../NetworkDialog';
import { DetectionScreen } from './component/DetectionScreen';
import { TutorialScreen } from './component/TutorialScreen';

import './_networkRibbon.scss';

export function NetworkRibbon(this: any) {
  const { connected, wallet } = useWalletContext();
  console.log(useWalletContext());
  const walletName = detectWeb3Wallet();
  const getStatus = () =>
    connected &&
    web3Wallets.includes(wallet.providerType) &&
    wallet.chainId !== currentChainId;
  const [isConnect, setShow] = useState(getStatus());
  const [startTut, setStart] = useState(false);
  useEffect(() => {
    setShow(getStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId, wallet.providerType]);
  const handleClose = () => {
    setShow(false);
  };
  const handleTutDialog = () => {
    setStart(true);
  };
  return (
    <NetworkDialog
      isOpen={isConnect}
      onClose={handleClose}
      className="fw-700"
      size="normal"
    >
      {!startTut ? (
        <DetectionScreen onStart={handleTutDialog} walletType={walletName} />
      ) : (
        <TutorialScreen walletType={walletName} />
      )}
    </NetworkDialog>
  );
}

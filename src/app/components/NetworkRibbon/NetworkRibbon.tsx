/* eslint-disable jsx-a11y/anchor-is-valid */
import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import { detectWeb3Wallet } from '../../../utils/helpers';
import React, { useEffect, useState } from 'react';

import error_alert from '../../../assets/images/error_outline-24px.svg';
import liquality from '../../../assets/wallet_icons/liquality.svg';
import { currentChainId } from '../../../utils/classifiers';
import { NetworkDialog } from '../NetworkDialog';

import './_networkRibbon.scss';

export function NetworkRibbon(this: any) {
  const { connected, wallet } = useWalletContext();
  console.log(useWalletContext());
  const getStatus = () =>
    connected &&
    web3Wallets.includes(wallet.providerType) &&
    wallet.chainId !== currentChainId;
  const [isConnect, setShow] = useState(getStatus());
  console.log('current chaind', web3Wallets);
  const walletName = detectWeb3Wallet();
  useEffect(() => {
    setShow(getStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, wallet.chainId, wallet.providerType]);
  const handleClose = () => {
    setShow(false);
  };
  const handleTutDialog = () => {
    setShow(false);
  };
  return (
    <>
      <NetworkDialog
        isOpen={isConnect}
        onClose={handleClose}
        className="fw-700"
        size="normal"
      >
        <div className="py-2 font-family-montserrat">
          <div className="text-center title">Change to RSK Network </div>
        </div>
        <div className="d-flex my-3 justify-content-center flex-row py-3 font-family-montserrat">
          <div className="mr-2">
            <img src={error_alert} alt="1" />
          </div>
          <div className="text-left subtitle">
            We detected that you are on Ethereum Mainnet
            <br /> Please switch to RSK Mainnet in your {walletName} wallet
          </div>
        </div>
        <div className="d-flex my-3 justify-content-center flex-row py-3 font-family-montserrat">
          <div className="d-flex justify-content-center align-items-center logo">
            <img alt="1" src={liquality} className="text-center" />
          </div>
        </div>
        <div className="d-flex my-3 justify-content-center align-items-center text-center">
          <a
            onClick={handleTutDialog}
            className="titleTut font-family-montserrat"
          >
            How to connect to RSK Mainnet with {walletName}
          </a>
        </div>
      </NetworkDialog>
    </>
  );
}

// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useState, useEffect, useCallback } from 'react';
import { useIsConnected } from 'app/hooks/useAccount';
import { Sovryn } from 'utils/sovryn';
import { TutorialDialogComponent } from '../component';
import { currentChainId } from 'utils/classifiers';

export function TutorialDialog() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  const [show, setShow] = useState<boolean>(false);

  const onNetwork =
    window.ethereum && parseInt(window.ethereum.chainId) === currentChainId;

  const checks = {
    // previousUser:
    //   window.localStorage.getItem('connectedToRskBefore') === 'true',
    connected: useIsConnected(),
    closedBefore: window.sessionStorage.getItem('closedRskTutorial') === 'true',
  };

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(err => {
        console.error(err);
      });
  }, []);

  function handleEngage() {
    handleWalletConnection();
    window.localStorage.setItem('ongoing_tutorial', 'false');
    window.sessionStorage.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  useEffect(() => {
    const shouldShow = Object.values(checks).every(check => check === false);
    if (shouldShow) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [checks]);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (show) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  });

  function handleClose() {
    const walletConectModal = document.getElementById('walletconnect-wrapper');
    walletConectModal?.classList.remove('showWalletConnect');
    walletConectModal?.classList.add('d-none');
    window.localStorage.setItem('tutorial_active', 'false');
    window.sessionStorage.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  //On open, check session storage for preference

  return (
    <>
      {show && (
        <TutorialDialogComponent
          handleClose={handleClose}
          onNetwork={onNetwork}
          handleEngage={handleEngage}
        />
      )}
    </>
  );
}

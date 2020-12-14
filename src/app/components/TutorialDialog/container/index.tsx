// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useState, useEffect, useCallback } from 'react';
import { useIsConnected } from 'app/hooks/useAccount';
import { Sovryn } from 'utils/sovryn';
import { TutorialDialogComponent } from '../component';
import { MobileNotReady } from '../mobileNotReady';
import { currentChainId } from 'utils/classifiers';
import { reactLocalStorage } from 'reactjs-localstorage';
import * as storage from 'utils/storage';

export function TutorialDialog() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  const [show, setShow] = useState<boolean>(false);

  const onNetwork =
    window.ethereum && parseInt(window.ethereum.chainId) === currentChainId;

  const checks = {
    // previousUser:
    //   window.localStorage.getItem('connectedToRskBefore') === 'true',
    connected: useIsConnected(),
    closedBefore: storage.session.getItem('closedRskTutorial') === 'true',
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
    storage.local.setItem('ongoing_tutorial', 'false');
    storage.session.setItem('closedRskTutorial', 'true');
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
  }, [show]);

  function handleClose() {
    const walletConectModal = document.getElementById('walletconnect-wrapper');
    walletConectModal?.classList.remove('showWalletConnect');
    walletConectModal?.classList.add('d-none');
    reactLocalStorage.set('tutorial_active', 'false');
    storage.session.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  //On open, check session storage for preference

  return (
    <>
      {show && (
        <>
          <div className="d-none d-md-block">
            <TutorialDialogComponent
              handleClose={handleClose}
              onNetwork={onNetwork}
              handleEngage={handleEngage}
            />
          </div>
          <div className="d-block d-md-none">
            <MobileNotReady />
          </div>
        </>
      )}
    </>
  );
}

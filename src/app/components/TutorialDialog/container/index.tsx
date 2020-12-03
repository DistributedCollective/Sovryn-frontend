// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useState, useEffect, useCallback } from 'react';
import { useIsConnected } from 'app/hooks/useAccount';
import { Sovryn } from 'utils/sovryn';
import { TutorialDialogComponent } from '../component';

export function TutorialDialog() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  const [show, setShow] = useState<boolean>(true);

  const checks = {
    previousUser:
      window.localStorage.getItem('connectedToRskBefore') === 'true',
    connected: useIsConnected(),
    closedBefore: window.sessionStorage.getItem('closedRskTutorial') === 'true',
  };

  const connectedToMainnet = window.ethereum
    ? window.ethereum.chainId === '0x1e'
    : false;

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(console.error);
  }, []);

  function handleEngage() {
    handleWalletConnection();
    window.sessionStorage.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  // useEffect(() => {
  //   const shouldShow = Object.values(checks).every(check => check === false);
  //   if (shouldShow) {
  //     setShow(true);
  //   }
  // }, [checks]);

  useEffect(() => {
    const body = document.getElementsByTagName('body')[0];
    if (show) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  });

  function handleClose() {
    window.sessionStorage.setItem('closedRskTutorial', 'true');
    setShow(false);
  }

  //On open, check session storage for preference

  return (
    <>
      {show && (
        <TutorialDialogComponent
          handleClose={handleClose}
          onMainnet={connectedToMainnet}
          handleEngage={handleEngage}
        />
      )}
    </>
  );
}

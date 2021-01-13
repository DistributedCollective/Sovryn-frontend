// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import { actions, reducer, sliceKey } from './slice';
import { Sovryn } from 'utils/sovryn';
import { currentChainId } from 'utils/classifiers';
import { useInjectReducer } from 'utils/redux-injectors';
import { selectTutorialSOVModal } from './selectors';
import { TutorialDialogComponent } from './component';
import { MobileNotReady } from './mobileNotReady';

export function TutorialSOVModal() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  useInjectReducer({ key: sliceKey, reducer: reducer });
  const dispatch = useDispatch();
  const state = useSelector(selectTutorialSOVModal);
  const onNetwork =
    window.ethereum && parseInt(window.ethereum.chainId) === currentChainId;

  const checks = {
    closedBefore: reactLocalStorage.get('closedRskTutorial') === 'true',
  };

  const handleWalletConnection = useCallback(() => {
    Sovryn.connect()
      .then(() => {})
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleClose = useCallback(() => {
    const walletConectModal = document.getElementById('walletconnect-wrapper');
    walletConectModal?.classList.remove('showWalletConnect');
    walletConectModal?.classList.add('d-none');
    reactLocalStorage.set('tutorial_active', 'false');
    reactLocalStorage.set('closedRskTutorial', 'true');
    dispatch(actions.hideModal());
  }, [dispatch]);

  const handleEngage = useCallback(() => {
    reactLocalStorage.set('closedRskTutorial', 'true');
    dispatch(actions.hideModal());
    handleWalletConnection();
  }, [dispatch, handleWalletConnection]);

  useEffect(() => {
    const shouldShow = Object.values(checks).every(check => !check);
    const body = document.getElementsByTagName('body')[0];
    if (shouldShow) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }
  }, [checks]);

  //On open, check TutorialModal state
  return (
    <>
      {state.modalType && (
        <div>
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
        </div>
      )}
    </>
  );
}

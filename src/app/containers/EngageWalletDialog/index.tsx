// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useEffect, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import { actions } from 'app/containers/EngageWalletDialog/slice';
import { Sovryn } from 'utils/sovryn';
import { SHOW_MODAL } from 'utils/classifiers';
import { currentChainId } from 'utils/classifiers';
import { useInjectReducer } from 'utils/redux-injectors';
import { selectTutorialDialogModal } from './selectors';
import { TutorialDialogComponent } from './component';
import { reducer, sliceKey } from './slice';
import { MobileNotReady } from './mobileNotReady';
import { Classes, Overlay } from '@blueprintjs/core';

export function EngageWalletDialog() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  useInjectReducer({ key: sliceKey, reducer: reducer });
  const state = useSelector(selectTutorialDialogModal);
  const [onNetwork, setOnNetwork] = useState(false);

  useEffect(() => {
    setOnNetwork(
      window?.ethereum &&
        parseInt(window?.ethereum?.chainId) === currentChainId,
    );

    try {
      window?.ethereum?.on('chainChanged', chain => {
        setOnNetwork(parseInt(chain) === currentChainId);
      });
    } catch (e) {
      window?.ethereum?.off('chainChanged');
    }
  }, []);

  const dispatch = useDispatch();

  const handleWalletConnection = useCallback((wallet?: string) => {
    if (wallet) {
      Sovryn.connectTo(wallet).catch();
    } else {
      Sovryn.connect().catch();
    }
  }, []);

  const handleClose = useCallback(() => {
    const walletConectModal = document.getElementById('walletconnect-wrapper');
    walletConectModal?.classList.remove('showWalletConnect');
    walletConectModal?.classList.add('d-none');
    reactLocalStorage.set('tutorial_active', 'false');
    reactLocalStorage.set('closedRskTutorial', 'true');
    dispatch(actions.hideModal());
  }, [dispatch]);

  const handleEngage = useCallback(
    (wallet?: string) => {
      reactLocalStorage.set('closedRskTutorial', 'true');
      dispatch(actions.hideModal());
      handleWalletConnection(wallet);
    },
    [dispatch, handleWalletConnection],
  );

  useEffect(() => {
    const body = document.body;
    if (state.modalType) {
      body.classList.add('overflow-hidden');
      dispatch(actions.showModal(SHOW_MODAL));
    } else {
      body.classList.remove('overflow-hidden');
      dispatch(actions.hideModal());
    }
  }, [state.modalType, dispatch]);

  //On open, check TutorialModal state
  return (
    <Overlay
      isOpen={!!state.modalType}
      onClose={() => dispatch(actions.hideModal())}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div className="custom-dialog">
          <div className="d-none d-md-block">
            <TutorialDialogComponent
              handleClose={handleClose}
              onNetwork={onNetwork}
              handleEngage={handleEngage}
            />
          </div>
          <div className="d-block d-md-none">
            <MobileNotReady handleClose={handleClose} />
          </div>
        </div>
      </div>
    </Overlay>
  );
}

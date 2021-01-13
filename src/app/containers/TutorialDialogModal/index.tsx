// TUTORIALDIALOG CONTAINER
// Logic for if dialog should render

import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reactLocalStorage } from 'reactjs-localstorage';
import { actions } from 'app/containers/TutorialDialogModal/slice';
import { Sovryn } from 'utils/sovryn';
import { SHOW_MODAL } from 'utils/classifiers';
import { currentChainId } from 'utils/classifiers';
import { useInjectReducer } from 'utils/redux-injectors';
import { selectTutorialDialogModal } from './selectors';
import { TutorialDialogComponent } from './component';
import { reducer, sliceKey } from './slice';
import { MobileNotReady } from './mobileNotReady';

export function TutorialDialogModal() {
  //Check if previously connected, currently connected to RSK, currently wallet is connected, closed before
  useInjectReducer({ key: sliceKey, reducer: reducer });
  const state = useSelector(selectTutorialDialogModal);

  const dispatch = useDispatch();
  const onNetwork =
    window.ethereum && parseInt(window.ethereum.chainId) === currentChainId;

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
    const body = document.getElementsByTagName('body')[0];
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
            <MobileNotReady handleClose={handleClose} />
          </div>
        </div>
      )}
    </>
  );
}

import { Classes, Overlay } from '@blueprintjs/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { MainScreen } from './components/MainScreen';
import { TransakScreen } from './components/TransakScreen';
import { TransactionScreen } from './components/TransactionScreen';
import styles from './index.module.scss';
import { fastBtcDialogSaga } from './saga';
import { selectFastBtcDialog } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { Step } from './types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function FastBtcDialog(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcDialogSaga });

  const state = useSelector(selectFastBtcDialog);
  const dispatch = useDispatch();

  const handleOpening = useCallback(() => {
    dispatch(actions.init());
  }, [dispatch]);

  const handleClosing = useCallback(() => {
    dispatch(actions.reset());
  }, [dispatch]);

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      onOpening={() => handleOpening()}
      onClosing={() => handleClosing()}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div
          className={classNames(
            'custom-dialog tw-font-body',
            styles.dialogContainer,
          )}
        >
          <div className={styles.container}>
            <div className={styles.close} onClick={() => props.onClose()}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className={styles.innerContainer}>
              {[Step.MAIN, Step.WALLET, Step.FIAT, Step.TRANSAK].includes(
                state.step,
              ) && <MainScreen state={state} dispatch={dispatch} />}
              {state.step === Step.TRANSACTION && (
                <TransactionScreen
                  state={state}
                  dispatch={dispatch}
                  onClose={() => props.onClose()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

export function TransackDialog(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: fastBtcDialogSaga });

  const state = useSelector(selectFastBtcDialog);
  const dispatch = useDispatch();

  const handleOpening = useCallback(() => {
    dispatch(actions.selectFiat());
  }, [dispatch]);

  const handleClosing = useCallback(() => {
    dispatch(actions.reset());
  }, [dispatch]);

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      onOpening={() => handleOpening()}
      onClosing={() => handleClosing()}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div
          className={classNames(
            'custom-dialog tw-font-body',
            styles.dialogContainer,
          )}
        >
          <div className={styles.container}>
            <div className={styles.close} onClick={() => props.onClose()}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div className={styles.innerContainer}>
              <TransakScreen state={state} dispatch={dispatch} />
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

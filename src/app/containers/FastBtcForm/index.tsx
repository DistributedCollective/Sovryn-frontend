/**
 *
 * FastBtcForm
 *
 */

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Icon, Overlay, Classes, Button } from '@blueprintjs/core';
import classNames from 'classnames';

import { translations } from 'locales/i18n';
import { selectFastBtcForm } from './selectors';

import styles from './index.module.scss';

import { useAccount, useIsConnected } from '../../hooks/useAccount';
import logo from '../../../assets/images/sovryn-logo-white-inline.svg';
import { Screen1 } from './components/screen1';
import { Screen2 } from './components/screen2';
import { Screen3 } from './components/screen3';
import { actions } from './slice';

interface Props {
  isOpen?: boolean;
  canOutsideClickClose?: boolean;
  canEscapeKeyClose?: boolean;
  onClose?: (event: React.SyntheticEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
}

export function FastBtcForm(props: Props) {
  const isConnected = useIsConnected();
  const canInteract = false; // TODO: TEMP DISABLED
  const state = useSelector(selectFastBtcForm);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const address = useAccount();

  useEffect(() => {
    if (address !== state.receiverAddress) {
      dispatch(actions.resetAddresses());
    }
  }, [address, state.receiverAddress, dispatch]);

  useEffect(() => {
    if (!!state.depositAddress && state.step === 1) {
      dispatch(actions.changeStep(2));
    }
  }, [state.depositAddress, state.step, dispatch]);

  return (
    <Overlay
      isOpen={state.dialogOpen}
      onClose={() => dispatch(actions.showDialog(false))}
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      hasBackdrop={true}
      className={classNames(
        Classes.OVERLAY_SCROLL_CONTAINER,
        styles.topUpContainer,
      )}
    >
      <div className={classNames(Classes.DIALOG_CONTAINER)}>
        <div
          className={classNames(
            Classes.DIALOG,
            'tw-relative',
            state.step === 2 ? styles.topUpContainerExtend : '',
          )}
          style={props.style}
        >
          <Button
            aria-label="Close"
            className={classNames(Classes.DIALOG_CLOSE_BUTTON, 'tw-absolute')}
            style={{ top: 0, right: 0 }}
            icon={<Icon icon="cross" iconSize={Icon.SIZE_LARGE} />}
            minimal={true}
            onClick={() => dispatch(actions.showDialog(false))}
          />

          {!canInteract ? (
            <div className="tw-mt-4 tw-mb-6">
              <h3 className="tw-text-center tw-mb-4">
                {t(translations.fastBtcForm.title)}
              </h3>
              {t(translations.fastBtcForm.disabledText)}
            </div>
          ) : (
            <>
              {isConnected ? (
                <>
                  <div className="logo tw-text-center tw-mt-2 tw-mb-4">
                    <img src={logo} alt="" />
                  </div>
                  {state.step === 1 && (
                    <Screen1 state={state} dispatch={dispatch} />
                  )}
                  {state.step === 2 && (
                    <Screen2 state={state} dispatch={dispatch} />
                  )}
                  {state.step === 3 && (
                    <Screen3 state={state} dispatch={dispatch} />
                  )}
                </>
              ) : (
                <div className="tw-mt-4 tw-mb-6">
                  <h3 className="tw-text-center tw-mb-4">
                    {t(translations.fastBtcForm.title)}
                  </h3>
                  {t(translations.fastBtcForm.connectWallet)}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Overlay>
  );
}

FastBtcForm.defaultProps = {
  canOutsideClickClose: true,
  isOpen: false,
};

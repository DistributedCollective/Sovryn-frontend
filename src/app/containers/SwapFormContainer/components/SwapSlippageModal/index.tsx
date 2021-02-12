import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Classes, Overlay } from '@blueprintjs/core';
import { AmountField } from '../SwapAmountField';
import styles from './index.module.scss';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  minReceivedAmount: string;
  receivedToken: string;
}

export function SwapSlippageModal(props: Props) {
  const closing = useCallback(() => {}, []);

  return (
    <Overlay
      isOpen={props.isOpen}
      onClose={() => props.onClose()}
      onClosing={closing}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      hasBackdrop
      canOutsideClickClose
      canEscapeKeyClose
    >
      <div className="custom-dialog-container">
        <div
          className={`custom-dialog font-family-montserrat ${styles.swapConfirmDialog}`}
        >
          <div className={styles.container}>
            <h2 className={styles.title}>Adjust slippage</h2>
            <div className={styles.receivedAmountInputWrapper}>
              <p>Minimum Received:</p>
              <div className={styles.receivedAmountInput}>
                <AmountField
                  value={props.minReceivedAmount}
                  onChange={() => {}}
                  rightElement={
                    <div className="swap-form__amount-type">
                      {props.receivedToken}
                    </div>
                  }
                />
              </div>
            </div>
            <div className={styles.btnActionWrapper}>
              <button
                className={classNames(
                  'd-flex flex-row align-items-center justify-content-center',
                  styles.button,
                  styles.confirmButton,
                )}
                onClick={() => props.onConfirm()}
              >
                <span>Confirm</span>
              </button>
              <button
                className={classNames(
                  'd-flex flex-row align-items-center justify-content-center',
                  styles.button,
                  styles.cancelButton,
                )}
                onClick={props.onClose}
              >
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

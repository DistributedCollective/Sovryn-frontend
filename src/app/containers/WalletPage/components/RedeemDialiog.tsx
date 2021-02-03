import React from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import styles from './dialog.module.css';
import arrowDown from './arrow-down.svg';
import { FieldGroup } from '../../../components/FieldGroup';
import { DummyField } from '../../../components/DummyField';
import { weiToNumberFormat } from '../../../../utils/display-text/format';
import { Button } from '../../../components/Button';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

export function RedeemDialog(props: Props) {
  const btcAmount = bignumber(props.amount)
    .mul(1 / 40000)
    .toFixed(0);
  return (
    <>
      <Overlay
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        hasBackdrop
        canOutsideClickClose
        canEscapeKeyClose
      >
        <div className="custom-dialog-container">
          <div className="custom-dialog font-family-montserrat">
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <h2 className={styles.title}>Redeem rBTC</h2>
                <FieldGroup label="Genesis Pre-order allocation:">
                  <DummyField>
                    <div className="w-100 d-flex justify-content-between align-items-center position-relative">
                      <div className="w-100 flex-grow-1 text-center">
                        {weiToNumberFormat(props.amount)}
                      </div>
                      <div
                        className={classNames(
                          'flex-shrink-1 flex-grow-0 position-absolute',
                          styles.right,
                        )}
                      >
                        cSOV
                      </div>
                    </div>
                  </DummyField>
                </FieldGroup>
                <div className="mx-auto text-center">
                  <img
                    src={arrowDown}
                    alt="Arrow Down"
                    className={styles.arrowDown}
                  />
                </div>
                <FieldGroup label="Sovryn My Wallet:">
                  <DummyField>
                    <div className="w-100 d-flex justify-content-between align-items-center position-relative">
                      <div className="w-100 flex-grow-1 text-center">
                        {weiToNumberFormat(btcAmount, 8)}
                      </div>
                      <div
                        className={classNames(
                          'flex-shrink-1 flex-grow-0 position-absolute',
                          styles.right,
                        )}
                      >
                        SOV
                      </div>
                    </div>
                  </DummyField>
                </FieldGroup>
                <div className={styles.txFee}>Tx Fee: 0.0006 (r)BTC</div>
              </div>
              <div className="d-flex flex-row justify-content-between align-items-center">
                <Button text="Confirm" onClick={() => {}} className="mr-3" />
                <Button
                  text="Cancel"
                  inverted
                  onClick={() => props.onClose()}
                  className="ml-3"
                />
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
}

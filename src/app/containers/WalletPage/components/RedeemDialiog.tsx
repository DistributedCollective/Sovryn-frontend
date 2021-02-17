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
import { useSendContractTx } from '../../../hooks/useSendContractTx';
import { TxType } from '../../../../store/global/transactions-store/types';
import { SendTxProgress } from '../../../components/SendTxProgress';
import { useAccount } from '../../../hooks/useAccount';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { gasLimit } from '../../../../utils/classifiers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  amount: string;
}

export function RedeemDialog(props: Props) {
  const btcAmount = bignumber(props.amount)
    .mul(1 / 40000)
    .toFixed(0);
  const account = useAccount();
  const { value: processed, loading } = useCacheCallWithValue<boolean>(
    'vestingRegistry',
    'processedList',
    false,
    account,
  );
  const { send, ...tx } = useSendContractTx('vestingRegistry', 'reImburse');
  const handleSubmit = () =>
    send(
      [],
      { from: account, gas: gasLimit[TxType.SOV_REIMBURSE] },
      { type: TxType.SOV_REIMBURSE },
    );

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
                        {weiToNumberFormat(props.amount, 2)}
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
                        (r)BTC
                      </div>
                    </div>
                  </DummyField>
                </FieldGroup>
                <div className={styles.txFee}>Tx Fee: 0.000004 (r)BTC</div>

                {processed && (
                  <p className={styles.txFee}>Already processed!</p>
                )}
              </div>

              <SendTxProgress
                {...tx}
                type={TxType.SOV_REIMBURSE}
                displayAbsolute={false}
              />

              <div className="d-flex flex-row justify-content-between align-items-center">
                <Button
                  text="Confirm"
                  onClick={handleSubmit}
                  className="mr-3 w-100"
                  loading={tx.loading || loading}
                  disabled={tx.loading || loading || processed}
                />
                <Button
                  text="Cancel"
                  inverted
                  onClick={() => props.onClose()}
                  className="ml-3 w-100"
                />
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
}

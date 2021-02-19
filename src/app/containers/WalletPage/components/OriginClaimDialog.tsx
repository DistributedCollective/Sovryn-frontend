import React, { useCallback } from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';
import styles from './dialog.module.css';
import arrowDown from './arrow-down.svg';
import { FieldGroup } from '../../../components/FieldGroup';
import { DummyField } from '../../../components/DummyField';
import { Button } from '../../../components/Button';
import { useAccount } from '../../../hooks/useAccount';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { useSendContractTx } from '../../../hooks/useSendContractTx';
import {
  TxStatus,
  TxType,
} from '../../../../store/global/transactions-store/types';
import { SendTxProgress } from '../../../components/SendTxProgress';
import { toNumberFormat } from '../../../../utils/display-text/format';
import { bignumber } from 'mathjs';
import { LinkToExplorer } from '../../../components/LinkToExplorer';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function OriginClaimDialog(props: Props) {
  const account = useAccount();

  // todo retrieve real btc amount
  const btcAmount = 0.1e8;
  const sovAmount = bignumber(btcAmount).div(10000).toString();

  // todo: change with real contracts when ready
  const { value: processed, loading } = useCacheCallWithValue<boolean>(
    'vestingRegistry',
    'processedList',
    false,
    account,
  );
  // todo: change with real contracts when rady
  const { send, ...tx } = useSendContractTx(
    'vestingRegistry',
    'exchangeAllCSOV',
  );
  const handleSubmit = useCallback(() => {
    send([], { from: account }, { type: TxType.SOV_ORIGIN_CLAIM });
  }, [account, send]);

  const handleClosing = useCallback(() => {
    if (tx.status === TxStatus.CONFIRMED) {
      tx.reset();
    }
  }, [tx]);

  return (
    <>
      <Overlay
        isOpen={props.isOpen}
        onClose={() => props.onClose()}
        onClosing={() => handleClosing}
        className={Classes.OVERLAY_SCROLL_CONTAINER}
        hasBackdrop
        canOutsideClickClose
        canEscapeKeyClose
      >
        <div className="custom-dialog-container">
          <div className="custom-dialog font-family-montserrat">
            <div className={styles.container}>
              {tx.status === TxStatus.CONFIRMED ? (
                <>
                  <h2 className={styles.title}>Redemption Successful</h2>

                  <div className="mx-auto my-5 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="51.969"
                      height="51.969"
                      viewBox="0 0 51.969 51.969"
                    >
                      <path
                        id="Path_2993"
                        data-name="Path 2993"
                        d="M39.912,16.5,22.788,33.623l-9.329-9.3L9.8,27.985,22.788,40.977,43.576,20.189ZM27.985,2A25.985,25.985,0,1,0,53.969,27.985,25.994,25.994,0,0,0,27.985,2Zm0,46.772A20.788,20.788,0,1,1,48.772,27.985,20.782,20.782,0,0,1,27.985,48.772Z"
                        transform="translate(-2 -2)"
                        fill="#4ecdc4"
                      />
                    </svg>
                  </div>

                  <p className="text-center mb-4">
                    Please check your email for confirmation
                  </p>
                  <p className="text-center">
                    You will now be able to see your vested SOV
                    <br />
                    In the “My Wallet” section under “Vested Assets”
                  </p>

                  <p
                    className="font-weight-bold text-center mt-4 mx-auto"
                    style={{ maxWidth: 290 }}
                  >
                    Congratulations you are also now whitelisted for trading on
                    Sovryn
                  </p>

                  <div className="mt-5 d-flex align-items-center justify-content-center">
                    <div className="mr-4">Tx Hash:</div>
                    <LinkToExplorer txHash={tx.txHash} className="text-gold" />
                  </div>

                  <div className="mt-5 w-100 text-center">
                    <Button
                      text="Check SOV"
                      onClick={() => props.onClose()}
                      className="mx-auto"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.wrapper}>
                    <h2 className={styles.title}>Redeem Origins SOV</h2>
                    <p>This transaction requires rBTC for gas.</p>
                    <FieldGroup label="Origins BTC deposit:">
                      <DummyField>
                        <div className="w-100 d-flex justify-content-between align-items-center position-relative">
                          <div className="w-100 flex-grow-1 text-center">
                            {toNumberFormat(btcAmount / 1e8, 5)}
                          </div>
                          <div
                            className={classNames(
                              'flex-shrink-1 flex-grow-0 position-absolute',
                              styles.right,
                            )}
                          >
                            BTC
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
                    <FieldGroup
                      label={`SOV claimed at ${toNumberFormat(10000)} sats.`}
                    >
                      <DummyField>
                        <div className="w-100 d-flex justify-content-between align-items-center position-relative">
                          <div className="w-100 flex-grow-1 text-center">
                            {toNumberFormat(Number(sovAmount), 2)}
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

                    <div className={styles.txFee}>Tx Fee: 0.00016 (r)BTC</div>
                  </div>

                  <SendTxProgress
                    {...tx}
                    type={TxType.SOV_REIMBURSE}
                    displayAbsolute={false}
                  />

                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <Button
                      text="Confirm"
                      onClick={() => handleSubmit()}
                      className="mr-3 w-100"
                      loading={tx.loading || loading}
                      disabled={
                        tx.loading ||
                        [TxStatus.PENDING_FOR_USER, TxStatus.PENDING].includes(
                          tx.status,
                        ) ||
                        loading ||
                        processed
                      }
                    />
                    <Button
                      text="Cancel"
                      inverted
                      onClick={() => props.onClose()}
                      className="ml-3 w-100"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
}

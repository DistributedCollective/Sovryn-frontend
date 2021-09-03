import React, { useCallback } from 'react';
import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';
import { bignumber } from 'mathjs';
import styles from './dialog.module.scss';
import arrowDown from './arrow-down.svg';
import { FieldGroup } from '../../../components/FieldGroup';
import { DummyField } from '../../../components/DummyField';
import { Button, ButtonSize, ButtonStyle } from '../../../components/Button';
import { useAccount } from '../../../hooks/useAccount';
import { useCacheCallWithValue } from '../../../hooks/useCacheCallWithValue';
import { useSendContractTx } from '../../../hooks/useSendContractTx';
import {
  TxStatus,
  TxType,
} from '../../../../store/global/transactions-store/types';
import { SendTxProgress } from '../../../components/SendTxProgress';
import {
  toNumberFormat,
  weiToNumberFormat,
} from '../../../../utils/display-text/format';
import { LinkToExplorer } from '../../../components/LinkToExplorer';

const pricePerSov = 9736;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function OriginClaimDialog(props: Props) {
  const account = useAccount();

  const { value: sovAmount, loading } = useCacheCallWithValue<string>(
    'OriginInvestorsClaim',
    'investorsAmountsList',
    '0',
    account,
  );

  const btcAmount = bignumber(sovAmount).div(1e18).mul(pricePerSov).toString();

  const { send, ...tx } = useSendContractTx('OriginInvestorsClaim', 'claim');
  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send([], { from: account }, { type: TxType.SOV_ORIGIN_CLAIM });
    }
  }, [account, send, tx]);

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
          <div className="custom-dialog tw-font-body">
            <div className={styles.container}>
              {tx.status === TxStatus.CONFIRMED ? (
                <>
                  <h2 className={styles.title}>Redemption Successful</h2>

                  <div className="tw-mx-auto tw-my-12 tw-text-center tw-text-long">
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
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <p className="tw-text-center">
                    You will now be able to see your vested SOV
                    <br />
                    in our{' '}
                    <a
                      href="https://bitocracy.sovryn.app/stake"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      staking
                    </a>{' '}
                    page.
                  </p>

                  <p
                    className="tw-font-bold tw-text-center tw-mt-8 tw-mx-auto"
                    style={{ maxWidth: 290 }}
                  >
                    Congratulations you are also now owner of SOV!
                  </p>

                  <div className="tw-mt-12 tw-flex tw-items-center tw-justify-center">
                    <div className="tw-mr-8">Tx Hash:</div>
                    <LinkToExplorer
                      txHash={tx.txHash}
                      className="tw-text-primary"
                    />
                  </div>

                  <div className="tw-mt-12 tw-w-full tw-text-center">
                    <Button
                      text="Check SOV"
                      className="tw-mx-auto"
                      size={ButtonSize.lg}
                      onClick={() => props.onClose()}
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
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                          <div className="tw-w-full tw-flex-grow tw-text-center">
                            {toNumberFormat(Number(btcAmount) / 1e8, 5)}
                          </div>
                          <div
                            className={classNames(
                              'tw-flex-shrink tw-flex-grow-0 tw-absolute',
                              styles.right,
                            )}
                          >
                            BTC
                          </div>
                        </div>
                      </DummyField>
                    </FieldGroup>
                    <div className="tw-mx-auto tw-text-center">
                      <img
                        src={arrowDown}
                        alt="Arrow Down"
                        className={styles.arrowDown}
                      />
                    </div>
                    <FieldGroup
                      label={`SOV claimed at ${toNumberFormat(
                        pricePerSov,
                      )} sats.`}
                    >
                      <DummyField>
                        <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                          <div className="tw-w-full tw-flex-grow tw-text-center">
                            {weiToNumberFormat(sovAmount, 2)}
                          </div>
                          <div
                            className={classNames(
                              'tw-flex-shrink tw-flex-grow tw-absolute',
                              styles.right,
                            )}
                          >
                            SOV
                          </div>
                        </div>
                      </DummyField>
                    </FieldGroup>
                    <div className={styles.txFee}>Tx Fee: 0.0001 (r)BTC</div>
                  </div>

                  <SendTxProgress
                    {...tx}
                    type={TxType.SOV_REIMBURSE}
                    displayAbsolute={false}
                  />

                  <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
                    <Button
                      text="Confirm"
                      className="tw-mr-4 tw-w-full"
                      size={ButtonSize.lg}
                      loading={tx.loading || loading}
                      disabled={
                        tx.loading ||
                        [TxStatus.PENDING_FOR_USER, TxStatus.PENDING].includes(
                          tx.status,
                        ) ||
                        loading ||
                        !Number(sovAmount)
                      }
                      onClick={() => handleSubmit()}
                    />
                    <Button
                      text="Cancel"
                      className="tw-ml-4 tw-w-full"
                      size={ButtonSize.lg}
                      style={ButtonStyle.inverted}
                      onClick={() => props.onClose()}
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

import React, { useCallback, useState } from 'react';
import { useGetUnlockedVesting } from '../../hooks/staking/useGetUnlockedVesting';
import { Classes, Overlay } from '@blueprintjs/core';
import VestingAbi from 'utils/blockchain/abi/Vesting.json';
import styles from '../../containers/WalletPage/components/dialog.module.css';
import { TxType } from '../../../store/global/transactions-store/types';
import { Button } from '../Button';
import { FieldGroup } from '../FieldGroup';
import { DummyField } from '../DummyField';
import classNames from 'classnames';
import arrowDown from '../../containers/WalletPage/components/arrow-down.svg';
import { SendTxProgress } from '../SendTxProgress';
import { useAccount } from '../../hooks/useAccount';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import { InputField } from '../InputField';
import { useSendToContractAddressTx } from '../../hooks/useSendToContractAddressTx';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../locales/i18n';

interface Props {
  address: string;
  isOpen: boolean;
  onClose: () => void;
}

export function VestingDialog(props: Props) {
  const { t } = useTranslation();
  const account = useAccount();
  const { value, loading } = useGetUnlockedVesting(props.address);
  const [address, setAddress] = useState(account);

  const { send, ...tx } = useSendToContractAddressTx(
    props.address,
    VestingAbi as any,
    'withdrawTokens',
  );
  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send([address], { from: account }, { type: TxType.SOV_WITHDRAW_VESTING });
    }
  }, [account, address, send, tx]);

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
                <h2 className={styles.title}>
                  {t(translations.vestingDialog.title)}
                </h2>
                <p>{t(translations.vestingDialog.subtitle)}</p>
                <FieldGroup label={t(translations.vestingDialog.amount)}>
                  <DummyField>
                    <div className="w-100 d-flex justify-content-between align-items-center position-relative">
                      <div className="w-100 flex-grow-1 text-center">
                        {loading
                          ? t(translations.vestingDialog.calculating)
                          : weiTo4(value)}
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
                <div className="mx-auto text-center">
                  <img
                    src={arrowDown}
                    alt="Arrow Down"
                    className={styles.arrowDown}
                  />
                </div>
                <FieldGroup label={t(translations.vestingDialog.receiver)}>
                  <InputField
                    onChange={value => setAddress(value)}
                    value={address}
                  />
                </FieldGroup>
                <div className={styles.txFee}>
                  {t(translations.common.fee, { amount: '0.000014' })}
                </div>
              </div>

              <SendTxProgress
                {...tx}
                type={TxType.SOV_REIMBURSE}
                displayAbsolute={false}
              />

              <div className="d-flex flex-row justify-content-between align-items-center">
                <Button
                  text={t(translations.common.confirm)}
                  onClick={() => handleSubmit()}
                  className="mr-3 w-100"
                  loading={tx.loading}
                  disabled={value === '0'}
                />
                <Button
                  text={t(translations.common.cancel)}
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

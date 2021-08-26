import { Classes, Overlay } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import VestingAbi from 'utils/blockchain/abi/Vesting.json';
import { AbiItem } from 'web3-utils';

import { translations } from '../../../locales/i18n';
import { TxType } from '../../../store/global/transactions-store/types';
import { weiTo4 } from '../../../utils/blockchain/math-helpers';
import arrowDown from '../../containers/WalletPage/components/arrow-down.svg';
import styles from '../../containers/WalletPage/components/dialog.module.css';
import { useGetUnlockedVesting } from '../../hooks/staking/useGetUnlockedVesting';
import { useAccount } from '../../hooks/useAccount';
import { useSendToContractAddressTx } from '../../hooks/useSendToContractAddressTx';
import { Button } from '../Button';
import { DummyField } from '../DummyField';
import { FieldGroup } from '../FieldGroup';
import { InputField } from '../InputField';
import { SendTxProgress } from '../SendTxProgress';

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
    VestingAbi as AbiItem[],
    'withdrawTokens',
  );
  const handleSubmit = useCallback(() => {
    if (!tx.loading) {
      send(
        [address.toLowerCase()],
        { from: account },
        { type: TxType.SOV_WITHDRAW_VESTING },
      );
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
          <div className="custom-dialog tw-font-body">
            <div className={styles.container}>
              <div className={styles.wrapper}>
                <h2 className={styles.title}>
                  {t(translations.vestingDialog.title)}
                </h2>
                <p>{t(translations.vestingDialog.subtitle)}</p>
                <FieldGroup label={t(translations.vestingDialog.amount)}>
                  <DummyField>
                    <div className="tw-w-full tw-flex tw-justify-between tw-items-center tw-relative">
                      <div className="tw-w-full tw-flex-grow tw-text-center">
                        {loading
                          ? t(translations.vestingDialog.calculating)
                          : weiTo4(value)}
                      </div>
                      <div
                        className={classNames(
                          'tw-flex-shrink tw-flex-grow-0 tw-absolute',
                          styles.right,
                        )}
                      >
                        SOV
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
                <FieldGroup label={t(translations.vestingDialog.receiver)}>
                  <InputField
                    onChange={event => setAddress(event.target.value)}
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

              <div className="tw-flex tw-flex-row tw-justify-between tw-items-center">
                <Button
                  text={t(translations.common.confirm)}
                  onClick={() => handleSubmit()}
                  className={`tw-mr-4 tw-w-full ${
                    value === '0' ||
                    (tx.loading && `tw-opacity-25 tw-cursor-not-allowed`)
                  }`}
                  loading={tx.loading}
                  disabled={value === '0' || tx.loading}
                />
                <Button
                  text={t(translations.common.cancel)}
                  inverted
                  onClick={() => props.onClose()}
                  className="tw-ml-4 tw-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    </>
  );
}

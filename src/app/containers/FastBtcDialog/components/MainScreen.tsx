import { WalletContext } from '@sovryn/react-wallet';
import { isWeb3Wallet } from '@sovryn/wallet';
import React, { Dispatch, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../../locales/i18n';
import { currentChainId } from '../../../../utils/classifiers';
import { AddressQrCode, URIType } from '../../../components/Form/AddressQrCode';
import styles from '../index.module.scss';
import { actions } from '../slice';
import { FastBtcDialogState, Step } from '../types';
import { BTCButton } from './BTCButton';
import { FiatDialogScreen } from './FiatDialogScreen';
import { OpenTransak } from './transak';
import classNames from 'classnames';

interface MainScreenProps {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
}

export function MainScreen({ state, dispatch }: MainScreenProps) {
  const { t } = useTranslation();
  const { connected, wallet } = useContext(WalletContext);

  const isWrongChainId = useMemo(() => {
    return (
      connected &&
      isWeb3Wallet(wallet.providerType!) &&
      wallet.chainId !== currentChainId
    );
  }, [connected, wallet.chainId, wallet.providerType]);

  return (
    <>
      <h2 className={styles.title}>{t(translations.fastBtcDialog.title)}</h2>
      <div className={styles.subtitle}>
        {t(translations.fastBtcDialog.subtitle)}
      </div>

      <div className="tw-flex">
        <div className="tw-w-1/2">
          <div>
            <div className={styles.limitsTitle}>
              {t(translations.fastBtcDialog.limits.title)}
            </div>
            <div className={styles.limitsValue}>
              •{' '}
              {t(translations.fastBtcDialog.limits.min, {
                amount: parseFloat(state.limits.min.toFixed(4)),
              })}{' '}
              {t(translations.fastBtcDialog.limits.btc)}
            </div>
            <div className={styles.limitsValue}>
              •{' '}
              {t(translations.fastBtcDialog.limits.max, {
                amount: parseFloat(state.limits.max.toFixed(4)),
              })}{' '}
              {t(translations.fastBtcDialog.limits.btc)}
            </div>
          </div>

          <div>
            <div className={styles.instructionsTitle}>
              {t(translations.fastBtcDialog.instructions.title)}
            </div>
            <div className={styles.instructionsValue}>
              • {t(translations.fastBtcDialog.instructions.point1)}
              <br />• {t(translations.fastBtcDialog.instructions.point2)}
              <br />• {t(translations.fastBtcDialog.instructions.point3)}
              <br />• {t(translations.fastBtcDialog.instructions.point4)}{' '}
              <a
                href="https://sovryn.freshdesk.com/support/tickets/new"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.supportLink}
              >
                {t(translations.fastBtcDialog.instructions.point4LinkText)}
              </a>
            </div>
          </div>
        </div>

        <div
          className={classNames(
            'tw-w-1/2',
            state.step === Step.MAIN &&
              'tw-flex tw-items-center tw-justify-end',
          )}
        >
          {state.step === Step.WALLET && (
            <AddressQrCode
              uri={URIType.BITCOIN}
              address={state.deposit.address}
            />
          )}
          {state.step === Step.TRANSAK && (
            <OpenTransak
              address={state.deposit.address}
              onClose={() => dispatch(actions.reset())}
            />
          )}
          {state.step === Step.FIAT && (
            <FiatDialogScreen
              state={state}
              address={state.deposit.address}
              dispatch={dispatch}
            />
          )}

          {isWrongChainId && (
            <p className="tw-text-center">
              {t(translations.fastBtcDialog.instructions.chainId)}
            </p>
          )}

          <div className={styles.buttons}>
            {state.step === Step.MAIN && (
              <BTCButton
                loading={state.deposit.loading}
                ready={state.ready}
                disabled={isWrongChainId}
                onClick={() => {
                  dispatch(actions.generateDepositAddress());
                  dispatch(actions.selectBTC());
                }}
              />
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer}>{t(translations.fastBtcDialog.note)}</div>
    </>
  );
}

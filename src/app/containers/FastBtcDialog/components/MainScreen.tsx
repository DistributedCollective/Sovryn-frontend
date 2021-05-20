import { useWalletContext } from '@sovryn/react-wallet';
import { web3Wallets } from '@sovryn/wallet';
import React, { Dispatch, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { translations } from '../../../../locales/i18n';
import { currentChainId } from '../../../../utils/classifiers';
import { AddressQrCode, URIType } from '../../../components/Form/AddressQrCode';
import styles from '../index.module.css';
import { actions } from '../slice';
import { FastBtcDialogState, Step } from '../types';
import { BTCButton } from './BTCButton';
import { FiatDialogScreen } from './FiatDialogScreen';
import { OpenTransak } from './transak';

interface MainScreenProps {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
}

export function MainScreen({ state, dispatch }: MainScreenProps) {
  const { t } = useTranslation();
  const { connected, wallet } = useWalletContext();

  const isWrongChainId = useMemo(() => {
    return (
      connected &&
      web3Wallets.includes(wallet.providerType) &&
      wallet.chainId !== currentChainId
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <div>
                •{' '}
                {t(translations.fastBtcDialog.limits.min, {
                  amount: parseFloat(state.limits.min.toFixed(4)),
                })}{' '}
              </div>
              <div> {t(translations.fastBtcDialog.limits.btc)} </div>
            </div>
            <div className={styles.limitsValue}>
              <div>
                •{' '}
                {t(translations.fastBtcDialog.limits.max, {
                  amount: parseFloat(state.limits.max.toFixed(4)),
                })}{' '}
              </div>
              <div>{t(translations.fastBtcDialog.limits.btc)} </div>
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
              >
                {t(translations.fastBtcDialog.instructions.point4LinkText)}
              </a>
            </div>
          </div>
        </div>

        <div className="tw-w-1/2 tw-flex tw-items-center tw-justify-center">
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
            <p className="text-center">
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
            {/*{state.step === Step.MAIN && (*/}
            {/*  <FiatButton*/}
            {/*    loading={state.deposit.loading}*/}
            {/*    ready={state.ready}*/}
            {/*    onClick={() => {*/}
            {/*      dispatch(actions.generateDepositAddress());*/}
            {/*      dispatch(actions.selectFiat());*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </>
  );
}

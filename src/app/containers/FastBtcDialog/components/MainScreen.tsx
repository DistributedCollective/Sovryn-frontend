import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FastBtcDialogState, Step } from '../types';
import { actions } from '../slice';
import styles from '../index.module.css';
import { translations } from '../../../../locales/i18n';
import { BTCButton } from './BTCButton';
import { FiatButton } from './FiatButton';
import { AddressQrCode } from '../../../components/Form/AddressQrCode';
import { FiatDialogScreen } from './FiatDialogScreen';
import { OpenTransak } from './transak';

interface MainScreenProps {
  state: FastBtcDialogState;
  dispatch: Dispatch<any>;
}

export function MainScreen({ state, dispatch }: MainScreenProps) {
  const { t } = useTranslation();
  return (
    <>
      <h2 className={styles.title}>{t(translations.fastBtcDialog.title)}</h2>
      <div className={styles.subtitle}>
        {t(translations.fastBtcDialog.subtitle)}
      </div>

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
        </div>
      </div>

      {state.step === Step.WALLET && (
        <AddressQrCode address={state.deposit.address} />
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
      <div className={styles.buttons}>
        {state.step === Step.MAIN && (
          <BTCButton
            loading={state.deposit.loading}
            ready={state.ready}
            onClick={() => {
              dispatch(actions.generateDepositAddress());
              dispatch(actions.selectBTC());
            }}
          />
        )}
        {state.step === Step.MAIN && (
          <FiatButton
            loading={state.deposit.loading}
            ready={state.ready}
            onClick={() => {
              dispatch(actions.generateDepositAddress());
              dispatch(actions.selectFiat());
            }}
          />
        )}
      </div>
    </>
  );
}

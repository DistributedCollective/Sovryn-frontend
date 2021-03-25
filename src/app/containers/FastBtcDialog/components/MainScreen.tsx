import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FastBtcDialogState, Step } from '../types';
import { actions } from '../slice';
import styles from '../index.module.css';
import { translations } from '../../../../locales/i18n';
import { AddressButton } from './AddressButton';
import { AddressQrCode } from '../../../components/Form/AddressQrCode';

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
      {state.step === Step.MAIN && (
        <AddressButton
          loading={state.deposit.loading}
          ready={state.ready}
          onClick={() => dispatch(actions.generateDepositAddress())}
        />
      )}
    </>
  );
}

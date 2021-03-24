import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FastBtcDialogState } from '../types';
import { translations } from 'locales/i18n';
import { actions } from '../slice';
import styles from './transaction.module.css';
import { FiatButton } from './FiatButton';

interface Props {
  state: FastBtcDialogState;
  address: string;
  dispatch: Dispatch<any>;
}

export function FiatDialogScreen({ address, dispatch }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.txData && 'mb-2'}>
        <div className={styles.instructionsTitle}>
          {t(translations.fastBtcDialog.fiatDialog.title)}
        </div>
        <div className="mt-2">
          {t(translations.fastBtcDialog.fiatDialog.explanation)}
        </div>
        <div className="mt-2">
          <div>
            <strong>{t(translations.fastBtcDialog.transaction.address)}</strong>{' '}
            {address}
          </div>
        </div>
      </div>
      <div>
        <FiatButton
          loading={false}
          ready={true}
          onClick={() => dispatch(actions.openFiatOnRamp())}
        />
      </div>
    </>
  );
}

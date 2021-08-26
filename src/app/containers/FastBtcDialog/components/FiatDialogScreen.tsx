import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FastBtcDialogState } from '../types';
import { translations } from 'locales/i18n';
import { actions } from '../slice';
import styles from './transaction.module.scss';
import { FiatButton } from './FiatButton';

interface Props {
  state: FastBtcDialogState;
  address: string;
  dispatch: Dispatch<any>;
}

export function FiatDialogScreen({ state, address, dispatch }: Props) {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.txData && 'tw-mb-2'}>
        <div className={styles.instructionsTitle}>
          {t(translations.fastBtcDialog.fiatDialog.title)}
        </div>
        <div className="tw-mt-2">
          {t(translations.fastBtcDialog.fiatDialog.explanation1, {
            amount: parseFloat(state.limits.max.toFixed(4)),
          })}
        </div>
        <div className="tw-mt-2">
          <div>
            <strong>{t(translations.fastBtcDialog.transaction.address)}</strong>{' '}
            {address}
          </div>
        </div>
      </div>
      <div className="tw-mt-8">
        <FiatButton
          loading={false}
          ready={true}
          onClick={() => {
            dispatch(actions.generateFiatDepositAddress());
          }}
        />
      </div>
    </>
  );
}

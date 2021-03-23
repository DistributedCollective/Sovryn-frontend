import React, { Dispatch } from 'react';
import { useTranslation } from 'react-i18next';
import { FastBtcDialogState, Step } from '../types';
import { translations } from 'locales/i18n';
import { actions } from '../slice';
import styles from './transaction.module.css';
import { prettyTx } from '../../../../utils/helpers';
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
      <div className={styles.txData}>
        <div className="px-1">
          <div>
            <strong>{t(translations.fastBtcDialog.transaction.from)}</strong>{' '}
            {prettyTx(address)}
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

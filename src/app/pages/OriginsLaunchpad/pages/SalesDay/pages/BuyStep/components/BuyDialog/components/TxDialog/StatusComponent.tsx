import React from 'react';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import classNames from 'classnames';
import styles from './dialog.module.scss';

const getStatusImage = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
};

const getStatus = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED)
    return <Trans i18nKey={translations.common.failed} />;
  if (tx === TxStatus.CONFIRMED)
    return <Trans i18nKey={translations.common.confirmed} />;
  return <Trans i18nKey={translations.common.pending} />;
};

interface IStatusComponentProps {
  status: TxStatus;
}

export const StatusComponent: React.FC<IStatusComponentProps> = ({
  status,
}) => (
  <div className="tw-text-center tw-mx-auto tw-my-8">
    <img
      src={getStatusImage(status)}
      className={classNames(
        'tw-max-w-full',
        'tw-mx-auto',
        styles.statusImage,
        status === TxStatus.PENDING && 'tw-animate-spin',
      )}
      alt="Status"
    />
    <p className="tw-text-base tw-tracking-normal tw-italic tw-mt-4">
      {getStatus(status)}
    </p>
  </div>
);

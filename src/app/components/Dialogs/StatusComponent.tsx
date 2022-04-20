import React from 'react';
import classNames from 'classnames';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import { TxStatus } from '../../../store/global/transactions-store/types';

const getStatusImage = (tx: TxStatus) => {
  switch (tx) {
    case TxStatus.FAILED:
      return txFailed;
    case TxStatus.CONFIRMED:
      return txConfirm;
    default:
      return txPending;
  }
};

const getStatus = (tx: TxStatus) => {
  switch (tx) {
    case TxStatus.FAILED:
      return <Trans i18nKey={translations.common.failed} />;
    case TxStatus.CONFIRMED:
      return <Trans i18nKey={translations.common.confirmed} />;
    default:
      return <Trans i18nKey={translations.common.pending} />;
  }
};

type StatusComponentProps = {
  status: TxStatus;
  className?: string;
  isInline?: boolean;
  showLabel?: boolean;
};

export const StatusComponent: React.FC<StatusComponentProps> = ({
  status,
  className,
  isInline,
  showLabel,
}) => (
  <div
    className={classNames(
      isInline
        ? 'tw-inline-flex tw-flex-row tw-max-h-full'
        : 'tw-w-24 tw-mx-auto tw-mb-8 tw-text-center',
      className,
    )}
  >
    <img
      src={getStatusImage(status)}
      className={classNames(
        isInline ? 'tw-h-auto flex-initial' : 'tw-h-24 tw-w-24',
        isInline && showLabel && 'tw-mr-2',
        status === TxStatus.PENDING && 'tw-animate-spin',
      )}
      alt="Status"
    />
    {showLabel && (
      <p className={!isInline ? 'tw-text-base tw-font-medium' : ''}>
        {getStatus(status)}
      </p>
    )}
  </div>
);

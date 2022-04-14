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
  onlyImage?: boolean;
};

export const StatusComponent: React.FC<StatusComponentProps> = ({
  status,
  onlyImage = false,
}) => (
  <div className="tw-mx-auto tw-text-center tw-w-24">
    <img
      src={getStatusImage(status)}
      className={classNames('tw-w-14 tw-h-14 tw-mx-auto', {
        'tw-animate-spin': status === TxStatus.PENDING,
      })}
      alt="Status"
    />
    {!onlyImage && (
      <p className="tw-text-base tw-font-medium">{getStatus(status)}</p>
    )}
  </div>
);

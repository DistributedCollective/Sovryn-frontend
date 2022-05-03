import React from 'react';
import txFailed from 'assets/images/failed-tx.svg';
import txConfirm from 'assets/images/confirm-tx.svg';
import txPending from 'assets/images/pending-tx.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import { Trans } from 'react-i18next';
import { translations } from 'locales/i18n';
import { StatusImage } from './styled';
import classNames from 'classnames';

const getStatusImage = (tx: TxStatus) => {
  if (tx === TxStatus.FAILED) return txFailed;
  if (tx === TxStatus.CONFIRMED) return txConfirm;
  return txPending;
};

interface IStatusProps {
  txStatus: TxStatus;
}

export const Status: React.FC<IStatusProps> = ({ txStatus }) => (
  <div className="tw-flex tw-flex-col tw-items-center tw-mx-auto tw-my-9">
    <StatusImage
      src={getStatusImage(txStatus)}
      className={classNames(
        'tw-max-w-full',
        txStatus === TxStatus.PENDING && 'tw-animate-spin',
      )}
      alt="Status"
    />
    <p className="tw-text-base tw-tracking-normal tw-italic tw-mt-4">
      {txStatus === TxStatus.PENDING && (
        <Trans
          i18nKey={
            translations.userAssets.convertDialog.txDialog.statusInProgress
          }
        />
      )}
    </p>
  </div>
);

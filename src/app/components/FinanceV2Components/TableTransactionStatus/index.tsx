import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../../locales/i18n';
import iconSuccess from '../../../../assets/images/icon-success.svg';
import iconRejected from '../../../../assets/images/icon-rejected.svg';
import iconPending from '../../../../assets/images/icon-pending.svg';
import { TxStatus } from 'store/global/transactions-store/types';
import classNames from 'classnames';

interface ITableTransactionStatusProps {
  transactionStatus: TxStatus;
  wrapperClassName?: string;
  textClassName?: string;
  iconClassName?: string;
}

export const TableTransactionStatus: React.FC<ITableTransactionStatusProps> = ({
  iconClassName,
  textClassName,
  transactionStatus,
  wrapperClassName,
}) => {
  const { t } = useTranslation();

  const text = useMemo(() => {
    switch (transactionStatus) {
      case TxStatus.FAILED:
        return t(translations.common.failed);
      case TxStatus.PENDING:
        return t(translations.common.pending);
      default:
        return t(translations.common.confirmed);
    }
  }, [t, transactionStatus]);

  const icon = useMemo(() => {
    switch (transactionStatus) {
      case TxStatus.FAILED:
        return (
          <img
            src={iconRejected}
            title={t(translations.common.failed)}
            alt={t(translations.common.failed)}
          />
        );
      case TxStatus.PENDING:
        return (
          <img
            src={iconPending}
            title={t(translations.common.pending)}
            alt={t(translations.common.pending)}
          />
        );
      default:
        return (
          <img
            src={iconSuccess}
            title={t(translations.common.failed)}
            alt={t(translations.common.failed)}
          />
        );
    }
  }, [t, transactionStatus]);

  return (
    <div
      className={classNames(
        'tw-flex tw-items-center tw-justify-start tw-gap-4 md:tw-w-full tw-p-0',
        wrapperClassName,
      )}
    >
      <div>
        <p className={classNames('tw-m-0 tw-text-xs', textClassName)}>{text}</p>
      </div>
      <div className={iconClassName}>{icon}</div>
    </div>
  );
};

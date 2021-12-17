import { translations } from 'locales/i18n';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectTransactions } from 'store/global/transactions-store/selectors';
import { TxStatus } from 'store/global/transactions-store/types';
import { ToastsContext } from '../../contexts/ToastsContext';
import { selectPerpetualPage } from '../../selectors';
import { PerpetualPageModals } from '../../types';
import { CustomToastContent, toastOptions } from '../CustomToastContent';
import { ToastAdditionalInfo } from './components/ToastAdditionalInfo.tsx';

export const ToastsWatcher: React.FC = () => {
  const [processedToasts, setProcessedToasts] = useState<string[]>([]);
  const transactionsMap = useSelector(selectTransactions);

  const { modal } = useSelector(selectPerpetualPage);
  const hasNoOpenModal = useMemo(() => modal === PerpetualPageModals.NONE, [
    modal,
  ]);

  const { t } = useTranslation();

  const { toastTransactions } = useContext(ToastsContext);

  useEffect(() => {
    const txToProcess = toastTransactions.filter(
      item => !processedToasts.includes(item.tx!),
    );

    if (txToProcess.length > 0) {
      const transaction = transactionsMap[txToProcess[0].tx!];

      if (transaction.status === TxStatus.CONFIRMED) {
        if (hasNoOpenModal) {
          toast.success(
            ({ toastProps }) => (
              <CustomToastContent
                toastProps={toastProps}
                mainInfo={t(translations.perpetualPage.toasts.orderComplete)}
                additionalInfo={
                  <ToastAdditionalInfo transaction={txToProcess[0]} />
                }
              />
            ),
            toastOptions,
          );
        }

        setProcessedToasts(prevState => [...prevState, txToProcess[0].tx!]);
      }

      if (transaction.status === TxStatus.FAILED) {
        if (hasNoOpenModal) {
          toast.error(
            ({ toastProps }) => (
              <CustomToastContent
                toastProps={toastProps}
                mainInfo={t(translations.perpetualPage.toasts.orderFailed)}
                additionalInfo={
                  <ToastAdditionalInfo transaction={txToProcess[0]} />
                }
              />
            ),
            toastOptions,
          );
        }

        setProcessedToasts(prevState => [...prevState, txToProcess[0].tx!]);
      }
    }
  }, [hasNoOpenModal, processedToasts, t, toastTransactions, transactionsMap]);

  return <></>;
};

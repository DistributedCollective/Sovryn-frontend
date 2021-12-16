import { translations } from 'locales/i18n';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectTransactions } from 'store/global/transactions-store/selectors';
import { TxStatus } from 'store/global/transactions-store/types';
import { ToastsContext } from '../../contexts/ToastsContext';
import { CustomToastContent, toastOptions } from '../CustomToastContent';
import { ToastSuccessAdditionalInfo } from './components/ToastSuccessAdditionalInfo.tsx';

export const ToastsWatcher: React.FC = () => {
  const [processedToasts, setProcessedToasts] = useState<string[]>([]);
  const transactionsMap = useSelector(selectTransactions);

  const { t } = useTranslation();

  const { toastTransactions } = useContext(ToastsContext);

  useEffect(() => {
    const txToProcess = toastTransactions.filter(
      item => !processedToasts.includes(item.tx!),
    );

    if (txToProcess.length > 0) {
      const transaction = transactionsMap[txToProcess[0].tx!];

      if (transaction.status === TxStatus.CONFIRMED) {
        toast.success(
          ({ toastProps }) => (
            <CustomToastContent
              toastProps={toastProps}
              mainInfo={t(translations.perpetualPage.toasts.orderComplete)}
              additionalInfo={
                <ToastSuccessAdditionalInfo transaction={txToProcess[0]} />
              }
            />
          ),
          toastOptions,
        );

        setProcessedToasts(prevState => [...prevState, txToProcess[0].tx!]);
      }

      if (transaction.status === TxStatus.FAILED) {
        // TODO: Add error toasts for all of the possible situations (and create a new component for additional info, e.g. ToastErrorAdditionalInfo)
        // toast.error(
        //   ({ toastProps }) => (
        //     <CustomToastContent
        //       toastProps={toastProps}
        //       mainInfo={t(translations.perpetualPage.toasts.orderComplete)}
        //       additionalInfo={
        //         <ToastAdditionalInfo transaction={txToProcess[0]} />
        //       }
        //     />
        //   ),
        //   toastOptions,
        // );

        setProcessedToasts(prevState => [...prevState, txToProcess[0].tx!]);
      }
    }
  }, [processedToasts, t, toastTransactions, transactionsMap]);

  return <></>;
};

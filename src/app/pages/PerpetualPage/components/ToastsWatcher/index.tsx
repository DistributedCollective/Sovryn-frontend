import { translations } from 'locales/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { TxStatus } from 'store/global/transactions-store/types';
import { selectPerpetualPage } from '../../selectors';
import { PerpetualPageModals } from '../../types';
import { CustomToastContent, toastOptions } from '../CustomToastContent';
import { ToastAdditionalInfo } from './components/ToastAdditionalInfo.tsx';
import { isPerpetualTx } from '../TradeDialog/types';
import { usePerpetual_completedTransactions } from '../../hooks/usePerpetual_completedTransactions';

export const ToastsWatcher: React.FC = () => {
  const [toastedTransactions, setToastedTransactions] = useState({});
  const transactions = usePerpetual_completedTransactions();

  const { modal } = useSelector(selectPerpetualPage);

  const { t } = useTranslation();

  useEffect(() => {
    const toastTransactions = Object.values(transactions).filter(
      transaction => !toastedTransactions[transaction.transactionHash],
    );

    for (let transaction of toastTransactions) {
      if (!isPerpetualTx(transaction.customData)) {
        continue;
      }

      const perpetualTx = transaction.customData;

      if (modal !== PerpetualPageModals.TRADE_REVIEW) {
        if (transaction.status === TxStatus.CONFIRMED) {
          toast.success(
            ({ toastProps }) => (
              <CustomToastContent
                toastProps={toastProps}
                mainInfo={t(translations.perpetualPage.toasts.orderComplete)}
                additionalInfo={
                  <ToastAdditionalInfo
                    transaction={transaction}
                    perpetualTx={perpetualTx}
                  />
                }
              />
            ),
            toastOptions,
          );
        } else if (transaction.status === TxStatus.FAILED) {
          toast.error(
            ({ toastProps }) => (
              <CustomToastContent
                toastProps={toastProps}
                mainInfo={t(translations.perpetualPage.toasts.orderFailed)}
                additionalInfo={
                  <ToastAdditionalInfo
                    transaction={transaction}
                    perpetualTx={perpetualTx}
                  />
                }
              />
            ),
            toastOptions,
          );
        }
      }
      setToastedTransactions(transactions => ({
        ...transactions,
        [transaction.transactionHash]: true,
      }));
    }
  }, [modal, t, transactions, toastedTransactions]);

  return null;
};

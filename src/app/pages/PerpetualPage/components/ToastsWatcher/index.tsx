import { translations } from 'locales/i18n';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { selectTransactions } from 'store/global/transactions-store/selectors';
import { TxStatus, TxType } from 'store/global/transactions-store/types';
import { selectPerpetualPage } from '../../selectors';
import { PerpetualPageModals } from '../../types';
import { CustomToastContent, toastOptions } from '../CustomToastContent';
import { ToastAdditionalInfo } from './components/ToastAdditionalInfo.tsx';
import { Asset } from '../../../../../types';
import { isPerpetualTx } from '../TradeDialog/types';

export const ToastsWatcher: React.FC = () => {
  const [toastedTransactions, setToastedTransactions] = useState({});
  const transactions = useSelector(selectTransactions);

  const { modal } = useSelector(selectPerpetualPage);

  const { t } = useTranslation();

  useEffect(() => {
    if (modal === PerpetualPageModals.TRADE_REVIEW) {
      return;
    }

    const toastTransactions = Object.values(transactions).filter(
      transaction =>
        [
          TxType.APPROVE,
          TxType.DEPOSIT_COLLATERAL,
          TxType.WITHDRAW_COLLATERAL,
          TxType.OPEN_PERPETUAL_TRADE,
        ].includes(transaction.type) &&
        transaction.asset === Asset.PERPETUALS &&
        [TxStatus.CONFIRMED, TxStatus.FAILED].includes(transaction.status) &&
        !toastedTransactions[transaction.transactionHash],
    );

    for (let transaction of toastTransactions) {
      if (!isPerpetualTx(transaction.customData)) {
        continue;
      }

      const perpetualTx = transaction.customData;

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
      setToastedTransactions(transactions => ({
        ...transactions,
        [transaction.transactionHash]: true,
      }));
    }
  }, [modal, t, transactions, toastedTransactions]);

  return null;
};

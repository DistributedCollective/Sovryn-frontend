import { AssetValue } from 'app/components/AssetValue';
import { AssetValueMode } from 'app/components/AssetValue/types';
import { noop } from 'app/constants';
import { translations } from 'locales/i18n';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { TradingPosition } from 'types/trading-position';
import { weiToNumberFormat } from 'utils/display-text/format';
import {
  CustomToastContent,
  toastOptions,
} from '../components/CustomToastContent';
import {
  isDepositMargin,
  isTrade,
  isWithdrawMargin,
  PerpetualTx,
} from '../components/TradeDialog/types';
import { RecentTradesContext } from './RecentTradesContext';

type ToastsContextValue = {
  toastTransactions: PerpetualTx[];
  setToastTransactions: Dispatch<SetStateAction<PerpetualTx[]>>;
};

export const ToastsContext = createContext<ToastsContextValue>({
  toastTransactions: [],
  setToastTransactions: noop,
});

type ToastsContextProviderProps = {
  children: React.ReactNode;
};

export const ToastsContextProvider: React.FC<ToastsContextProviderProps> = ({
  children,
}) => {
  const [transactions, setTransactions] = useState<PerpetualTx[]>([]);
  const { t } = useTranslation();

  const { trades } = useContext(RecentTradesContext);
  const tradeIds = useMemo(() => trades.map(item => item.id), [trades]);

  useEffect(() => {
    const successfulTransaction = transactions.find(item =>
      tradeIds.includes(item.tx!),
    );

    if (successfulTransaction) {
      toast.success(
        ({ toastProps }) => (
          <CustomToastContent
            toastProps={toastProps}
            mainInfo={t(translations.perpetualPage.toasts.orderComplete)}
            additionalInfo={
              <ToastAdditionalInfo transaction={successfulTransaction} />
            }
          />
        ),
        toastOptions,
      );

      setTimeout(
        setTransactions(
          transactions.filter(item => item.tx !== successfulTransaction.tx),
        ),
        2000,
      );
    }
  }, [t, tradeIds, transactions]);

  return (
    <ToastsContext.Provider
      value={{
        toastTransactions: transactions,
        setToastTransactions: setTransactions,
      }}
    >
      {children}
    </ToastsContext.Provider>
  );
};

type ToastAdditionalInfoProps = {
  transaction: PerpetualTx;
};

const ToastAdditionalInfo: React.FC<ToastAdditionalInfoProps> = ({
  transaction,
}) => {
  const { t } = useTranslation();

  if (isTrade(transaction)) {
    const amount = weiToNumberFormat(transaction.amount, 3);
    if (transaction.isClosePosition) {
      return (
        <>
          {t(translations.perpetualPage.toasts.closePosition)} {amount} BTC
        </>
      );
    }

    return (
      <>
        {t(translations.perpetualPage.toasts.market)}{' '}
        {t(
          translations.perpetualPage.toasts[
            transaction.tradingPosition === TradingPosition.LONG
              ? 'buy'
              : 'sell'
          ],
        )}{' '}
        {amount} BTC
      </>
    );
  }

  if (isDepositMargin(transaction)) {
    return (
      <>
        {t(translations.perpetualPage.toasts.increaseMargin)}
        <AssetValue
          minDecimals={3}
          maxDecimals={6}
          mode={AssetValueMode.auto}
          value={transaction.amount}
          assetString="BCT"
        />
      </>
    );
  }

  if (isWithdrawMargin(transaction)) {
    return (
      <>
        {t(translations.perpetualPage.toasts.decreaseMargin)}
        <AssetValue
          minDecimals={3}
          maxDecimals={6}
          mode={AssetValueMode.auto}
          value={transaction.amount}
          assetString="BCT"
        />
      </>
    );
  }

  return null;
};

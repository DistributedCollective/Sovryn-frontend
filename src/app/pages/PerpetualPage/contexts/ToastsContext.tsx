import { noop } from 'app/constants';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { PerpetualPair } from 'utils/models/perpetual-pair';
import { PerpetualTx } from '../components/TradeDialog/types';

export type ToastTransaction = PerpetualTx & {
  leverage?: number;
  pair: PerpetualPair;
};

type ToastsContextValue = {
  toastTransactions: ToastTransaction[];
  setToastTransactions: Dispatch<SetStateAction<ToastTransaction[]>>;
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
  const [transactions, setTransactions] = useState<ToastTransaction[]>([]);

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

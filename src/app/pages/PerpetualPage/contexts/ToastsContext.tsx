import { noop } from 'app/constants';
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from 'react';
import { PerpetualTx } from '../components/TradeDialog/types';

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

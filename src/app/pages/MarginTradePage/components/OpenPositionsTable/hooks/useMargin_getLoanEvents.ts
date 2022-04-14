import { useEffect, useState } from 'react';
import { useDebug } from 'app/hooks/useDebug';
import { backendUrl, currentChainId } from 'utils/classifiers';
import { EventType } from 'app/pages/MarginTradePage/types';

export type LoanEvent = {
  event: EventType;
  user: string;
  loanId: string;
  loanToken: string;
  collateralToken: string;
  positionSizeChange: string;
  borrowedAmountChange: string;
  interestRate: number;
  collateralToLoanRate: string;
  leverage: number;
  margin: string;
  time: number;
  txHash: string;
  settlementDate: number;
};

export type LoanData = {
  loanId: string;
  isOpen: boolean;
  nextRollover: number;
  data: LoanEvent[];
};

const defaultValue: LoanData = {
  loanId: '',
  isOpen: false,
  nextRollover: 0,
  data: [],
};

export const useMargin_getLoanEvents = (loanId: string) => {
  const { log, error } = useDebug('useMargin_getLoanEvents');

  const [items, setItems] = useState<LoanData>(defaultValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loanId) {
      setLoading(true);

      fetch(`${backendUrl[currentChainId]}/trade/loan/${loanId}`)
        .then(response => response.json())
        .then(response => response.events[0] || defaultValue)
        .then(response => {
          log(response);
          setItems(response);
        })
        .catch(err => {
          error(err);
          setItems(defaultValue);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [error, log, loanId]);

  return {
    items,
    loading,
  };
};

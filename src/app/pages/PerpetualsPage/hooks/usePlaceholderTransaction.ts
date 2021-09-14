import { useState } from 'react';
import { TxStatus } from '../../../../store/global/transactions-store/types';
import { SendTxResponseInterface } from '../../../hooks/useSendContractTx';

export const usePlaceholderTransaction = (
  ...args: any
): SendTxResponseInterface => {
  const [state, setState] = useState<SendTxResponseInterface>({
    send: (...args: any) => {
      console.warn(
        'usePlaceholderTransaction has been used! FEATURE NOT IMPLEMENTED YET',
      );
      setState(state => ({
        ...state,
        loading: true,
        status: TxStatus.PENDING,
      }));
      setTimeout(() => {
        setState(state => ({
          ...state,
          loading: false,
          status: TxStatus.CONFIRMED,
        }));
      }, 3000);
    },
    loading: false,
    reset: () => {
      console.warn(
        'usePlaceholderTransaction has been used! FEATURE NOT IMPLEMENTED YET',
      );
      setState(state => ({
        ...state,
        loading: false,
        status: TxStatus.NONE,
      }));
    },
    status: TxStatus.NONE,
    txData: null,
    txHash: 'NOT IMPLEMENTED',
  });

  return state;
};

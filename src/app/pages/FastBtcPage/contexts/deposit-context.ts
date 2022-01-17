import { createContext, Dispatch, SetStateAction } from 'react';
import { Nullable } from 'types';

export enum DepositStep {
  MAIN,
  AMOUNT,
  ADDRESS,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

export type DepositContextStateType = {
  step: DepositStep;
  ready: boolean;
  address: string;
  addressLoading: boolean;
  addressError: Nullable<string>;
  depositTx: Nullable<TxData>;
  transferTx: Nullable<TxData>;
  limits: DepositLimits;
};

type DepositLimits = {
  min: number;
  max: number;
  loading: boolean;
};

export type TxData = {
  txHash: string;
  value: number;
  status: TxStatus;
};

type TxStatus = 'pending' | 'confirmed' | string;

export type DepositContextFunctionsType = {
  set: Dispatch<SetStateAction<DepositContextStateType>>;
  requestDepositAddress: (address: string) => void;
};

export type DepositContextType = DepositContextStateType &
  DepositContextFunctionsType;

export const defaultValue: DepositContextType = {
  step: DepositStep.MAIN,
  ready: false,
  address: '',
  addressLoading: false,
  addressError: null,
  depositTx: null,
  transferTx: null,
  limits: {
    min: 0,
    max: 0,
    loading: true,
  },
  set: () => {
    throw new Error('set() has not been defined.');
  },
  requestDepositAddress: (address: string) => {
    throw new Error('requestDepositAddress() has not been defined.');
  },
};

export const DepositContext = createContext<DepositContextType>(defaultValue);

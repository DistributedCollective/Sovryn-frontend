import { createContext, Dispatch, SetStateAction } from 'react';

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
  limits: DepositLimits;
  tx: TxData;
};

type DepositLimits = {
  min: number;
  max: number;
  loading: boolean;
};

type TxData = {
  depositTx: string;
  transferTx: string;
};

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
  tx: {
    depositTx: '',
    transferTx: '',
  },
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

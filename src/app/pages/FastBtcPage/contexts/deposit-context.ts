import { createContext, Dispatch, SetStateAction } from 'react';
import { Nullable } from 'types';

export enum DepositStep {
  MAIN,
  VALIDATION,
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
  depositRskTransactionHash: Nullable<string>;
  limits: DepositLimits;
  signatures: Signature[];
};

type DepositLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

export type TxData = {
  txHash: string;
  value: number;
  status: TxStatus;
};

export type Signature = {
  signer: string;
  signature: number;
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
  depositRskTransactionHash: null,
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  signatures: [],
  set: () => {
    throw new Error('set() has not been defined.');
  },
  requestDepositAddress: (address: string) => {
    throw new Error('requestDepositAddress() has not been defined.');
  },
};

export const DepositContext = createContext<DepositContextType>(defaultValue);

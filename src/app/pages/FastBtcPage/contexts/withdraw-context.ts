import { createContext, Dispatch, SetStateAction } from 'react';

export enum WithdrawStep {
  MAIN,
  AMOUNT,
  ADDRESS,
  REVIEW,
  CONFIRM,
  PROCESSING,
  COMPLETED,
}

export type WithdrawContextStateType = {
  step: WithdrawStep;
  amount: string;
  address: string;
  limits: WithdrawLimits;
  aggregatorLimits: AggregatorLimits;
};

type WithdrawLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

type AggregatorLimits = {
  fee: number;
  min: number;
  loading: boolean;
};

export type WithdrawContextFunctionsType = {
  set: Dispatch<SetStateAction<WithdrawContextStateType>>;
};

export type WithdrawContextType = WithdrawContextStateType &
  WithdrawContextFunctionsType;

export const defaultValue: WithdrawContextType = {
  step: WithdrawStep.MAIN,
  amount: '',
  address: '',
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  aggregatorLimits: {
    fee: 0,
    min: 0,
    loading: false,
  },
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const WithdrawContext = createContext<WithdrawContextType>(defaultValue);

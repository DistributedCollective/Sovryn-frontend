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
};

type WithdrawLimits = {
  min: number;
  max: number;
  baseFee: number;
  dynamicFee: number;
  loading: boolean;
};

export type WithdrawContextFunctionsType = {
  set: Dispatch<SetStateAction<WithdrawContextStateType>>;
};

export type WithdrawContextType = WithdrawContextStateType &
  WithdrawContextFunctionsType;

export const defaultValue: WithdrawContextType = {
  step: WithdrawStep.REVIEW,
  amount: '0.001',
  address: 'tb1qg4lajh33swmy9dex7uyp40tmzzfftpclsdlt87',
  limits: {
    min: 0,
    max: 0,
    baseFee: 0,
    dynamicFee: 0,
    loading: true,
  },
  set: () => {
    throw new Error('set() has not been defined.');
  },
};

export const WithdrawContext = createContext<WithdrawContextType>(defaultValue);

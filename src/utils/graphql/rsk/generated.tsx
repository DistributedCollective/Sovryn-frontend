import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};

export type Block_Height = {
  hash?: InputMaybe<Scalars['Bytes']>;
  number?: InputMaybe<Scalars['Int']>;
  number_gte?: InputMaybe<Scalars['Int']>;
};

/** Granular event data for the Loan entity. Emitted when a user Borrows (takes out a loan) */
export type Borrow = {
  __typename?: 'Borrow';
  collateralToLoanRate: Scalars['BigInt'];
  collateralToken: Scalars['Bytes'];
  currentMargin: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  interestDuration: Scalars['BigInt'];
  interestRate: Scalars['BigInt'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  newCollateral: Scalars['BigInt'];
  newPrincipal: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type Borrow_Filter = {
  collateralToLoanRate?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentMargin?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_lte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interestDuration?: InputMaybe<Scalars['BigInt']>;
  interestDuration_gt?: InputMaybe<Scalars['BigInt']>;
  interestDuration_gte?: InputMaybe<Scalars['BigInt']>;
  interestDuration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  interestDuration_lt?: InputMaybe<Scalars['BigInt']>;
  interestDuration_lte?: InputMaybe<Scalars['BigInt']>;
  interestDuration_not?: InputMaybe<Scalars['BigInt']>;
  interestDuration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  interestRate?: InputMaybe<Scalars['BigInt']>;
  interestRate_gt?: InputMaybe<Scalars['BigInt']>;
  interestRate_gte?: InputMaybe<Scalars['BigInt']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  interestRate_lt?: InputMaybe<Scalars['BigInt']>;
  interestRate_lte?: InputMaybe<Scalars['BigInt']>;
  interestRate_not?: InputMaybe<Scalars['BigInt']>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  newCollateral?: InputMaybe<Scalars['BigInt']>;
  newCollateral_gt?: InputMaybe<Scalars['BigInt']>;
  newCollateral_gte?: InputMaybe<Scalars['BigInt']>;
  newCollateral_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newCollateral_lt?: InputMaybe<Scalars['BigInt']>;
  newCollateral_lte?: InputMaybe<Scalars['BigInt']>;
  newCollateral_not?: InputMaybe<Scalars['BigInt']>;
  newCollateral_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newPrincipal?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_gt?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_gte?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newPrincipal_lt?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_lte?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_not?: InputMaybe<Scalars['BigInt']>;
  newPrincipal_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Borrow_OrderBy {
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  InterestDuration = 'interestDuration',
  InterestRate = 'interestRate',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  NewCollateral = 'newCollateral',
  NewPrincipal = 'newPrincipal',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

export type CandleStick = {
  __typename?: 'CandleStick';
  baseToken?: Maybe<Token>;
  close: Scalars['BigDecimal'];
  high: Scalars['BigDecimal'];
  id: Scalars['ID'];
  interval?: Maybe<CandleSticksInterval>;
  low: Scalars['BigDecimal'];
  open?: Maybe<Scalars['BigDecimal']>;
  periodStartUnix: Scalars['Int'];
  quoteToken?: Maybe<Token>;
  totalVolume: Scalars['BigDecimal'];
  txCount: Scalars['Int'];
};

export type CandleStick_Filter = {
  baseToken?: InputMaybe<Scalars['String']>;
  baseToken_contains?: InputMaybe<Scalars['String']>;
  baseToken_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_gt?: InputMaybe<Scalars['String']>;
  baseToken_gte?: InputMaybe<Scalars['String']>;
  baseToken_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_lt?: InputMaybe<Scalars['String']>;
  baseToken_lte?: InputMaybe<Scalars['String']>;
  baseToken_not?: InputMaybe<Scalars['String']>;
  baseToken_not_contains?: InputMaybe<Scalars['String']>;
  baseToken_not_ends_with?: InputMaybe<Scalars['String']>;
  baseToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  baseToken_not_starts_with?: InputMaybe<Scalars['String']>;
  baseToken_starts_with?: InputMaybe<Scalars['String']>;
  close?: InputMaybe<Scalars['BigDecimal']>;
  close_gt?: InputMaybe<Scalars['BigDecimal']>;
  close_gte?: InputMaybe<Scalars['BigDecimal']>;
  close_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  close_lt?: InputMaybe<Scalars['BigDecimal']>;
  close_lte?: InputMaybe<Scalars['BigDecimal']>;
  close_not?: InputMaybe<Scalars['BigDecimal']>;
  close_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high?: InputMaybe<Scalars['BigDecimal']>;
  high_gt?: InputMaybe<Scalars['BigDecimal']>;
  high_gte?: InputMaybe<Scalars['BigDecimal']>;
  high_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  high_lt?: InputMaybe<Scalars['BigDecimal']>;
  high_lte?: InputMaybe<Scalars['BigDecimal']>;
  high_not?: InputMaybe<Scalars['BigDecimal']>;
  high_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interval?: InputMaybe<CandleSticksInterval>;
  interval_in?: InputMaybe<Array<CandleSticksInterval>>;
  interval_not?: InputMaybe<CandleSticksInterval>;
  interval_not_in?: InputMaybe<Array<CandleSticksInterval>>;
  low?: InputMaybe<Scalars['BigDecimal']>;
  low_gt?: InputMaybe<Scalars['BigDecimal']>;
  low_gte?: InputMaybe<Scalars['BigDecimal']>;
  low_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  low_lt?: InputMaybe<Scalars['BigDecimal']>;
  low_lte?: InputMaybe<Scalars['BigDecimal']>;
  low_not?: InputMaybe<Scalars['BigDecimal']>;
  low_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open?: InputMaybe<Scalars['BigDecimal']>;
  open_gt?: InputMaybe<Scalars['BigDecimal']>;
  open_gte?: InputMaybe<Scalars['BigDecimal']>;
  open_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  open_lt?: InputMaybe<Scalars['BigDecimal']>;
  open_lte?: InputMaybe<Scalars['BigDecimal']>;
  open_not?: InputMaybe<Scalars['BigDecimal']>;
  open_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  periodStartUnix?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_gte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_in?: InputMaybe<Array<Scalars['Int']>>;
  periodStartUnix_lt?: InputMaybe<Scalars['Int']>;
  periodStartUnix_lte?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not?: InputMaybe<Scalars['Int']>;
  periodStartUnix_not_in?: InputMaybe<Array<Scalars['Int']>>;
  quoteToken?: InputMaybe<Scalars['String']>;
  quoteToken_contains?: InputMaybe<Scalars['String']>;
  quoteToken_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_gt?: InputMaybe<Scalars['String']>;
  quoteToken_gte?: InputMaybe<Scalars['String']>;
  quoteToken_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_lt?: InputMaybe<Scalars['String']>;
  quoteToken_lte?: InputMaybe<Scalars['String']>;
  quoteToken_not?: InputMaybe<Scalars['String']>;
  quoteToken_not_contains?: InputMaybe<Scalars['String']>;
  quoteToken_not_ends_with?: InputMaybe<Scalars['String']>;
  quoteToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  quoteToken_not_starts_with?: InputMaybe<Scalars['String']>;
  quoteToken_starts_with?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  txCount?: InputMaybe<Scalars['Int']>;
  txCount_gt?: InputMaybe<Scalars['Int']>;
  txCount_gte?: InputMaybe<Scalars['Int']>;
  txCount_in?: InputMaybe<Array<Scalars['Int']>>;
  txCount_lt?: InputMaybe<Scalars['Int']>;
  txCount_lte?: InputMaybe<Scalars['Int']>;
  txCount_not?: InputMaybe<Scalars['Int']>;
  txCount_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum CandleStick_OrderBy {
  BaseToken = 'baseToken',
  Close = 'close',
  High = 'high',
  Id = 'id',
  Interval = 'interval',
  Low = 'low',
  Open = 'open',
  PeriodStartUnix = 'periodStartUnix',
  QuoteToken = 'quoteToken',
  TotalVolume = 'totalVolume',
  TxCount = 'txCount',
}

export enum CandleSticksInterval {
  DayInterval = 'DayInterval',
  FifteenMintuesInterval = 'FifteenMintuesInterval',
  FourHourInterval = 'FourHourInterval',
  HourInterval = 'HourInterval',
  MinuteInterval = 'MinuteInterval',
}

/** Granular event data for the Loan entity. Emitted when a user closes a loan initiated by a Borrow event */
export type CloseWithDeposit = {
  __typename?: 'CloseWithDeposit';
  closer: Scalars['Bytes'];
  collateralToLoanRate: Scalars['BigInt'];
  collateralToken: Scalars['Bytes'];
  collateralWithdrawAmount: Scalars['BigInt'];
  currentMargin: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  repayAmount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: Scalars['Bytes'];
};

export type CloseWithDeposit_Filter = {
  closer?: InputMaybe<Scalars['Bytes']>;
  closer_contains?: InputMaybe<Scalars['Bytes']>;
  closer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  closer_not?: InputMaybe<Scalars['Bytes']>;
  closer_not_contains?: InputMaybe<Scalars['Bytes']>;
  closer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToLoanRate?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralWithdrawAmount?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_gt?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_gte?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralWithdrawAmount_lt?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_lte?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_not?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentMargin?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_lte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  repayAmount?: InputMaybe<Scalars['BigInt']>;
  repayAmount_gt?: InputMaybe<Scalars['BigInt']>;
  repayAmount_gte?: InputMaybe<Scalars['BigInt']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigInt']>;
  repayAmount_lte?: InputMaybe<Scalars['BigInt']>;
  repayAmount_not?: InputMaybe<Scalars['BigInt']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum CloseWithDeposit_OrderBy {
  Closer = 'closer',
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CollateralWithdrawAmount = 'collateralWithdrawAmount',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  RepayAmount = 'repayAmount',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/** Granular event data for the Loan entity. Emitted when a user closes a loan initiated by a Margin Trade */
export type CloseWithSwap = {
  __typename?: 'CloseWithSwap';
  closer: Scalars['Bytes'];
  collateralToken: Scalars['Bytes'];
  currentLeverage: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  exitPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  loanCloseAmount: Scalars['BigInt'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  positionCloseSize: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: Scalars['Bytes'];
};

export type CloseWithSwap_Filter = {
  closer?: InputMaybe<Scalars['Bytes']>;
  closer_contains?: InputMaybe<Scalars['Bytes']>;
  closer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  closer_not?: InputMaybe<Scalars['Bytes']>;
  closer_not_contains?: InputMaybe<Scalars['Bytes']>;
  closer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentLeverage?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_gt?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_gte?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentLeverage_lt?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_lte?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_not?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  exitPrice?: InputMaybe<Scalars['BigInt']>;
  exitPrice_gt?: InputMaybe<Scalars['BigInt']>;
  exitPrice_gte?: InputMaybe<Scalars['BigInt']>;
  exitPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  exitPrice_lt?: InputMaybe<Scalars['BigInt']>;
  exitPrice_lte?: InputMaybe<Scalars['BigInt']>;
  exitPrice_not?: InputMaybe<Scalars['BigInt']>;
  exitPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanCloseAmount?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_gt?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_gte?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  loanCloseAmount_lt?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_lte?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_not?: InputMaybe<Scalars['BigInt']>;
  loanCloseAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  positionCloseSize?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_gt?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_gte?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_in?: InputMaybe<Array<Scalars['BigInt']>>;
  positionCloseSize_lt?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_lte?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_not?: InputMaybe<Scalars['BigInt']>;
  positionCloseSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['Bytes']>;
  user_contains?: InputMaybe<Scalars['Bytes']>;
  user_in?: InputMaybe<Array<Scalars['Bytes']>>;
  user_not?: InputMaybe<Scalars['Bytes']>;
  user_not_contains?: InputMaybe<Scalars['Bytes']>;
  user_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum CloseWithSwap_OrderBy {
  Closer = 'closer',
  CollateralToken = 'collateralToken',
  CurrentLeverage = 'currentLeverage',
  EmittedBy = 'emittedBy',
  ExitPrice = 'exitPrice',
  Id = 'id',
  Lender = 'lender',
  LoanCloseAmount = 'loanCloseAmount',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  PositionCloseSize = 'positionCloseSize',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/** Autogenerated for debugging - to be eventually deleted. Although this is pretty useful, maybe keep */
export type Conversion = {
  __typename?: 'Conversion';
  _amount: Scalars['BigInt'];
  _conversionFee: Scalars['BigInt'];
  _fromToken: Token;
  _protocolFee: Scalars['BigInt'];
  _return: Scalars['BigInt'];
  _toToken: Token;
  _trader: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  swapTransaction: Swap;
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type Conversion_Filter = {
  _amount?: InputMaybe<Scalars['BigInt']>;
  _amount_gt?: InputMaybe<Scalars['BigInt']>;
  _amount_gte?: InputMaybe<Scalars['BigInt']>;
  _amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _amount_lt?: InputMaybe<Scalars['BigInt']>;
  _amount_lte?: InputMaybe<Scalars['BigInt']>;
  _amount_not?: InputMaybe<Scalars['BigInt']>;
  _amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _conversionFee?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_gt?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_gte?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _conversionFee_lt?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_lte?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_not?: InputMaybe<Scalars['BigInt']>;
  _conversionFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _fromToken?: InputMaybe<Scalars['String']>;
  _fromToken_contains?: InputMaybe<Scalars['String']>;
  _fromToken_ends_with?: InputMaybe<Scalars['String']>;
  _fromToken_gt?: InputMaybe<Scalars['String']>;
  _fromToken_gte?: InputMaybe<Scalars['String']>;
  _fromToken_in?: InputMaybe<Array<Scalars['String']>>;
  _fromToken_lt?: InputMaybe<Scalars['String']>;
  _fromToken_lte?: InputMaybe<Scalars['String']>;
  _fromToken_not?: InputMaybe<Scalars['String']>;
  _fromToken_not_contains?: InputMaybe<Scalars['String']>;
  _fromToken_not_ends_with?: InputMaybe<Scalars['String']>;
  _fromToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  _fromToken_not_starts_with?: InputMaybe<Scalars['String']>;
  _fromToken_starts_with?: InputMaybe<Scalars['String']>;
  _protocolFee?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_gt?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_gte?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _protocolFee_lt?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_lte?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_not?: InputMaybe<Scalars['BigInt']>;
  _protocolFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _return?: InputMaybe<Scalars['BigInt']>;
  _return_gt?: InputMaybe<Scalars['BigInt']>;
  _return_gte?: InputMaybe<Scalars['BigInt']>;
  _return_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _return_lt?: InputMaybe<Scalars['BigInt']>;
  _return_lte?: InputMaybe<Scalars['BigInt']>;
  _return_not?: InputMaybe<Scalars['BigInt']>;
  _return_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  _toToken?: InputMaybe<Scalars['String']>;
  _toToken_contains?: InputMaybe<Scalars['String']>;
  _toToken_ends_with?: InputMaybe<Scalars['String']>;
  _toToken_gt?: InputMaybe<Scalars['String']>;
  _toToken_gte?: InputMaybe<Scalars['String']>;
  _toToken_in?: InputMaybe<Array<Scalars['String']>>;
  _toToken_lt?: InputMaybe<Scalars['String']>;
  _toToken_lte?: InputMaybe<Scalars['String']>;
  _toToken_not?: InputMaybe<Scalars['String']>;
  _toToken_not_contains?: InputMaybe<Scalars['String']>;
  _toToken_not_ends_with?: InputMaybe<Scalars['String']>;
  _toToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  _toToken_not_starts_with?: InputMaybe<Scalars['String']>;
  _toToken_starts_with?: InputMaybe<Scalars['String']>;
  _trader?: InputMaybe<Scalars['Bytes']>;
  _trader_contains?: InputMaybe<Scalars['Bytes']>;
  _trader_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _trader_not?: InputMaybe<Scalars['Bytes']>;
  _trader_not_contains?: InputMaybe<Scalars['Bytes']>;
  _trader_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  swapTransaction?: InputMaybe<Scalars['String']>;
  swapTransaction_contains?: InputMaybe<Scalars['String']>;
  swapTransaction_ends_with?: InputMaybe<Scalars['String']>;
  swapTransaction_gt?: InputMaybe<Scalars['String']>;
  swapTransaction_gte?: InputMaybe<Scalars['String']>;
  swapTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  swapTransaction_lt?: InputMaybe<Scalars['String']>;
  swapTransaction_lte?: InputMaybe<Scalars['String']>;
  swapTransaction_not?: InputMaybe<Scalars['String']>;
  swapTransaction_not_contains?: InputMaybe<Scalars['String']>;
  swapTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  swapTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  swapTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  swapTransaction_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Conversion_OrderBy {
  Amount = '_amount',
  ConversionFee = '_conversionFee',
  FromToken = '_fromToken',
  ProtocolFee = '_protocolFee',
  Return = '_return',
  ToToken = '_toToken',
  Trader = '_trader',
  EmittedBy = 'emittedBy',
  Id = 'id',
  SwapTransaction = 'swapTransaction',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/** The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol */
export type ConverterRegistry = {
  __typename?: 'ConverterRegistry';
  addedToContractRegistryAtBlockNumber?: Maybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp?: Maybe<Scalars['BigInt']>;
  addedToContractRegistryAtTransactionHash?: Maybe<Scalars['String']>;
  connectorTokens?: Maybe<Array<Token>>;
  /** All the converters (AMM pools) associated with this registry */
  converters?: Maybe<Array<LiquidityPool>>;
  /** ID is the address of the converter registry contract */
  id: Scalars['ID'];
  lastUsedAtBlockNumber?: Maybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp?: Maybe<Scalars['BigInt']>;
  lastUsedAtTransactionHash?: Maybe<Scalars['String']>;
  numConverters: Scalars['BigInt'];
  owner: Scalars['Bytes'];
  smartTokens?: Maybe<Array<SmartToken>>;
};

/** The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol */
export type ConverterRegistryConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

/** The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol */
export type ConverterRegistryConvertersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPool_Filter>;
};

/** The ConverterRegistry registers each new AMM pool added to the Sovryn Protocol */
export type ConverterRegistrySmartTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<SmartToken_Filter>;
};

export type ConverterRegistry_Filter = {
  addedToContractRegistryAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  addedToContractRegistryAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockNumber_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  addedToContractRegistryAtBlockTimestamp?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  addedToContractRegistryAtBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  addedToContractRegistryAtBlockTimestamp_not_in?: InputMaybe<
    Array<Scalars['BigInt']>
  >;
  addedToContractRegistryAtTransactionHash?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_contains?: InputMaybe<
    Scalars['String']
  >;
  addedToContractRegistryAtTransactionHash_ends_with?: InputMaybe<
    Scalars['String']
  >;
  addedToContractRegistryAtTransactionHash_gt?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_gte?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_in?: InputMaybe<
    Array<Scalars['String']>
  >;
  addedToContractRegistryAtTransactionHash_lt?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_lte?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_not?: InputMaybe<Scalars['String']>;
  addedToContractRegistryAtTransactionHash_not_contains?: InputMaybe<
    Scalars['String']
  >;
  addedToContractRegistryAtTransactionHash_not_ends_with?: InputMaybe<
    Scalars['String']
  >;
  addedToContractRegistryAtTransactionHash_not_in?: InputMaybe<
    Array<Scalars['String']>
  >;
  addedToContractRegistryAtTransactionHash_not_starts_with?: InputMaybe<
    Scalars['String']
  >;
  addedToContractRegistryAtTransactionHash_starts_with?: InputMaybe<
    Scalars['String']
  >;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastUsedAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUsedAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUsedAtBlockTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUsedAtBlockTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastUsedAtBlockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastUsedAtTransactionHash?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_contains?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_ends_with?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_gt?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_gte?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_in?: InputMaybe<Array<Scalars['String']>>;
  lastUsedAtTransactionHash_lt?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_lte?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_not?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_not_contains?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_not_ends_with?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_not_in?: InputMaybe<Array<Scalars['String']>>;
  lastUsedAtTransactionHash_not_starts_with?: InputMaybe<Scalars['String']>;
  lastUsedAtTransactionHash_starts_with?: InputMaybe<Scalars['String']>;
  numConverters?: InputMaybe<Scalars['BigInt']>;
  numConverters_gt?: InputMaybe<Scalars['BigInt']>;
  numConverters_gte?: InputMaybe<Scalars['BigInt']>;
  numConverters_in?: InputMaybe<Array<Scalars['BigInt']>>;
  numConverters_lt?: InputMaybe<Scalars['BigInt']>;
  numConverters_lte?: InputMaybe<Scalars['BigInt']>;
  numConverters_not?: InputMaybe<Scalars['BigInt']>;
  numConverters_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum ConverterRegistry_OrderBy {
  AddedToContractRegistryAtBlockNumber = 'addedToContractRegistryAtBlockNumber',
  AddedToContractRegistryAtBlockTimestamp = 'addedToContractRegistryAtBlockTimestamp',
  AddedToContractRegistryAtTransactionHash = 'addedToContractRegistryAtTransactionHash',
  ConnectorTokens = 'connectorTokens',
  Converters = 'converters',
  Id = 'id',
  LastUsedAtBlockNumber = 'lastUsedAtBlockNumber',
  LastUsedAtBlockTimestamp = 'lastUsedAtBlockTimestamp',
  LastUsedAtTransactionHash = 'lastUsedAtTransactionHash',
  NumConverters = 'numConverters',
  Owner = 'owner',
  SmartTokens = 'smartTokens',
}

/** Granular event data for the Loan entity. Emitted when a user closes adds collateral to a Margin Trade or Borrow */
export type DepositCollateral = {
  __typename?: 'DepositCollateral';
  depositAmount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Loan;
  rate?: Maybe<Scalars['BigInt']>;
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type DepositCollateral_Filter = {
  depositAmount?: InputMaybe<Scalars['BigInt']>;
  depositAmount_gt?: InputMaybe<Scalars['BigInt']>;
  depositAmount_gte?: InputMaybe<Scalars['BigInt']>;
  depositAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  depositAmount_lt?: InputMaybe<Scalars['BigInt']>;
  depositAmount_lte?: InputMaybe<Scalars['BigInt']>;
  depositAmount_not?: InputMaybe<Scalars['BigInt']>;
  depositAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  rate?: InputMaybe<Scalars['BigInt']>;
  rate_gt?: InputMaybe<Scalars['BigInt']>;
  rate_gte?: InputMaybe<Scalars['BigInt']>;
  rate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  rate_lt?: InputMaybe<Scalars['BigInt']>;
  rate_lte?: InputMaybe<Scalars['BigInt']>;
  rate_not?: InputMaybe<Scalars['BigInt']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum DepositCollateral_OrderBy {
  DepositAmount = 'depositAmount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Rate = 'rate',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type FeeSharingTokensTransferred = {
  __typename?: 'FeeSharingTokensTransferred';
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  sender: Scalars['Bytes'];
  token: Scalars['Bytes'];
};

export type FeeSharingTokensTransferred_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  sender?: InputMaybe<Scalars['Bytes']>;
  sender_contains?: InputMaybe<Scalars['Bytes']>;
  sender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  sender_not?: InputMaybe<Scalars['Bytes']>;
  sender_not_contains?: InputMaybe<Scalars['Bytes']>;
  sender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
};

export enum FeeSharingTokensTransferred_OrderBy {
  Amount = 'amount',
  Id = 'id',
  Sender = 'sender',
  Token = 'token',
}

export type LendingHistoryItem = {
  __typename?: 'LendingHistoryItem';
  amount: Scalars['BigInt'];
  /** The underlying asset for this pool (eg USDT for the iUSDT pool) */
  asset?: Maybe<Token>;
  emittedBy: Scalars['String'];
  id: Scalars['ID'];
  lender: User;
  lendingPool: LendingPool;
  loanTokenAmount: Scalars['BigInt'];
  transaction: Transaction;
  type: LendingHistoryType;
  userLendingHistory: UserLendingHistory;
};

export type LendingHistoryItem_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  asset?: InputMaybe<Scalars['String']>;
  asset_contains?: InputMaybe<Scalars['String']>;
  asset_ends_with?: InputMaybe<Scalars['String']>;
  asset_gt?: InputMaybe<Scalars['String']>;
  asset_gte?: InputMaybe<Scalars['String']>;
  asset_in?: InputMaybe<Array<Scalars['String']>>;
  asset_lt?: InputMaybe<Scalars['String']>;
  asset_lte?: InputMaybe<Scalars['String']>;
  asset_not?: InputMaybe<Scalars['String']>;
  asset_not_contains?: InputMaybe<Scalars['String']>;
  asset_not_ends_with?: InputMaybe<Scalars['String']>;
  asset_not_in?: InputMaybe<Array<Scalars['String']>>;
  asset_not_starts_with?: InputMaybe<Scalars['String']>;
  asset_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['String']>;
  lender_contains?: InputMaybe<Scalars['String']>;
  lender_ends_with?: InputMaybe<Scalars['String']>;
  lender_gt?: InputMaybe<Scalars['String']>;
  lender_gte?: InputMaybe<Scalars['String']>;
  lender_in?: InputMaybe<Array<Scalars['String']>>;
  lender_lt?: InputMaybe<Scalars['String']>;
  lender_lte?: InputMaybe<Scalars['String']>;
  lender_not?: InputMaybe<Scalars['String']>;
  lender_not_contains?: InputMaybe<Scalars['String']>;
  lender_not_ends_with?: InputMaybe<Scalars['String']>;
  lender_not_in?: InputMaybe<Array<Scalars['String']>>;
  lender_not_starts_with?: InputMaybe<Scalars['String']>;
  lender_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool?: InputMaybe<Scalars['String']>;
  lendingPool_contains?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_gt?: InputMaybe<Scalars['String']>;
  lendingPool_gte?: InputMaybe<Scalars['String']>;
  lendingPool_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_lt?: InputMaybe<Scalars['String']>;
  lendingPool_lte?: InputMaybe<Scalars['String']>;
  lendingPool_not?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_not_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with?: InputMaybe<Scalars['String']>;
  loanTokenAmount?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_gt?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_gte?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  loanTokenAmount_lt?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_lte?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_not?: InputMaybe<Scalars['BigInt']>;
  loanTokenAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LendingHistoryType>;
  type_in?: InputMaybe<Array<LendingHistoryType>>;
  type_not?: InputMaybe<LendingHistoryType>;
  type_not_in?: InputMaybe<Array<LendingHistoryType>>;
  userLendingHistory?: InputMaybe<Scalars['String']>;
  userLendingHistory_contains?: InputMaybe<Scalars['String']>;
  userLendingHistory_ends_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_gt?: InputMaybe<Scalars['String']>;
  userLendingHistory_gte?: InputMaybe<Scalars['String']>;
  userLendingHistory_in?: InputMaybe<Array<Scalars['String']>>;
  userLendingHistory_lt?: InputMaybe<Scalars['String']>;
  userLendingHistory_lte?: InputMaybe<Scalars['String']>;
  userLendingHistory_not?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_contains?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_ends_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_not_in?: InputMaybe<Array<Scalars['String']>>;
  userLendingHistory_not_starts_with?: InputMaybe<Scalars['String']>;
  userLendingHistory_starts_with?: InputMaybe<Scalars['String']>;
};

export enum LendingHistoryItem_OrderBy {
  Amount = 'amount',
  Asset = 'asset',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  LendingPool = 'lendingPool',
  LoanTokenAmount = 'loanTokenAmount',
  Transaction = 'transaction',
  Type = 'type',
  UserLendingHistory = 'userLendingHistory',
}

export enum LendingHistoryType {
  Lend = 'Lend',
  UnLend = 'UnLend',
}

/**
 * A Lending Pool (iToken), where Users can lend assets to earn interest, and Users
 * can borrow assets to Margin Trade or just as a regular loan.
 */
export type LendingPool = {
  __typename?: 'LendingPool';
  assetBalance: Scalars['BigInt'];
  /** ID is the contract address of the iToken */
  id: Scalars['ID'];
  poolTokenBalance: Scalars['BigInt'];
  /** Total asset volume lent over all time */
  totalAssetLent: Scalars['BigInt'];
  /** The actual asset being lent and borrowed in this pool */
  underlyingAsset: Token;
};

export type LendingPool_Filter = {
  assetBalance?: InputMaybe<Scalars['BigInt']>;
  assetBalance_gt?: InputMaybe<Scalars['BigInt']>;
  assetBalance_gte?: InputMaybe<Scalars['BigInt']>;
  assetBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  assetBalance_lt?: InputMaybe<Scalars['BigInt']>;
  assetBalance_lte?: InputMaybe<Scalars['BigInt']>;
  assetBalance_not?: InputMaybe<Scalars['BigInt']>;
  assetBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolTokenBalance?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_gt?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_gte?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  poolTokenBalance_lt?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_lte?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_not?: InputMaybe<Scalars['BigInt']>;
  poolTokenBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAssetLent?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_gt?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_gte?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAssetLent_lt?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_lte?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_not?: InputMaybe<Scalars['BigInt']>;
  totalAssetLent_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  underlyingAsset?: InputMaybe<Scalars['String']>;
  underlyingAsset_contains?: InputMaybe<Scalars['String']>;
  underlyingAsset_ends_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_gt?: InputMaybe<Scalars['String']>;
  underlyingAsset_gte?: InputMaybe<Scalars['String']>;
  underlyingAsset_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingAsset_lt?: InputMaybe<Scalars['String']>;
  underlyingAsset_lte?: InputMaybe<Scalars['String']>;
  underlyingAsset_not?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_contains?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_ends_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_not_in?: InputMaybe<Array<Scalars['String']>>;
  underlyingAsset_not_starts_with?: InputMaybe<Scalars['String']>;
  underlyingAsset_starts_with?: InputMaybe<Scalars['String']>;
};

export enum LendingPool_OrderBy {
  AssetBalance = 'assetBalance',
  Id = 'id',
  PoolTokenBalance = 'poolTokenBalance',
  TotalAssetLent = 'totalAssetLent',
  UnderlyingAsset = 'underlyingAsset',
}

/** Granular event data for the Loan entity. Emitted when a loan is fully or partially liquidated */
export type Liquidate = {
  __typename?: 'Liquidate';
  collateralToLoanRate: Scalars['BigInt'];
  collateralToken: Scalars['Bytes'];
  collateralWithdrawAmount: Scalars['BigInt'];
  currentMargin: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lender: Scalars['Bytes'];
  liquidator: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  repayAmount: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type Liquidate_Filter = {
  collateralToLoanRate?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_gte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToLoanRate_lt?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_lte?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not?: InputMaybe<Scalars['BigInt']>;
  collateralToLoanRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralWithdrawAmount?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_gt?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_gte?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralWithdrawAmount_lt?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_lte?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_not?: InputMaybe<Scalars['BigInt']>;
  collateralWithdrawAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentMargin?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_gte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentMargin_lt?: InputMaybe<Scalars['BigInt']>;
  currentMargin_lte?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not?: InputMaybe<Scalars['BigInt']>;
  currentMargin_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  liquidator?: InputMaybe<Scalars['Bytes']>;
  liquidator_contains?: InputMaybe<Scalars['Bytes']>;
  liquidator_in?: InputMaybe<Array<Scalars['Bytes']>>;
  liquidator_not?: InputMaybe<Scalars['Bytes']>;
  liquidator_not_contains?: InputMaybe<Scalars['Bytes']>;
  liquidator_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  repayAmount?: InputMaybe<Scalars['BigInt']>;
  repayAmount_gt?: InputMaybe<Scalars['BigInt']>;
  repayAmount_gte?: InputMaybe<Scalars['BigInt']>;
  repayAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  repayAmount_lt?: InputMaybe<Scalars['BigInt']>;
  repayAmount_lte?: InputMaybe<Scalars['BigInt']>;
  repayAmount_not?: InputMaybe<Scalars['BigInt']>;
  repayAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Liquidate_OrderBy {
  CollateralToLoanRate = 'collateralToLoanRate',
  CollateralToken = 'collateralToken',
  CollateralWithdrawAmount = 'collateralWithdrawAmount',
  CurrentMargin = 'currentMargin',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Lender = 'lender',
  Liquidator = 'liquidator',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  RepayAmount = 'repayAmount',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

export type LiquidityHistoryItem = {
  __typename?: 'LiquidityHistoryItem';
  amount: Scalars['BigInt'];
  emittedBy: Scalars['String'];
  /** ID is transaction hash + log index */
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  newBalance: Scalars['BigInt'];
  newSupply: Scalars['BigInt'];
  provider: Scalars['String'];
  reserveToken: Token;
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  type: LiquidityHistoryType;
  user: User;
  userLiquidityHistory: UserLiquidityHistory;
};

export type LiquidityHistoryItem_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['String']>;
  emittedBy_contains?: InputMaybe<Scalars['String']>;
  emittedBy_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_gt?: InputMaybe<Scalars['String']>;
  emittedBy_gte?: InputMaybe<Scalars['String']>;
  emittedBy_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_lt?: InputMaybe<Scalars['String']>;
  emittedBy_lte?: InputMaybe<Scalars['String']>;
  emittedBy_not?: InputMaybe<Scalars['String']>;
  emittedBy_not_contains?: InputMaybe<Scalars['String']>;
  emittedBy_not_ends_with?: InputMaybe<Scalars['String']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['String']>>;
  emittedBy_not_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  newBalance?: InputMaybe<Scalars['BigInt']>;
  newBalance_gt?: InputMaybe<Scalars['BigInt']>;
  newBalance_gte?: InputMaybe<Scalars['BigInt']>;
  newBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newBalance_lt?: InputMaybe<Scalars['BigInt']>;
  newBalance_lte?: InputMaybe<Scalars['BigInt']>;
  newBalance_not?: InputMaybe<Scalars['BigInt']>;
  newBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newSupply?: InputMaybe<Scalars['BigInt']>;
  newSupply_gt?: InputMaybe<Scalars['BigInt']>;
  newSupply_gte?: InputMaybe<Scalars['BigInt']>;
  newSupply_in?: InputMaybe<Array<Scalars['BigInt']>>;
  newSupply_lt?: InputMaybe<Scalars['BigInt']>;
  newSupply_lte?: InputMaybe<Scalars['BigInt']>;
  newSupply_not?: InputMaybe<Scalars['BigInt']>;
  newSupply_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  provider?: InputMaybe<Scalars['String']>;
  provider_contains?: InputMaybe<Scalars['String']>;
  provider_ends_with?: InputMaybe<Scalars['String']>;
  provider_gt?: InputMaybe<Scalars['String']>;
  provider_gte?: InputMaybe<Scalars['String']>;
  provider_in?: InputMaybe<Array<Scalars['String']>>;
  provider_lt?: InputMaybe<Scalars['String']>;
  provider_lte?: InputMaybe<Scalars['String']>;
  provider_not?: InputMaybe<Scalars['String']>;
  provider_not_contains?: InputMaybe<Scalars['String']>;
  provider_not_ends_with?: InputMaybe<Scalars['String']>;
  provider_not_in?: InputMaybe<Array<Scalars['String']>>;
  provider_not_starts_with?: InputMaybe<Scalars['String']>;
  provider_starts_with?: InputMaybe<Scalars['String']>;
  reserveToken?: InputMaybe<Scalars['String']>;
  reserveToken_contains?: InputMaybe<Scalars['String']>;
  reserveToken_ends_with?: InputMaybe<Scalars['String']>;
  reserveToken_gt?: InputMaybe<Scalars['String']>;
  reserveToken_gte?: InputMaybe<Scalars['String']>;
  reserveToken_in?: InputMaybe<Array<Scalars['String']>>;
  reserveToken_lt?: InputMaybe<Scalars['String']>;
  reserveToken_lte?: InputMaybe<Scalars['String']>;
  reserveToken_not?: InputMaybe<Scalars['String']>;
  reserveToken_not_contains?: InputMaybe<Scalars['String']>;
  reserveToken_not_ends_with?: InputMaybe<Scalars['String']>;
  reserveToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  reserveToken_not_starts_with?: InputMaybe<Scalars['String']>;
  reserveToken_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<LiquidityHistoryType>;
  type_in?: InputMaybe<Array<LiquidityHistoryType>>;
  type_not?: InputMaybe<LiquidityHistoryType>;
  type_not_in?: InputMaybe<Array<LiquidityHistoryType>>;
  user?: InputMaybe<Scalars['String']>;
  userLiquidityHistory?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_contains?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_ends_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_gt?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_gte?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_in?: InputMaybe<Array<Scalars['String']>>;
  userLiquidityHistory_lt?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_lte?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_contains?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_ends_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_not_in?: InputMaybe<Array<Scalars['String']>>;
  userLiquidityHistory_not_starts_with?: InputMaybe<Scalars['String']>;
  userLiquidityHistory_starts_with?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum LiquidityHistoryItem_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  NewBalance = 'newBalance',
  NewSupply = 'newSupply',
  Provider = 'provider',
  ReserveToken = 'reserveToken',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Type = 'type',
  User = 'user',
  UserLiquidityHistory = 'userLiquidityHistory',
}

export enum LiquidityHistoryType {
  Added = 'Added',
  Removed = 'Removed',
}

/** AMM Pool (sometimes referred to as a Converter) */
export type LiquidityPool = {
  __typename?: 'LiquidityPool';
  /** Activated with be true when this pool is activated, and will change to false is the pool is deactivated */
  activated?: Maybe<Scalars['Boolean']>;
  connectorTokens: Array<LiquidityPoolToken>;
  conversionFee?: Maybe<Scalars['BigInt']>;
  createdAtBlockNumber?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp?: Maybe<Scalars['BigInt']>;
  createdAtTransaction: Transaction;
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  /** ID is the contract address of the Converter */
  id: Scalars['ID'];
  lastResetBlockNumber?: Maybe<Scalars['BigInt']>;
  lastResetTimestamp?: Maybe<Scalars['BigInt']>;
  maxConversionFee?: Maybe<Scalars['BigInt']>;
  owner?: Maybe<Scalars['String']>;
  poolTokens: Array<TokenPoolToken>;
  smartToken?: Maybe<SmartToken>;
  /**
   * The reserve assets of this AMM Pool. The are stored here like this so that
   * they can be accessed inside mappings when the LiquidityPool is loaded.
   */
  token0?: Maybe<Token>;
  token1?: Maybe<Token>;
  /** Sovryn uses Bancor V1 and Bancor V2 pools */
  type?: Maybe<Scalars['Int']>;
  version?: Maybe<Scalars['Int']>;
  weight?: Maybe<Scalars['BigInt']>;
};

/** AMM Pool (sometimes referred to as a Converter) */
export type LiquidityPoolConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

/** AMM Pool (sometimes referred to as a Converter) */
export type LiquidityPoolPoolTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenPoolToken_Filter>;
};

/** Autogenerated for debugging - to be eventually deleted */
export type LiquidityPoolAdded = {
  __typename?: 'LiquidityPoolAdded';
  _liquidityPool: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type LiquidityPoolAdded_Filter = {
  _liquidityPool?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_contains?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _liquidityPool_not?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_not_contains?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum LiquidityPoolAdded_OrderBy {
  LiquidityPool = '_liquidityPool',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/** Autogenerated for debugging - to be eventually deleted */
export type LiquidityPoolRemoved = {
  __typename?: 'LiquidityPoolRemoved';
  _liquidityPool: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type LiquidityPoolRemoved_Filter = {
  _liquidityPool?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_contains?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _liquidityPool_not?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_not_contains?: InputMaybe<Scalars['Bytes']>;
  _liquidityPool_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum LiquidityPoolRemoved_OrderBy {
  LiquidityPool = '_liquidityPool',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/**
 * This entity stores the relationship between liquidity pools and underlying tokens
 * It also currently stores the total volumes bought and so
 */
export type LiquidityPoolToken = {
  __typename?: 'LiquidityPoolToken';
  /** ID is liquidityPool address + tokenAddress */
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  /** The pool token that represents this token-liquidityPool relationship */
  poolToken: PoolToken;
  token: Token;
  totalVolume: Scalars['BigDecimal'];
  volumeBought: Scalars['BigDecimal'];
  volumeSold: Scalars['BigDecimal'];
};

export type LiquidityPoolToken_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  poolToken?: InputMaybe<Scalars['String']>;
  poolToken_contains?: InputMaybe<Scalars['String']>;
  poolToken_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_gt?: InputMaybe<Scalars['String']>;
  poolToken_gte?: InputMaybe<Scalars['String']>;
  poolToken_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_lt?: InputMaybe<Scalars['String']>;
  poolToken_lte?: InputMaybe<Scalars['String']>;
  poolToken_not?: InputMaybe<Scalars['String']>;
  poolToken_not_contains?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_starts_with?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  totalVolume?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  totalVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeBought?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeBought_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeBought_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeSold?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_gt?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_gte?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  volumeSold_lt?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_lte?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_not?: InputMaybe<Scalars['BigDecimal']>;
  volumeSold_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
};

export enum LiquidityPoolToken_OrderBy {
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  PoolToken = 'poolToken',
  Token = 'token',
  TotalVolume = 'totalVolume',
  VolumeBought = 'volumeBought',
  VolumeSold = 'volumeSold',
}

export type LiquidityPool_Filter = {
  activated?: InputMaybe<Scalars['Boolean']>;
  activated_in?: InputMaybe<Array<Scalars['Boolean']>>;
  activated_not?: InputMaybe<Scalars['Boolean']>;
  activated_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  conversionFee?: InputMaybe<Scalars['BigInt']>;
  conversionFee_gt?: InputMaybe<Scalars['BigInt']>;
  conversionFee_gte?: InputMaybe<Scalars['BigInt']>;
  conversionFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  conversionFee_lt?: InputMaybe<Scalars['BigInt']>;
  conversionFee_lte?: InputMaybe<Scalars['BigInt']>;
  conversionFee_not?: InputMaybe<Scalars['BigInt']>;
  conversionFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTransaction?: InputMaybe<Scalars['String']>;
  createdAtTransaction_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_lt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_lte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastResetBlockNumber?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastResetBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  lastResetBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastResetTimestamp?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lastResetTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  lastResetTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxConversionFee?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_gt?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_gte?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_in?: InputMaybe<Array<Scalars['BigInt']>>;
  maxConversionFee_lt?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_lte?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_not?: InputMaybe<Scalars['BigInt']>;
  maxConversionFee_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  owner?: InputMaybe<Scalars['String']>;
  owner_contains?: InputMaybe<Scalars['String']>;
  owner_ends_with?: InputMaybe<Scalars['String']>;
  owner_gt?: InputMaybe<Scalars['String']>;
  owner_gte?: InputMaybe<Scalars['String']>;
  owner_in?: InputMaybe<Array<Scalars['String']>>;
  owner_lt?: InputMaybe<Scalars['String']>;
  owner_lte?: InputMaybe<Scalars['String']>;
  owner_not?: InputMaybe<Scalars['String']>;
  owner_not_contains?: InputMaybe<Scalars['String']>;
  owner_not_ends_with?: InputMaybe<Scalars['String']>;
  owner_not_in?: InputMaybe<Array<Scalars['String']>>;
  owner_not_starts_with?: InputMaybe<Scalars['String']>;
  owner_starts_with?: InputMaybe<Scalars['String']>;
  smartToken?: InputMaybe<Scalars['String']>;
  smartToken_contains?: InputMaybe<Scalars['String']>;
  smartToken_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_gt?: InputMaybe<Scalars['String']>;
  smartToken_gte?: InputMaybe<Scalars['String']>;
  smartToken_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_lt?: InputMaybe<Scalars['String']>;
  smartToken_lte?: InputMaybe<Scalars['String']>;
  smartToken_not?: InputMaybe<Scalars['String']>;
  smartToken_not_contains?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_not_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_starts_with?: InputMaybe<Scalars['String']>;
  token0?: InputMaybe<Scalars['String']>;
  token0_contains?: InputMaybe<Scalars['String']>;
  token0_ends_with?: InputMaybe<Scalars['String']>;
  token0_gt?: InputMaybe<Scalars['String']>;
  token0_gte?: InputMaybe<Scalars['String']>;
  token0_in?: InputMaybe<Array<Scalars['String']>>;
  token0_lt?: InputMaybe<Scalars['String']>;
  token0_lte?: InputMaybe<Scalars['String']>;
  token0_not?: InputMaybe<Scalars['String']>;
  token0_not_contains?: InputMaybe<Scalars['String']>;
  token0_not_ends_with?: InputMaybe<Scalars['String']>;
  token0_not_in?: InputMaybe<Array<Scalars['String']>>;
  token0_not_starts_with?: InputMaybe<Scalars['String']>;
  token0_starts_with?: InputMaybe<Scalars['String']>;
  token1?: InputMaybe<Scalars['String']>;
  token1_contains?: InputMaybe<Scalars['String']>;
  token1_ends_with?: InputMaybe<Scalars['String']>;
  token1_gt?: InputMaybe<Scalars['String']>;
  token1_gte?: InputMaybe<Scalars['String']>;
  token1_in?: InputMaybe<Array<Scalars['String']>>;
  token1_lt?: InputMaybe<Scalars['String']>;
  token1_lte?: InputMaybe<Scalars['String']>;
  token1_not?: InputMaybe<Scalars['String']>;
  token1_not_contains?: InputMaybe<Scalars['String']>;
  token1_not_ends_with?: InputMaybe<Scalars['String']>;
  token1_not_in?: InputMaybe<Array<Scalars['String']>>;
  token1_not_starts_with?: InputMaybe<Scalars['String']>;
  token1_starts_with?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<Scalars['Int']>;
  type_gt?: InputMaybe<Scalars['Int']>;
  type_gte?: InputMaybe<Scalars['Int']>;
  type_in?: InputMaybe<Array<Scalars['Int']>>;
  type_lt?: InputMaybe<Scalars['Int']>;
  type_lte?: InputMaybe<Scalars['Int']>;
  type_not?: InputMaybe<Scalars['Int']>;
  type_not_in?: InputMaybe<Array<Scalars['Int']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
  weight?: InputMaybe<Scalars['BigInt']>;
  weight_gt?: InputMaybe<Scalars['BigInt']>;
  weight_gte?: InputMaybe<Scalars['BigInt']>;
  weight_in?: InputMaybe<Array<Scalars['BigInt']>>;
  weight_lt?: InputMaybe<Scalars['BigInt']>;
  weight_lte?: InputMaybe<Scalars['BigInt']>;
  weight_not?: InputMaybe<Scalars['BigInt']>;
  weight_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum LiquidityPool_OrderBy {
  Activated = 'activated',
  ConnectorTokens = 'connectorTokens',
  ConversionFee = 'conversionFee',
  CreatedAtBlockNumber = 'createdAtBlockNumber',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTransaction = 'createdAtTransaction',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Id = 'id',
  LastResetBlockNumber = 'lastResetBlockNumber',
  LastResetTimestamp = 'lastResetTimestamp',
  MaxConversionFee = 'maxConversionFee',
  Owner = 'owner',
  PoolTokens = 'poolTokens',
  SmartToken = 'smartToken',
  Token0 = 'token0',
  Token1 = 'token1',
  Type = 'type',
  Version = 'version',
  Weight = 'weight',
}

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type Loan = {
  __typename?: 'Loan';
  /** Average price per token from all loan open events */
  averageBuyPrice: Scalars['BigDecimal'];
  /** Average price per token from all loan close events */
  averageSellPrice: Scalars['BigDecimal'];
  borrow?: Maybe<Array<Borrow>>;
  /** The amount borrowed in loan tokens */
  borrowedAmount: Scalars['BigDecimal'];
  closeWithSwaps?: Maybe<Array<CloseWithSwap>>;
  closewithDeposits?: Maybe<Array<CloseWithDeposit>>;
  collateralToken: Token;
  depositCollateral?: Maybe<Array<DepositCollateral>>;
  endTimestamp?: Maybe<Scalars['BigInt']>;
  id: Scalars['ID'];
  /** If a Liquidate, CloseWithSwap or CloseWithDeposit event occurs with 0 margin or 0 leverage, this property changes to false */
  isOpen: Scalars['Boolean'];
  liquidates?: Maybe<Array<Liquidate>>;
  loanToken: Token;
  maxBorrowedAmount: Scalars['BigDecimal'];
  /** The maximum this position size was - mainly for debugging purposes */
  maximumPositionSize: Scalars['BigDecimal'];
  /** Total of collateral (user collateral in a Borrow, and user collateral + borrowed amount in a Trade) in collateral tokens */
  positionSize: Scalars['BigDecimal'];
  /** The realized PnL is quoted in the collateral currency */
  realizedPnL: Scalars['BigDecimal'];
  realizedPnLPercent: Scalars['BigDecimal'];
  startBorrowedAmount: Scalars['BigDecimal'];
  /** Initial size of the position */
  startPositionSize: Scalars['BigDecimal'];
  /** The start rate of the loan in loan tokens (eg if it is a long USD/BTC margin trade, this is the BTC price in USD) */
  startRate: Scalars['BigDecimal'];
  startTimestamp: Scalars['BigInt'];
  /** Sum of position volume from Trade, Borrow and DepositCollateral events in this loan, in collateral token */
  totalBought: Scalars['BigDecimal'];
  /** Sum of position change volume from CloseWithSwap, CloseWithDeposit and Liquidate events in this loan, in collateral token */
  totalSold: Scalars['BigDecimal'];
  trade?: Maybe<Array<Trade>>;
  /** LoanType is either Trade (for Margin Trades) or Borrow (for Borrows) */
  type: LoanType;
  user: User;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanBorrowArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Borrow_Filter>;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanCloseWithSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanClosewithDepositsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanDepositCollateralArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<DepositCollateral_Filter>;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanLiquidatesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

/** A Loan can be initialized by either a Margin Trade event or a Borrow event */
export type LoanTradeArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

export enum LoanType {
  Borrow = 'Borrow',
  Trade = 'Trade',
}

export type Loan_Filter = {
  averageBuyPrice?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageBuyPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  averageBuyPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageSellPrice?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  averageSellPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  averageSellPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  borrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  borrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  collateralToken?: InputMaybe<Scalars['String']>;
  collateralToken_contains?: InputMaybe<Scalars['String']>;
  collateralToken_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_gt?: InputMaybe<Scalars['String']>;
  collateralToken_gte?: InputMaybe<Scalars['String']>;
  collateralToken_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_lt?: InputMaybe<Scalars['String']>;
  collateralToken_lte?: InputMaybe<Scalars['String']>;
  collateralToken_not?: InputMaybe<Scalars['String']>;
  collateralToken_not_contains?: InputMaybe<Scalars['String']>;
  collateralToken_not_ends_with?: InputMaybe<Scalars['String']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  collateralToken_not_starts_with?: InputMaybe<Scalars['String']>;
  collateralToken_starts_with?: InputMaybe<Scalars['String']>;
  endTimestamp?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  endTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isOpen?: InputMaybe<Scalars['Boolean']>;
  isOpen_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isOpen_not?: InputMaybe<Scalars['Boolean']>;
  isOpen_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  loanToken?: InputMaybe<Scalars['String']>;
  loanToken_contains?: InputMaybe<Scalars['String']>;
  loanToken_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_gt?: InputMaybe<Scalars['String']>;
  loanToken_gte?: InputMaybe<Scalars['String']>;
  loanToken_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_lt?: InputMaybe<Scalars['String']>;
  loanToken_lte?: InputMaybe<Scalars['String']>;
  loanToken_not?: InputMaybe<Scalars['String']>;
  loanToken_not_contains?: InputMaybe<Scalars['String']>;
  loanToken_not_ends_with?: InputMaybe<Scalars['String']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanToken_not_starts_with?: InputMaybe<Scalars['String']>;
  loanToken_starts_with?: InputMaybe<Scalars['String']>;
  maxBorrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maxBorrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  maxBorrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maximumPositionSize?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  maximumPositionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  maximumPositionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  positionSize?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  positionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  positionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_gt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_gte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnLPercent_lt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_lte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_not?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnLPercent_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL_gt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_gte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  realizedPnL_lt?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_lte?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_not?: InputMaybe<Scalars['BigDecimal']>;
  realizedPnL_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startBorrowedAmount?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startBorrowedAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  startBorrowedAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startPositionSize?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_gt?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_gte?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startPositionSize_lt?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_lte?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_not?: InputMaybe<Scalars['BigDecimal']>;
  startPositionSize_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startRate?: InputMaybe<Scalars['BigDecimal']>;
  startRate_gt?: InputMaybe<Scalars['BigDecimal']>;
  startRate_gte?: InputMaybe<Scalars['BigDecimal']>;
  startRate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startRate_lt?: InputMaybe<Scalars['BigDecimal']>;
  startRate_lte?: InputMaybe<Scalars['BigDecimal']>;
  startRate_not?: InputMaybe<Scalars['BigDecimal']>;
  startRate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  startTimestamp?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  startTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalBought?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBought_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBought_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSold?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalSold_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_not?: InputMaybe<Scalars['BigDecimal']>;
  totalSold_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  type?: InputMaybe<LoanType>;
  type_in?: InputMaybe<Array<LoanType>>;
  type_not?: InputMaybe<LoanType>;
  type_not_in?: InputMaybe<Array<LoanType>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Loan_OrderBy {
  AverageBuyPrice = 'averageBuyPrice',
  AverageSellPrice = 'averageSellPrice',
  Borrow = 'borrow',
  BorrowedAmount = 'borrowedAmount',
  CloseWithSwaps = 'closeWithSwaps',
  ClosewithDeposits = 'closewithDeposits',
  CollateralToken = 'collateralToken',
  DepositCollateral = 'depositCollateral',
  EndTimestamp = 'endTimestamp',
  Id = 'id',
  IsOpen = 'isOpen',
  Liquidates = 'liquidates',
  LoanToken = 'loanToken',
  MaxBorrowedAmount = 'maxBorrowedAmount',
  MaximumPositionSize = 'maximumPositionSize',
  PositionSize = 'positionSize',
  RealizedPnL = 'realizedPnL',
  RealizedPnLPercent = 'realizedPnLPercent',
  StartBorrowedAmount = 'startBorrowedAmount',
  StartPositionSize = 'startPositionSize',
  StartRate = 'startRate',
  StartTimestamp = 'startTimestamp',
  TotalBought = 'totalBought',
  TotalSold = 'totalSold',
  Trade = 'trade',
  Type = 'type',
  User = 'user',
}

export type NewConverter = {
  __typename?: 'NewConverter';
  _converter: Scalars['Bytes'];
  _owner: Scalars['Bytes'];
  _type: Scalars['Int'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type NewConverter_Filter = {
  _converter?: InputMaybe<Scalars['Bytes']>;
  _converter_contains?: InputMaybe<Scalars['Bytes']>;
  _converter_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _converter_not?: InputMaybe<Scalars['Bytes']>;
  _converter_not_contains?: InputMaybe<Scalars['Bytes']>;
  _converter_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _owner?: InputMaybe<Scalars['Bytes']>;
  _owner_contains?: InputMaybe<Scalars['Bytes']>;
  _owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _owner_not?: InputMaybe<Scalars['Bytes']>;
  _owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  _owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _type?: InputMaybe<Scalars['Int']>;
  _type_gt?: InputMaybe<Scalars['Int']>;
  _type_gte?: InputMaybe<Scalars['Int']>;
  _type_in?: InputMaybe<Array<Scalars['Int']>>;
  _type_lt?: InputMaybe<Scalars['Int']>;
  _type_lte?: InputMaybe<Scalars['Int']>;
  _type_not?: InputMaybe<Scalars['Int']>;
  _type_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum NewConverter_OrderBy {
  Converter = '_converter',
  Owner = '_owner',
  Type = '_type',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

/** Granular event data for the Loan entity. Emitted when a user Borrows and when a loan is rolled over */
export type PayBorrowingFee = {
  __typename?: 'PayBorrowingFee';
  amount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Loan;
  payer: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayBorrowingFee_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PayBorrowingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

/** Granular event data for the Loan entity. Emitted when a user Lends or Unlends and when a loan is rolled over */
export type PayLendingFee = {
  __typename?: 'PayLendingFee';
  amount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  payer: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayLendingFee_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PayLendingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

/** Granular event data for the Loan entity. Emitted when a user Margin Trades and when a loan is rolled over */
export type PayTradingFee = {
  __typename?: 'PayTradingFee';
  amount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  loanId: Loan;
  payer: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  token: Scalars['Bytes'];
  transaction: Transaction;
};

export type PayTradingFee_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  payer?: InputMaybe<Scalars['Bytes']>;
  payer_contains?: InputMaybe<Scalars['Bytes']>;
  payer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  payer_not?: InputMaybe<Scalars['Bytes']>;
  payer_not_contains?: InputMaybe<Scalars['Bytes']>;
  payer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['Bytes']>;
  token_contains?: InputMaybe<Scalars['Bytes']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']>>;
  token_not?: InputMaybe<Scalars['Bytes']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PayTradingFee_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LoanId = 'loanId',
  Payer = 'payer',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
}

/**
 * For the V1 pools, the pool token and smart token are the same. However, for V2
 * pools, there is one pool token per asset and only one smart token for the pool.
 */
export type PoolToken = {
  __typename?: 'PoolToken';
  converters?: Maybe<Array<LiquidityPoolToken>>;
  decimals?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  underlyingAssets?: Maybe<Array<TokenPoolToken>>;
};

/**
 * For the V1 pools, the pool token and smart token are the same. However, for V2
 * pools, there is one pool token per asset and only one smart token for the pool.
 */
export type PoolTokenConvertersArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

/**
 * For the V1 pools, the pool token and smart token are the same. However, for V2
 * pools, there is one pool token per asset and only one smart token for the pool.
 */
export type PoolTokenUnderlyingAssetsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenPoolToken_Filter>;
};

export type PoolToken_Filter = {
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
};

export enum PoolToken_OrderBy {
  Converters = 'converters',
  Decimals = 'decimals',
  Id = 'id',
  Name = 'name',
  Symbol = 'symbol',
  UnderlyingAssets = 'underlyingAssets',
}

export type Proposal = {
  __typename?: 'Proposal';
  canceled?: Maybe<Transaction>;
  countVotersAgainst: Scalars['BigInt'];
  countVotersFor: Scalars['BigInt'];
  created: Transaction;
  description: Scalars['String'];
  emittedBy: Scalars['Bytes'];
  endBlock: Scalars['BigInt'];
  executed?: Maybe<Transaction>;
  id: Scalars['ID'];
  proposalId: Scalars['BigInt'];
  proposer: Scalars['Bytes'];
  queued?: Maybe<Transaction>;
  signatures: Array<Scalars['String']>;
  startBlock: Scalars['BigInt'];
  targets: Array<Scalars['String']>;
  timestamp: Scalars['BigInt'];
  values: Array<Scalars['BigInt']>;
  votes?: Maybe<Array<VoteCast>>;
  votesAgainst: Scalars['BigInt'];
  votesFor: Scalars['BigInt'];
};

export type ProposalVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoteCast_Filter>;
};

export type Proposal_Filter = {
  canceled?: InputMaybe<Scalars['String']>;
  canceled_contains?: InputMaybe<Scalars['String']>;
  canceled_ends_with?: InputMaybe<Scalars['String']>;
  canceled_gt?: InputMaybe<Scalars['String']>;
  canceled_gte?: InputMaybe<Scalars['String']>;
  canceled_in?: InputMaybe<Array<Scalars['String']>>;
  canceled_lt?: InputMaybe<Scalars['String']>;
  canceled_lte?: InputMaybe<Scalars['String']>;
  canceled_not?: InputMaybe<Scalars['String']>;
  canceled_not_contains?: InputMaybe<Scalars['String']>;
  canceled_not_ends_with?: InputMaybe<Scalars['String']>;
  canceled_not_in?: InputMaybe<Array<Scalars['String']>>;
  canceled_not_starts_with?: InputMaybe<Scalars['String']>;
  canceled_starts_with?: InputMaybe<Scalars['String']>;
  countVotersAgainst?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_gt?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_gte?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_in?: InputMaybe<Array<Scalars['BigInt']>>;
  countVotersAgainst_lt?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_lte?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_not?: InputMaybe<Scalars['BigInt']>;
  countVotersAgainst_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  countVotersFor?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_gt?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_gte?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_in?: InputMaybe<Array<Scalars['BigInt']>>;
  countVotersFor_lt?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_lte?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_not?: InputMaybe<Scalars['BigInt']>;
  countVotersFor_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  created?: InputMaybe<Scalars['String']>;
  created_contains?: InputMaybe<Scalars['String']>;
  created_ends_with?: InputMaybe<Scalars['String']>;
  created_gt?: InputMaybe<Scalars['String']>;
  created_gte?: InputMaybe<Scalars['String']>;
  created_in?: InputMaybe<Array<Scalars['String']>>;
  created_lt?: InputMaybe<Scalars['String']>;
  created_lte?: InputMaybe<Scalars['String']>;
  created_not?: InputMaybe<Scalars['String']>;
  created_not_contains?: InputMaybe<Scalars['String']>;
  created_not_ends_with?: InputMaybe<Scalars['String']>;
  created_not_in?: InputMaybe<Array<Scalars['String']>>;
  created_not_starts_with?: InputMaybe<Scalars['String']>;
  created_starts_with?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  description_contains?: InputMaybe<Scalars['String']>;
  description_ends_with?: InputMaybe<Scalars['String']>;
  description_gt?: InputMaybe<Scalars['String']>;
  description_gte?: InputMaybe<Scalars['String']>;
  description_in?: InputMaybe<Array<Scalars['String']>>;
  description_lt?: InputMaybe<Scalars['String']>;
  description_lte?: InputMaybe<Scalars['String']>;
  description_not?: InputMaybe<Scalars['String']>;
  description_not_contains?: InputMaybe<Scalars['String']>;
  description_not_ends_with?: InputMaybe<Scalars['String']>;
  description_not_in?: InputMaybe<Array<Scalars['String']>>;
  description_not_starts_with?: InputMaybe<Scalars['String']>;
  description_starts_with?: InputMaybe<Scalars['String']>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  endBlock?: InputMaybe<Scalars['BigInt']>;
  endBlock_gt?: InputMaybe<Scalars['BigInt']>;
  endBlock_gte?: InputMaybe<Scalars['BigInt']>;
  endBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  endBlock_lt?: InputMaybe<Scalars['BigInt']>;
  endBlock_lte?: InputMaybe<Scalars['BigInt']>;
  endBlock_not?: InputMaybe<Scalars['BigInt']>;
  endBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  executed?: InputMaybe<Scalars['String']>;
  executed_contains?: InputMaybe<Scalars['String']>;
  executed_ends_with?: InputMaybe<Scalars['String']>;
  executed_gt?: InputMaybe<Scalars['String']>;
  executed_gte?: InputMaybe<Scalars['String']>;
  executed_in?: InputMaybe<Array<Scalars['String']>>;
  executed_lt?: InputMaybe<Scalars['String']>;
  executed_lte?: InputMaybe<Scalars['String']>;
  executed_not?: InputMaybe<Scalars['String']>;
  executed_not_contains?: InputMaybe<Scalars['String']>;
  executed_not_ends_with?: InputMaybe<Scalars['String']>;
  executed_not_in?: InputMaybe<Array<Scalars['String']>>;
  executed_not_starts_with?: InputMaybe<Scalars['String']>;
  executed_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposalId?: InputMaybe<Scalars['BigInt']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposer?: InputMaybe<Scalars['Bytes']>;
  proposer_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_in?: InputMaybe<Array<Scalars['Bytes']>>;
  proposer_not?: InputMaybe<Scalars['Bytes']>;
  proposer_not_contains?: InputMaybe<Scalars['Bytes']>;
  proposer_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  queued?: InputMaybe<Scalars['String']>;
  queued_contains?: InputMaybe<Scalars['String']>;
  queued_ends_with?: InputMaybe<Scalars['String']>;
  queued_gt?: InputMaybe<Scalars['String']>;
  queued_gte?: InputMaybe<Scalars['String']>;
  queued_in?: InputMaybe<Array<Scalars['String']>>;
  queued_lt?: InputMaybe<Scalars['String']>;
  queued_lte?: InputMaybe<Scalars['String']>;
  queued_not?: InputMaybe<Scalars['String']>;
  queued_not_contains?: InputMaybe<Scalars['String']>;
  queued_not_ends_with?: InputMaybe<Scalars['String']>;
  queued_not_in?: InputMaybe<Array<Scalars['String']>>;
  queued_not_starts_with?: InputMaybe<Scalars['String']>;
  queued_starts_with?: InputMaybe<Scalars['String']>;
  signatures?: InputMaybe<Array<Scalars['String']>>;
  signatures_contains?: InputMaybe<Array<Scalars['String']>>;
  signatures_not?: InputMaybe<Array<Scalars['String']>>;
  signatures_not_contains?: InputMaybe<Array<Scalars['String']>>;
  startBlock?: InputMaybe<Scalars['BigInt']>;
  startBlock_gt?: InputMaybe<Scalars['BigInt']>;
  startBlock_gte?: InputMaybe<Scalars['BigInt']>;
  startBlock_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startBlock_lt?: InputMaybe<Scalars['BigInt']>;
  startBlock_lte?: InputMaybe<Scalars['BigInt']>;
  startBlock_not?: InputMaybe<Scalars['BigInt']>;
  startBlock_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  targets?: InputMaybe<Array<Scalars['String']>>;
  targets_contains?: InputMaybe<Array<Scalars['String']>>;
  targets_not?: InputMaybe<Array<Scalars['String']>>;
  targets_not_contains?: InputMaybe<Array<Scalars['String']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  values?: InputMaybe<Array<Scalars['BigInt']>>;
  values_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  values_not?: InputMaybe<Array<Scalars['BigInt']>>;
  values_not_contains?: InputMaybe<Array<Scalars['BigInt']>>;
  votesAgainst?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_gt?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_gte?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesAgainst_lt?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_lte?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_not?: InputMaybe<Scalars['BigInt']>;
  votesAgainst_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesFor?: InputMaybe<Scalars['BigInt']>;
  votesFor_gt?: InputMaybe<Scalars['BigInt']>;
  votesFor_gte?: InputMaybe<Scalars['BigInt']>;
  votesFor_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votesFor_lt?: InputMaybe<Scalars['BigInt']>;
  votesFor_lte?: InputMaybe<Scalars['BigInt']>;
  votesFor_not?: InputMaybe<Scalars['BigInt']>;
  votesFor_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Proposal_OrderBy {
  Canceled = 'canceled',
  CountVotersAgainst = 'countVotersAgainst',
  CountVotersFor = 'countVotersFor',
  Created = 'created',
  Description = 'description',
  EmittedBy = 'emittedBy',
  EndBlock = 'endBlock',
  Executed = 'executed',
  Id = 'id',
  ProposalId = 'proposalId',
  Proposer = 'proposer',
  Queued = 'queued',
  Signatures = 'signatures',
  StartBlock = 'startBlock',
  Targets = 'targets',
  Timestamp = 'timestamp',
  Values = 'values',
  Votes = 'votes',
  VotesAgainst = 'votesAgainst',
  VotesFor = 'votesFor',
}

/**
 * This entity will have only one instance and will be used to store protocol-wide
 * data like list of tokens and number or users.
 * The ID of this one entity is "0"
 */
export type ProtocolStats = {
  __typename?: 'ProtocolStats';
  btcUsdPrice: Scalars['BigDecimal'];
  /** Only one entity should be created, with ID "0" */
  id: Scalars['ID'];
  /** An array of all tokens in the protocol */
  tokens: Array<Token>;
  /** Total volume of fees earned by liquidity providers to AMM pools (in usd) */
  totalAmmLpFeesUsd: Scalars['BigDecimal'];
  /**
   * Total volume of fees earned by SOV stakers from AMM conversion events (in
   * usd). These fees began after the fee-sharing SIP was executed.
   */
  totalAmmStakerFeesUsd: Scalars['BigDecimal'];
  /** Total volume that has passed through every AMM pool of the Sovryn protocol (in usd) */
  totalAmmVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total of collateral property in Trade event (in usd). This may be changed to
   * borrowed amount volume, but collateral keeps it consistent with margin trading
   */
  totalBorrowVolumeUsd: Scalars['BigDecimal'];
  /** Total fees from Borrowing earned by SOV stakers (in usd) */
  totalBorrowingFeesUsd: Scalars['BigDecimal'];
  /** Total volume of Borrows closed (in usd) */
  totalCloseWithDepositVolumeUsd: Scalars['BigDecimal'];
  /** Total position volume closed for Margin Trades (in usd) */
  totalCloseWithSwapVolumeUsd: Scalars['BigDecimal'];
  /** Total additional collateral deposited for Margin Trades and Borrows (in usd) */
  totalDepositCollateralVolumeUsd: Scalars['BigDecimal'];
  /** Total volume supplied to Lending Pools over all time (in usd) */
  totalLendVolumeUsd: Scalars['BigDecimal'];
  /** Total fees from Lending and Unlending earned by SOV stakers (in usd) */
  totalLendingFeesUsd: Scalars['BigDecimal'];
  /** Total Margin Trade and Borrow position size that has been liquidated (in usd) */
  totalLiquidateVolumeUsd: Scalars['BigDecimal'];
  /** Total of positionSize property in Trade event (in usd). This includes user collateral and borrowed amount */
  totalMarginTradeVolumeUsd: Scalars['BigDecimal'];
  /**
   * This is SOV staked by vesting contracts. It in incremented when the contracts
   * stake the tokens, and decremented when users claim their unlocked tokens
   */
  totalStakedByVestingSov: Scalars['BigInt'];
  /** Total fees from Margin Trading earned by SOV stakers (in usd) */
  totalTradingFeesUsd: Scalars['BigDecimal'];
  /**
   * NOT YET IMPLEMENTED: This will be a total of volumes of all transaction types
   * (AMM Swaps, Margin Trades, CloseWithSwap etc etc)
   */
  totalTransactedVolumeUsd: Scalars['BigInt'];
  /** Total volume withdrawn from Lending Pool over all time (in usd) */
  totalUnlendVolumeUsd: Scalars['BigDecimal'];
  /**
   * Total number of users of the protocol. This number is incremented each time a
   * user initiates a transaction with the Protocol.
   * Currently this is incremented by specific user actions, but could be incremented on a per Transaction basis.
   */
  totalUsers: Scalars['BigInt'];
  /**
   * This is SOV staked by users (not vesting contracts). It is incremented when
   * users stake tokens, and decremented when users withdraw tokens from the
   * staking contract
   */
  totalVoluntarilyStakedSov: Scalars['BigInt'];
  usdStablecoin: Token;
};

/**
 * This entity will have only one instance and will be used to store protocol-wide
 * data like list of tokens and number or users.
 * The ID of this one entity is "0"
 */
export type ProtocolStatsTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Token_Filter>;
};

export type ProtocolStats_Filter = {
  btcUsdPrice?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_gt?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_gte?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  btcUsdPrice_lt?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_lte?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_not?: InputMaybe<Scalars['BigDecimal']>;
  btcUsdPrice_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  tokens?: InputMaybe<Array<Scalars['String']>>;
  tokens_contains?: InputMaybe<Array<Scalars['String']>>;
  tokens_not?: InputMaybe<Array<Scalars['String']>>;
  tokens_not_contains?: InputMaybe<Array<Scalars['String']>>;
  totalAmmLpFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmLpFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalCloseWithSwapVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithSwapVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalLendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalStakedByVestingSov?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_gt?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_gte?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStakedByVestingSov_lt?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_lte?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_not?: InputMaybe<Scalars['BigInt']>;
  totalStakedByVestingSov_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalTradingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTransactedVolumeUsd?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_gt?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_gte?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalTransactedVolumeUsd_lt?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_lte?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_not?: InputMaybe<Scalars['BigInt']>;
  totalTransactedVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUnlendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUsers?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_gte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUsers_lt?: InputMaybe<Scalars['BigInt']>;
  totalUsers_lte?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not?: InputMaybe<Scalars['BigInt']>;
  totalUsers_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVoluntarilyStakedSov?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_gt?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_gte?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalVoluntarilyStakedSov_lt?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_lte?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_not?: InputMaybe<Scalars['BigInt']>;
  totalVoluntarilyStakedSov_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  usdStablecoin?: InputMaybe<Scalars['String']>;
  usdStablecoin_contains?: InputMaybe<Scalars['String']>;
  usdStablecoin_ends_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_gt?: InputMaybe<Scalars['String']>;
  usdStablecoin_gte?: InputMaybe<Scalars['String']>;
  usdStablecoin_in?: InputMaybe<Array<Scalars['String']>>;
  usdStablecoin_lt?: InputMaybe<Scalars['String']>;
  usdStablecoin_lte?: InputMaybe<Scalars['String']>;
  usdStablecoin_not?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_contains?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_ends_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_not_in?: InputMaybe<Array<Scalars['String']>>;
  usdStablecoin_not_starts_with?: InputMaybe<Scalars['String']>;
  usdStablecoin_starts_with?: InputMaybe<Scalars['String']>;
};

export enum ProtocolStats_OrderBy {
  BtcUsdPrice = 'btcUsdPrice',
  Id = 'id',
  Tokens = 'tokens',
  TotalAmmLpFeesUsd = 'totalAmmLpFeesUsd',
  TotalAmmStakerFeesUsd = 'totalAmmStakerFeesUsd',
  TotalAmmVolumeUsd = 'totalAmmVolumeUsd',
  TotalBorrowVolumeUsd = 'totalBorrowVolumeUsd',
  TotalBorrowingFeesUsd = 'totalBorrowingFeesUsd',
  TotalCloseWithDepositVolumeUsd = 'totalCloseWithDepositVolumeUsd',
  TotalCloseWithSwapVolumeUsd = 'totalCloseWithSwapVolumeUsd',
  TotalDepositCollateralVolumeUsd = 'totalDepositCollateralVolumeUsd',
  TotalLendVolumeUsd = 'totalLendVolumeUsd',
  TotalLendingFeesUsd = 'totalLendingFeesUsd',
  TotalLiquidateVolumeUsd = 'totalLiquidateVolumeUsd',
  TotalMarginTradeVolumeUsd = 'totalMarginTradeVolumeUsd',
  TotalStakedByVestingSov = 'totalStakedByVestingSov',
  TotalTradingFeesUsd = 'totalTradingFeesUsd',
  TotalTransactedVolumeUsd = 'totalTransactedVolumeUsd',
  TotalUnlendVolumeUsd = 'totalUnlendVolumeUsd',
  TotalUsers = 'totalUsers',
  TotalVoluntarilyStakedSov = 'totalVoluntarilyStakedSov',
  UsdStablecoin = 'usdStablecoin',
}

export type Query = {
  __typename?: 'Query';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  borrow?: Maybe<Borrow>;
  borrows: Array<Borrow>;
  candleStick?: Maybe<CandleStick>;
  candleSticks: Array<CandleStick>;
  closeWithDeposit?: Maybe<CloseWithDeposit>;
  closeWithDeposits: Array<CloseWithDeposit>;
  closeWithSwap?: Maybe<CloseWithSwap>;
  closeWithSwaps: Array<CloseWithSwap>;
  conversion?: Maybe<Conversion>;
  conversions: Array<Conversion>;
  converterRegistries: Array<ConverterRegistry>;
  converterRegistry?: Maybe<ConverterRegistry>;
  depositCollateral?: Maybe<DepositCollateral>;
  depositCollaterals: Array<DepositCollateral>;
  feeSharingTokensTransferred?: Maybe<FeeSharingTokensTransferred>;
  feeSharingTokensTransferreds: Array<FeeSharingTokensTransferred>;
  lendingHistoryItem?: Maybe<LendingHistoryItem>;
  lendingHistoryItems: Array<LendingHistoryItem>;
  lendingPool?: Maybe<LendingPool>;
  lendingPools: Array<LendingPool>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityHistoryItem?: Maybe<LiquidityHistoryItem>;
  liquidityHistoryItems: Array<LiquidityHistoryItem>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolAdded?: Maybe<LiquidityPoolAdded>;
  liquidityPoolAddeds: Array<LiquidityPoolAdded>;
  liquidityPoolRemoved?: Maybe<LiquidityPoolRemoved>;
  liquidityPoolRemoveds: Array<LiquidityPoolRemoved>;
  liquidityPoolToken?: Maybe<LiquidityPoolToken>;
  liquidityPoolTokens: Array<LiquidityPoolToken>;
  liquidityPools: Array<LiquidityPool>;
  loan?: Maybe<Loan>;
  loans: Array<Loan>;
  newConverter?: Maybe<NewConverter>;
  newConverters: Array<NewConverter>;
  payBorrowingFee?: Maybe<PayBorrowingFee>;
  payBorrowingFees: Array<PayBorrowingFee>;
  payLendingFee?: Maybe<PayLendingFee>;
  payLendingFees: Array<PayLendingFee>;
  payTradingFee?: Maybe<PayTradingFee>;
  payTradingFees: Array<PayTradingFee>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  protocolStats: Array<ProtocolStats>;
  rewardsEarnedHistoryItem?: Maybe<RewardsEarnedHistoryItem>;
  rewardsEarnedHistoryItems: Array<RewardsEarnedHistoryItem>;
  smartToken?: Maybe<SmartToken>;
  smartTokenAdded?: Maybe<SmartTokenAdded>;
  smartTokenAddeds: Array<SmartTokenAdded>;
  smartTokenRemoved?: Maybe<SmartTokenRemoved>;
  smartTokenRemoveds: Array<SmartTokenRemoved>;
  smartTokens: Array<SmartToken>;
  stakeHistoryItem?: Maybe<StakeHistoryItem>;
  stakeHistoryItems: Array<StakeHistoryItem>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenPoolToken?: Maybe<TokenPoolToken>;
  tokenPoolTokens: Array<TokenPoolToken>;
  tokenSmartToken?: Maybe<TokenSmartToken>;
  tokenSmartTokens: Array<TokenSmartToken>;
  tokens: Array<Token>;
  tokensStaked?: Maybe<TokensStaked>;
  tokensStakeds: Array<TokensStaked>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userLendingHistories: Array<UserLendingHistory>;
  userLendingHistory?: Maybe<UserLendingHistory>;
  userLiquidityHistories: Array<UserLiquidityHistory>;
  userLiquidityHistory?: Maybe<UserLiquidityHistory>;
  userRewardsEarnedHistories: Array<UserRewardsEarnedHistory>;
  userRewardsEarnedHistory?: Maybe<UserRewardsEarnedHistory>;
  userStakeHistories: Array<UserStakeHistory>;
  userStakeHistory?: Maybe<UserStakeHistory>;
  userTotal?: Maybe<UserTotal>;
  userTotals: Array<UserTotal>;
  users: Array<User>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vestingHistoryItem?: Maybe<VestingHistoryItem>;
  vestingHistoryItems: Array<VestingHistoryItem>;
  voteCast?: Maybe<VoteCast>;
  voteCasts: Array<VoteCast>;
};

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type QueryBorrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryBorrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Borrow_Filter>;
};

export type QueryCandleStickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCandleSticksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStick_Filter>;
};

export type QueryCloseWithDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCloseWithDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

export type QueryCloseWithSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryCloseWithSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

export type QueryConversionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryConversionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conversion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Conversion_Filter>;
};

export type QueryConverterRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConverterRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConverterRegistry_Filter>;
};

export type QueryConverterRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryDepositCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositCollateral_Filter>;
};

export type QueryFeeSharingTokensTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryFeeSharingTokensTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeSharingTokensTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeSharingTokensTransferred_Filter>;
};

export type QueryLendingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLendingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type QueryLendingPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLendingPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingPool_Filter>;
};

export type QueryLiquidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidate_Filter>;
};

export type QueryLiquidityHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type QueryLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolAdded_Filter>;
};

export type QueryLiquidityPoolRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolRemoved_Filter>;
};

export type QueryLiquidityPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLiquidityPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

export type QueryLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPool_Filter>;
};

export type QueryLoanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryLoansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Loan_Filter>;
};

export type QueryNewConverterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryNewConvertersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NewConverter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewConverter_Filter>;
};

export type QueryPayBorrowingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayBorrowingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayBorrowingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayBorrowingFee_Filter>;
};

export type QueryPayLendingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayLendingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayLendingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayLendingFee_Filter>;
};

export type QueryPayTradingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPayTradingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayTradingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayTradingFee_Filter>;
};

export type QueryPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type QueryProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type QueryProtocolStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolStats_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolStats_Filter>;
};

export type QueryRewardsEarnedHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryRewardsEarnedHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type QuerySmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySmartTokenAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySmartTokenAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartTokenAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartTokenAdded_Filter>;
};

export type QuerySmartTokenRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySmartTokenRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartTokenRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartTokenRemoved_Filter>;
};

export type QuerySmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartToken_Filter>;
};

export type QueryStakeHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryStakeHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type QuerySwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QuerySwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPoolToken_Filter>;
};

export type QueryTokenSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokenSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type QueryTokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensStaked_Filter>;
};

export type QueryTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};

export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

export type QueryUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserLendingHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

export type QueryUserLendingHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserLiquidityHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

export type QueryUserLiquidityHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserRewardsEarnedHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

export type QueryUserRewardsEarnedHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserStakeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

export type QueryUserStakeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryUserTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTotal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTotal_Filter>;
};

export type QueryUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type QueryVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type QueryVestingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVestingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export type QueryVoteCastArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryVoteCastsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteCast_Filter>;
};

export enum RewardsEarnedAction {
  EarnReward = 'EarnReward',
  RewardClaimed = 'RewardClaimed',
  RewardSovStaked = 'RewardSovStaked',
  StakingRewardWithdrawn = 'StakingRewardWithdrawn',
}

export type RewardsEarnedHistoryItem = {
  __typename?: 'RewardsEarnedHistoryItem';
  action: RewardsEarnedAction;
  amount: Scalars['BigInt'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  token?: Maybe<Token>;
  transaction: Transaction;
  user: UserRewardsEarnedHistory;
};

export type RewardsEarnedHistoryItem_Filter = {
  action?: InputMaybe<RewardsEarnedAction>;
  action_in?: InputMaybe<Array<RewardsEarnedAction>>;
  action_not?: InputMaybe<RewardsEarnedAction>;
  action_not_in?: InputMaybe<Array<RewardsEarnedAction>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum RewardsEarnedHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  Id = 'id',
  Timestamp = 'timestamp',
  Token = 'token',
  Transaction = 'transaction',
  User = 'user',
}

/**
 * The smart token represents a single reserve asset on a single pool.
 * For V1 pools, there is 1 smart token representing both reserve assets. For V2
 * pools, there are 2 smart tokens, one for each reserve asset.
 */
export type SmartToken = {
  __typename?: 'SmartToken';
  addedToRegistryBlockNumber?: Maybe<Scalars['BigInt']>;
  addedToRegistryTransactionHash?: Maybe<Scalars['Bytes']>;
  /**
   * connectorTokens are the entity that holds the many-to-many relationship
   * between the underlying token asset and the smart token
   */
  connectorTokens?: Maybe<Array<TokenSmartToken>>;
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  decimals?: Maybe<Scalars['Int']>;
  /** ID is smart token address */
  id: Scalars['ID'];
  /** The AMM pool this smart token "belongs" to */
  liquidityPool: LiquidityPool;
  name?: Maybe<Scalars['String']>;
  owner: Scalars['Bytes'];
  /** smartTokenType can be Relay or Liquid */
  smartTokenType?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  transfersEnabled?: Maybe<Scalars['Boolean']>;
  version?: Maybe<Scalars['Int']>;
};

/**
 * The smart token represents a single reserve asset on a single pool.
 * For V1 pools, there is 1 smart token representing both reserve assets. For V2
 * pools, there are 2 smart tokens, one for each reserve asset.
 */
export type SmartTokenConnectorTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

/** Autogenerated for debugging - to be eventually deleted */
export type SmartTokenAdded = {
  __typename?: 'SmartTokenAdded';
  _smartToken: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type SmartTokenAdded_Filter = {
  _smartToken?: InputMaybe<Scalars['Bytes']>;
  _smartToken_contains?: InputMaybe<Scalars['Bytes']>;
  _smartToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _smartToken_not?: InputMaybe<Scalars['Bytes']>;
  _smartToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  _smartToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum SmartTokenAdded_OrderBy {
  SmartToken = '_smartToken',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

/** Autogenerated for debugging - to be eventually deleted */
export type SmartTokenRemoved = {
  __typename?: 'SmartTokenRemoved';
  _smartToken: Scalars['Bytes'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
};

export type SmartTokenRemoved_Filter = {
  _smartToken?: InputMaybe<Scalars['Bytes']>;
  _smartToken_contains?: InputMaybe<Scalars['Bytes']>;
  _smartToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  _smartToken_not?: InputMaybe<Scalars['Bytes']>;
  _smartToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  _smartToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum SmartTokenRemoved_OrderBy {
  SmartToken = '_smartToken',
  EmittedBy = 'emittedBy',
  Id = 'id',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
}

export type SmartToken_Filter = {
  addedToRegistryBlockNumber?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedToRegistryBlockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_not?: InputMaybe<Scalars['BigInt']>;
  addedToRegistryBlockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  addedToRegistryTransactionHash?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_contains?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_in?: InputMaybe<Array<Scalars['Bytes']>>;
  addedToRegistryTransactionHash_not?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_not_contains?: InputMaybe<Scalars['Bytes']>;
  addedToRegistryTransactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['Bytes']>;
  owner_contains?: InputMaybe<Scalars['Bytes']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']>>;
  owner_not?: InputMaybe<Scalars['Bytes']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  smartTokenType?: InputMaybe<Scalars['String']>;
  smartTokenType_contains?: InputMaybe<Scalars['String']>;
  smartTokenType_ends_with?: InputMaybe<Scalars['String']>;
  smartTokenType_gt?: InputMaybe<Scalars['String']>;
  smartTokenType_gte?: InputMaybe<Scalars['String']>;
  smartTokenType_in?: InputMaybe<Array<Scalars['String']>>;
  smartTokenType_lt?: InputMaybe<Scalars['String']>;
  smartTokenType_lte?: InputMaybe<Scalars['String']>;
  smartTokenType_not?: InputMaybe<Scalars['String']>;
  smartTokenType_not_contains?: InputMaybe<Scalars['String']>;
  smartTokenType_not_ends_with?: InputMaybe<Scalars['String']>;
  smartTokenType_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartTokenType_not_starts_with?: InputMaybe<Scalars['String']>;
  smartTokenType_starts_with?: InputMaybe<Scalars['String']>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  transfersEnabled?: InputMaybe<Scalars['Boolean']>;
  transfersEnabled_in?: InputMaybe<Array<Scalars['Boolean']>>;
  transfersEnabled_not?: InputMaybe<Scalars['Boolean']>;
  transfersEnabled_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum SmartToken_OrderBy {
  AddedToRegistryBlockNumber = 'addedToRegistryBlockNumber',
  AddedToRegistryTransactionHash = 'addedToRegistryTransactionHash',
  ConnectorTokens = 'connectorTokens',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Decimals = 'decimals',
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  Name = 'name',
  Owner = 'owner',
  SmartTokenType = 'smartTokenType',
  Symbol = 'symbol',
  TransfersEnabled = 'transfersEnabled',
  Version = 'version',
}

export enum StakeHistoryAction {
  Delegate = 'Delegate',
  ExtendStake = 'ExtendStake',
  FeeWithdrawn = 'FeeWithdrawn',
  IncreaseStake = 'IncreaseStake',
  Stake = 'Stake',
  Unstake = 'Unstake',
  WithdrawStaked = 'WithdrawStaked',
}

export type StakeHistoryItem = {
  __typename?: 'StakeHistoryItem';
  action: StakeHistoryAction;
  amount?: Maybe<Scalars['BigInt']>;
  id: Scalars['ID'];
  lockedUntil?: Maybe<Scalars['BigInt']>;
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: UserStakeHistory;
};

export type StakeHistoryItem_Filter = {
  action?: InputMaybe<StakeHistoryAction>;
  action_in?: InputMaybe<Array<StakeHistoryAction>>;
  action_not?: InputMaybe<StakeHistoryAction>;
  action_not_in?: InputMaybe<Array<StakeHistoryAction>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedUntil_lt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_lte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum StakeHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

export type Subscription = {
  __typename?: 'Subscription';
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
  borrow?: Maybe<Borrow>;
  borrows: Array<Borrow>;
  candleStick?: Maybe<CandleStick>;
  candleSticks: Array<CandleStick>;
  closeWithDeposit?: Maybe<CloseWithDeposit>;
  closeWithDeposits: Array<CloseWithDeposit>;
  closeWithSwap?: Maybe<CloseWithSwap>;
  closeWithSwaps: Array<CloseWithSwap>;
  conversion?: Maybe<Conversion>;
  conversions: Array<Conversion>;
  converterRegistries: Array<ConverterRegistry>;
  converterRegistry?: Maybe<ConverterRegistry>;
  depositCollateral?: Maybe<DepositCollateral>;
  depositCollaterals: Array<DepositCollateral>;
  feeSharingTokensTransferred?: Maybe<FeeSharingTokensTransferred>;
  feeSharingTokensTransferreds: Array<FeeSharingTokensTransferred>;
  lendingHistoryItem?: Maybe<LendingHistoryItem>;
  lendingHistoryItems: Array<LendingHistoryItem>;
  lendingPool?: Maybe<LendingPool>;
  lendingPools: Array<LendingPool>;
  liquidate?: Maybe<Liquidate>;
  liquidates: Array<Liquidate>;
  liquidityHistoryItem?: Maybe<LiquidityHistoryItem>;
  liquidityHistoryItems: Array<LiquidityHistoryItem>;
  liquidityPool?: Maybe<LiquidityPool>;
  liquidityPoolAdded?: Maybe<LiquidityPoolAdded>;
  liquidityPoolAddeds: Array<LiquidityPoolAdded>;
  liquidityPoolRemoved?: Maybe<LiquidityPoolRemoved>;
  liquidityPoolRemoveds: Array<LiquidityPoolRemoved>;
  liquidityPoolToken?: Maybe<LiquidityPoolToken>;
  liquidityPoolTokens: Array<LiquidityPoolToken>;
  liquidityPools: Array<LiquidityPool>;
  loan?: Maybe<Loan>;
  loans: Array<Loan>;
  newConverter?: Maybe<NewConverter>;
  newConverters: Array<NewConverter>;
  payBorrowingFee?: Maybe<PayBorrowingFee>;
  payBorrowingFees: Array<PayBorrowingFee>;
  payLendingFee?: Maybe<PayLendingFee>;
  payLendingFees: Array<PayLendingFee>;
  payTradingFee?: Maybe<PayTradingFee>;
  payTradingFees: Array<PayTradingFee>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  proposal?: Maybe<Proposal>;
  proposals: Array<Proposal>;
  protocolStats: Array<ProtocolStats>;
  rewardsEarnedHistoryItem?: Maybe<RewardsEarnedHistoryItem>;
  rewardsEarnedHistoryItems: Array<RewardsEarnedHistoryItem>;
  smartToken?: Maybe<SmartToken>;
  smartTokenAdded?: Maybe<SmartTokenAdded>;
  smartTokenAddeds: Array<SmartTokenAdded>;
  smartTokenRemoved?: Maybe<SmartTokenRemoved>;
  smartTokenRemoveds: Array<SmartTokenRemoved>;
  smartTokens: Array<SmartToken>;
  stakeHistoryItem?: Maybe<StakeHistoryItem>;
  stakeHistoryItems: Array<StakeHistoryItem>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  token?: Maybe<Token>;
  tokenPoolToken?: Maybe<TokenPoolToken>;
  tokenPoolTokens: Array<TokenPoolToken>;
  tokenSmartToken?: Maybe<TokenSmartToken>;
  tokenSmartTokens: Array<TokenSmartToken>;
  tokens: Array<Token>;
  tokensStaked?: Maybe<TokensStaked>;
  tokensStakeds: Array<TokensStaked>;
  trade?: Maybe<Trade>;
  trades: Array<Trade>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  user?: Maybe<User>;
  userLendingHistories: Array<UserLendingHistory>;
  userLendingHistory?: Maybe<UserLendingHistory>;
  userLiquidityHistories: Array<UserLiquidityHistory>;
  userLiquidityHistory?: Maybe<UserLiquidityHistory>;
  userRewardsEarnedHistories: Array<UserRewardsEarnedHistory>;
  userRewardsEarnedHistory?: Maybe<UserRewardsEarnedHistory>;
  userStakeHistories: Array<UserStakeHistory>;
  userStakeHistory?: Maybe<UserStakeHistory>;
  userTotal?: Maybe<UserTotal>;
  userTotals: Array<UserTotal>;
  users: Array<User>;
  vestingContract?: Maybe<VestingContract>;
  vestingContracts: Array<VestingContract>;
  vestingHistoryItem?: Maybe<VestingHistoryItem>;
  vestingHistoryItems: Array<VestingHistoryItem>;
  voteCast?: Maybe<VoteCast>;
  voteCasts: Array<VoteCast>;
};

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>;
};

export type SubscriptionBorrowArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionBorrowsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Borrow_Filter>;
};

export type SubscriptionCandleStickArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCandleSticksArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CandleStick_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CandleStick_Filter>;
};

export type SubscriptionCloseWithDepositArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCloseWithDepositsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithDeposit_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithDeposit_Filter>;
};

export type SubscriptionCloseWithSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionCloseWithSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<CloseWithSwap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<CloseWithSwap_Filter>;
};

export type SubscriptionConversionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionConversionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conversion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Conversion_Filter>;
};

export type SubscriptionConverterRegistriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ConverterRegistry_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ConverterRegistry_Filter>;
};

export type SubscriptionConverterRegistryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositCollateralArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionDepositCollateralsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<DepositCollateral_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<DepositCollateral_Filter>;
};

export type SubscriptionFeeSharingTokensTransferredArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionFeeSharingTokensTransferredsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<FeeSharingTokensTransferred_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<FeeSharingTokensTransferred_Filter>;
};

export type SubscriptionLendingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLendingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type SubscriptionLendingPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLendingPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LendingPool_Filter>;
};

export type SubscriptionLiquidateArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidatesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Liquidate_Filter>;
};

export type SubscriptionLiquidityHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type SubscriptionLiquidityPoolArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolAdded_Filter>;
};

export type SubscriptionLiquidityPoolRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolRemoved_Filter>;
};

export type SubscriptionLiquidityPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLiquidityPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

export type SubscriptionLiquidityPoolsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPool_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<LiquidityPool_Filter>;
};

export type SubscriptionLoanArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionLoansArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Loan_Filter>;
};

export type SubscriptionNewConverterArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionNewConvertersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<NewConverter_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<NewConverter_Filter>;
};

export type SubscriptionPayBorrowingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayBorrowingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayBorrowingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayBorrowingFee_Filter>;
};

export type SubscriptionPayLendingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayLendingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayLendingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayLendingFee_Filter>;
};

export type SubscriptionPayTradingFeeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPayTradingFeesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PayTradingFee_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PayTradingFee_Filter>;
};

export type SubscriptionPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<PoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<PoolToken_Filter>;
};

export type SubscriptionProposalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionProposalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Proposal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Proposal_Filter>;
};

export type SubscriptionProtocolStatsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<ProtocolStats_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<ProtocolStats_Filter>;
};

export type SubscriptionRewardsEarnedHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionRewardsEarnedHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type SubscriptionSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSmartTokenAddedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSmartTokenAddedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartTokenAdded_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartTokenAdded_Filter>;
};

export type SubscriptionSmartTokenRemovedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSmartTokenRemovedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartTokenRemoved_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartTokenRemoved_Filter>;
};

export type SubscriptionSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<SmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<SmartToken_Filter>;
};

export type SubscriptionStakeHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionStakeHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type SubscriptionSwapArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionSwapsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Swap_Filter>;
};

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenPoolTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenPoolTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenPoolToken_Filter>;
};

export type SubscriptionTokenSmartTokenArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokenSmartTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Token_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Token_Filter>;
};

export type SubscriptionTokensStakedArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTokensStakedsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokensStaked_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<TokensStaked_Filter>;
};

export type SubscriptionTradeArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTradesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Trade_Filter>;
};

export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Transaction_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<Transaction_Filter>;
};

export type SubscriptionUserArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserLendingHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

export type SubscriptionUserLendingHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserLiquidityHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

export type SubscriptionUserLiquidityHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserRewardsEarnedHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

export type SubscriptionUserRewardsEarnedHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserStakeHistoriesArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

export type SubscriptionUserStakeHistoryArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserTotalArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionUserTotalsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserTotal_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<UserTotal_Filter>;
};

export type SubscriptionUsersArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<User_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<User_Filter>;
};

export type SubscriptionVestingContractArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVestingContractsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingContract_Filter>;
};

export type SubscriptionVestingHistoryItemArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVestingHistoryItemsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export type SubscriptionVoteCastArgs = {
  block?: InputMaybe<Block_Height>;
  id: Scalars['ID'];
  subgraphError?: _SubgraphErrorPolicy_;
};

export type SubscriptionVoteCastsArgs = {
  block?: InputMaybe<Block_Height>;
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  subgraphError?: _SubgraphErrorPolicy_;
  where?: InputMaybe<VoteCast_Filter>;
};

/**
 * The Swap entity is an aggregated entity of the individual Conversion events in a transaction.
 * For example, if a User swaps XUSD to SOV, there will be 2 Conversion events
 * through 2 AMMs (XUSD-BTC and BTC-SOV) in one transaction. These two Conversions
 * are aggregated here.
 */
export type Swap = {
  __typename?: 'Swap';
  /** The AMM Conversion events involved in this swap */
  conversions?: Maybe<Array<Conversion>>;
  fromAmount: Scalars['BigDecimal'];
  fromToken: Token;
  /** Transaction hash of this swap */
  id: Scalars['ID'];
  isBorrow: Scalars['Boolean'];
  isMarginTrade: Scalars['Boolean'];
  /** The number of AMM Conversions involved in this swap (this is primarily for debugging purposes) */
  numConversions: Scalars['Int'];
  /** Rate is calculated as toAmount / fromAmount */
  rate: Scalars['BigDecimal'];
  timestamp: Scalars['BigInt'];
  toAmount: Scalars['BigDecimal'];
  toToken: Token;
  transaction: Transaction;
  /** If this swap was initiated by a contract (for example as part of a Margin Trade), User will be null */
  user?: Maybe<User>;
};

/**
 * The Swap entity is an aggregated entity of the individual Conversion events in a transaction.
 * For example, if a User swaps XUSD to SOV, there will be 2 Conversion events
 * through 2 AMMs (XUSD-BTC and BTC-SOV) in one transaction. These two Conversions
 * are aggregated here.
 */
export type SwapConversionsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Conversion_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Conversion_Filter>;
};

export type Swap_Filter = {
  fromAmount?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fromAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  fromAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  fromToken?: InputMaybe<Scalars['String']>;
  fromToken_contains?: InputMaybe<Scalars['String']>;
  fromToken_ends_with?: InputMaybe<Scalars['String']>;
  fromToken_gt?: InputMaybe<Scalars['String']>;
  fromToken_gte?: InputMaybe<Scalars['String']>;
  fromToken_in?: InputMaybe<Array<Scalars['String']>>;
  fromToken_lt?: InputMaybe<Scalars['String']>;
  fromToken_lte?: InputMaybe<Scalars['String']>;
  fromToken_not?: InputMaybe<Scalars['String']>;
  fromToken_not_contains?: InputMaybe<Scalars['String']>;
  fromToken_not_ends_with?: InputMaybe<Scalars['String']>;
  fromToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  fromToken_not_starts_with?: InputMaybe<Scalars['String']>;
  fromToken_starts_with?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isBorrow?: InputMaybe<Scalars['Boolean']>;
  isBorrow_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isBorrow_not?: InputMaybe<Scalars['Boolean']>;
  isBorrow_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isMarginTrade?: InputMaybe<Scalars['Boolean']>;
  isMarginTrade_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isMarginTrade_not?: InputMaybe<Scalars['Boolean']>;
  isMarginTrade_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  numConversions?: InputMaybe<Scalars['Int']>;
  numConversions_gt?: InputMaybe<Scalars['Int']>;
  numConversions_gte?: InputMaybe<Scalars['Int']>;
  numConversions_in?: InputMaybe<Array<Scalars['Int']>>;
  numConversions_lt?: InputMaybe<Scalars['Int']>;
  numConversions_lte?: InputMaybe<Scalars['Int']>;
  numConversions_not?: InputMaybe<Scalars['Int']>;
  numConversions_not_in?: InputMaybe<Array<Scalars['Int']>>;
  rate?: InputMaybe<Scalars['BigDecimal']>;
  rate_gt?: InputMaybe<Scalars['BigDecimal']>;
  rate_gte?: InputMaybe<Scalars['BigDecimal']>;
  rate_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  rate_lt?: InputMaybe<Scalars['BigDecimal']>;
  rate_lte?: InputMaybe<Scalars['BigDecimal']>;
  rate_not?: InputMaybe<Scalars['BigDecimal']>;
  rate_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  toAmount?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_gt?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_gte?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  toAmount_lt?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_lte?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_not?: InputMaybe<Scalars['BigDecimal']>;
  toAmount_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  toToken?: InputMaybe<Scalars['String']>;
  toToken_contains?: InputMaybe<Scalars['String']>;
  toToken_ends_with?: InputMaybe<Scalars['String']>;
  toToken_gt?: InputMaybe<Scalars['String']>;
  toToken_gte?: InputMaybe<Scalars['String']>;
  toToken_in?: InputMaybe<Array<Scalars['String']>>;
  toToken_lt?: InputMaybe<Scalars['String']>;
  toToken_lte?: InputMaybe<Scalars['String']>;
  toToken_not?: InputMaybe<Scalars['String']>;
  toToken_not_contains?: InputMaybe<Scalars['String']>;
  toToken_not_ends_with?: InputMaybe<Scalars['String']>;
  toToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  toToken_not_starts_with?: InputMaybe<Scalars['String']>;
  toToken_starts_with?: InputMaybe<Scalars['String']>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Swap_OrderBy {
  Conversions = 'conversions',
  FromAmount = 'fromAmount',
  FromToken = 'fromToken',
  Id = 'id',
  IsBorrow = 'isBorrow',
  IsMarginTrade = 'isMarginTrade',
  NumConversions = 'numConversions',
  Rate = 'rate',
  Timestamp = 'timestamp',
  ToAmount = 'toAmount',
  ToToken = 'toToken',
  Transaction = 'transaction',
  User = 'user',
}

/** This entity represents an ERC20 token traded on the Sovryn Protocol */
export type Token = {
  __typename?: 'Token';
  /** The total volume of this token that has been traded through the protocol quoted in BTC */
  btcVolume: Scalars['BigDecimal'];
  currentConverterRegistry?: Maybe<ConverterRegistry>;
  decimals?: Maybe<Scalars['Int']>;
  /** Does this token have an AMM pool with rBTC as the other reserve asset? */
  hasBtcPool?: Maybe<Scalars['Boolean']>;
  /** Does this token have an AMM pool with the protocol stablecoin as the other reserve asset? */
  hasStablecoinPool?: Maybe<Scalars['Boolean']>;
  /** The ID is the contract address of the token on RSK */
  id: Scalars['ID'];
  lastPriceBtc: Scalars['BigDecimal'];
  lastPriceUsd: Scalars['BigDecimal'];
  /** The addresses of the LiquidityPools where this token is a reserve asset */
  liquidityPools?: Maybe<Array<LiquidityPoolToken>>;
  name?: Maybe<Scalars['String']>;
  /** previous BTC price used for candleSticks */
  prevPriceBtc: Scalars['BigDecimal'];
  /** previous BTC price used for candleSticks */
  prevPriceUsd: Scalars['BigDecimal'];
  /** The smart tokens that have this token as an underlying asset */
  smartTokens?: Maybe<Array<TokenSmartToken>>;
  symbol?: Maybe<Scalars['String']>;
  /** The total volume of this token that has been traded through the protocol */
  tokenVolume: Scalars['BigDecimal'];
  /** The total volume of this token that has been traded through the protocol quoted in USD */
  usdVolume: Scalars['BigDecimal'];
  version?: Maybe<Scalars['Int']>;
};

/** This entity represents an ERC20 token traded on the Sovryn Protocol */
export type TokenLiquidityPoolsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityPoolToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityPoolToken_Filter>;
};

/** This entity represents an ERC20 token traded on the Sovryn Protocol */
export type TokenSmartTokensArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<TokenSmartToken_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<TokenSmartToken_Filter>;
};

/** The entity stores the many-to-many relationship between underlying tokens and pool tokens */
export type TokenPoolToken = {
  __typename?: 'TokenPoolToken';
  /** ID is token address + poolToken address */
  id: Scalars['ID'];
  liquidityPool: LiquidityPool;
  poolToken: PoolToken;
  token: Token;
};

export type TokenPoolToken_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  liquidityPool?: InputMaybe<Scalars['String']>;
  liquidityPool_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_gt?: InputMaybe<Scalars['String']>;
  liquidityPool_gte?: InputMaybe<Scalars['String']>;
  liquidityPool_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_lt?: InputMaybe<Scalars['String']>;
  liquidityPool_lte?: InputMaybe<Scalars['String']>;
  liquidityPool_not?: InputMaybe<Scalars['String']>;
  liquidityPool_not_contains?: InputMaybe<Scalars['String']>;
  liquidityPool_not_ends_with?: InputMaybe<Scalars['String']>;
  liquidityPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  liquidityPool_not_starts_with?: InputMaybe<Scalars['String']>;
  liquidityPool_starts_with?: InputMaybe<Scalars['String']>;
  poolToken?: InputMaybe<Scalars['String']>;
  poolToken_contains?: InputMaybe<Scalars['String']>;
  poolToken_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_gt?: InputMaybe<Scalars['String']>;
  poolToken_gte?: InputMaybe<Scalars['String']>;
  poolToken_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_lt?: InputMaybe<Scalars['String']>;
  poolToken_lte?: InputMaybe<Scalars['String']>;
  poolToken_not?: InputMaybe<Scalars['String']>;
  poolToken_not_contains?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_starts_with?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
};

export enum TokenPoolToken_OrderBy {
  Id = 'id',
  LiquidityPool = 'liquidityPool',
  PoolToken = 'poolToken',
  Token = 'token',
}

/** This entity is to store a many-to-many relationship between tokens and smart tokens */
export type TokenSmartToken = {
  __typename?: 'TokenSmartToken';
  /** ID is token address + smart token address */
  id: Scalars['ID'];
  smartToken: SmartToken;
  /** token is the underlying asset represented by the smartToken */
  token: Token;
};

export type TokenSmartToken_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  smartToken?: InputMaybe<Scalars['String']>;
  smartToken_contains?: InputMaybe<Scalars['String']>;
  smartToken_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_gt?: InputMaybe<Scalars['String']>;
  smartToken_gte?: InputMaybe<Scalars['String']>;
  smartToken_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_lt?: InputMaybe<Scalars['String']>;
  smartToken_lte?: InputMaybe<Scalars['String']>;
  smartToken_not?: InputMaybe<Scalars['String']>;
  smartToken_not_contains?: InputMaybe<Scalars['String']>;
  smartToken_not_ends_with?: InputMaybe<Scalars['String']>;
  smartToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  smartToken_not_starts_with?: InputMaybe<Scalars['String']>;
  smartToken_starts_with?: InputMaybe<Scalars['String']>;
  token?: InputMaybe<Scalars['String']>;
  token_contains?: InputMaybe<Scalars['String']>;
  token_ends_with?: InputMaybe<Scalars['String']>;
  token_gt?: InputMaybe<Scalars['String']>;
  token_gte?: InputMaybe<Scalars['String']>;
  token_in?: InputMaybe<Array<Scalars['String']>>;
  token_lt?: InputMaybe<Scalars['String']>;
  token_lte?: InputMaybe<Scalars['String']>;
  token_not?: InputMaybe<Scalars['String']>;
  token_not_contains?: InputMaybe<Scalars['String']>;
  token_not_ends_with?: InputMaybe<Scalars['String']>;
  token_not_in?: InputMaybe<Array<Scalars['String']>>;
  token_not_starts_with?: InputMaybe<Scalars['String']>;
  token_starts_with?: InputMaybe<Scalars['String']>;
};

export enum TokenSmartToken_OrderBy {
  Id = 'id',
  SmartToken = 'smartToken',
  Token = 'token',
}

export type Token_Filter = {
  btcVolume?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  btcVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  btcVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  currentConverterRegistry?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_gte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_lt?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_lte?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_contains?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_ends_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_not_in?: InputMaybe<Array<Scalars['String']>>;
  currentConverterRegistry_not_starts_with?: InputMaybe<Scalars['String']>;
  currentConverterRegistry_starts_with?: InputMaybe<Scalars['String']>;
  decimals?: InputMaybe<Scalars['Int']>;
  decimals_gt?: InputMaybe<Scalars['Int']>;
  decimals_gte?: InputMaybe<Scalars['Int']>;
  decimals_in?: InputMaybe<Array<Scalars['Int']>>;
  decimals_lt?: InputMaybe<Scalars['Int']>;
  decimals_lte?: InputMaybe<Scalars['Int']>;
  decimals_not?: InputMaybe<Scalars['Int']>;
  decimals_not_in?: InputMaybe<Array<Scalars['Int']>>;
  hasBtcPool?: InputMaybe<Scalars['Boolean']>;
  hasBtcPool_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasBtcPool_not?: InputMaybe<Scalars['Boolean']>;
  hasBtcPool_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasStablecoinPool?: InputMaybe<Scalars['Boolean']>;
  hasStablecoinPool_in?: InputMaybe<Array<Scalars['Boolean']>>;
  hasStablecoinPool_not?: InputMaybe<Scalars['Boolean']>;
  hasStablecoinPool_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lastPriceBtc?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_gt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_gte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceBtc_lt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_lte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_not?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceBtc_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceUsd?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  lastPriceUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  lastPriceUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  name?: InputMaybe<Scalars['String']>;
  name_contains?: InputMaybe<Scalars['String']>;
  name_ends_with?: InputMaybe<Scalars['String']>;
  name_gt?: InputMaybe<Scalars['String']>;
  name_gte?: InputMaybe<Scalars['String']>;
  name_in?: InputMaybe<Array<Scalars['String']>>;
  name_lt?: InputMaybe<Scalars['String']>;
  name_lte?: InputMaybe<Scalars['String']>;
  name_not?: InputMaybe<Scalars['String']>;
  name_not_contains?: InputMaybe<Scalars['String']>;
  name_not_ends_with?: InputMaybe<Scalars['String']>;
  name_not_in?: InputMaybe<Array<Scalars['String']>>;
  name_not_starts_with?: InputMaybe<Scalars['String']>;
  name_starts_with?: InputMaybe<Scalars['String']>;
  prevPriceBtc?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_gt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_gte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceBtc_lt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_lte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_not?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceBtc_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceUsd?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  prevPriceUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  prevPriceUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  symbol?: InputMaybe<Scalars['String']>;
  symbol_contains?: InputMaybe<Scalars['String']>;
  symbol_ends_with?: InputMaybe<Scalars['String']>;
  symbol_gt?: InputMaybe<Scalars['String']>;
  symbol_gte?: InputMaybe<Scalars['String']>;
  symbol_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_lt?: InputMaybe<Scalars['String']>;
  symbol_lte?: InputMaybe<Scalars['String']>;
  symbol_not?: InputMaybe<Scalars['String']>;
  symbol_not_contains?: InputMaybe<Scalars['String']>;
  symbol_not_ends_with?: InputMaybe<Scalars['String']>;
  symbol_not_in?: InputMaybe<Array<Scalars['String']>>;
  symbol_not_starts_with?: InputMaybe<Scalars['String']>;
  symbol_starts_with?: InputMaybe<Scalars['String']>;
  tokenVolume?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  tokenVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  tokenVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  usdVolume?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_gt?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_gte?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  usdVolume_lt?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_lte?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_not?: InputMaybe<Scalars['BigDecimal']>;
  usdVolume_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  version?: InputMaybe<Scalars['Int']>;
  version_gt?: InputMaybe<Scalars['Int']>;
  version_gte?: InputMaybe<Scalars['Int']>;
  version_in?: InputMaybe<Array<Scalars['Int']>>;
  version_lt?: InputMaybe<Scalars['Int']>;
  version_lte?: InputMaybe<Scalars['Int']>;
  version_not?: InputMaybe<Scalars['Int']>;
  version_not_in?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Token_OrderBy {
  BtcVolume = 'btcVolume',
  CurrentConverterRegistry = 'currentConverterRegistry',
  Decimals = 'decimals',
  HasBtcPool = 'hasBtcPool',
  HasStablecoinPool = 'hasStablecoinPool',
  Id = 'id',
  LastPriceBtc = 'lastPriceBtc',
  LastPriceUsd = 'lastPriceUsd',
  LiquidityPools = 'liquidityPools',
  Name = 'name',
  PrevPriceBtc = 'prevPriceBtc',
  PrevPriceUsd = 'prevPriceUsd',
  SmartTokens = 'smartTokens',
  Symbol = 'symbol',
  TokenVolume = 'tokenVolume',
  UsdVolume = 'usdVolume',
  Version = 'version',
}

export type TokensStaked = {
  __typename?: 'TokensStaked';
  amount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  isUserStaked: Scalars['Boolean'];
  lockedUntil: Scalars['BigInt'];
  staker: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  transaction: Transaction;
  user?: Maybe<User>;
};

export type TokensStaked_Filter = {
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  isUserStaked?: InputMaybe<Scalars['Boolean']>;
  isUserStaked_in?: InputMaybe<Array<Scalars['Boolean']>>;
  isUserStaked_not?: InputMaybe<Scalars['Boolean']>;
  isUserStaked_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  lockedUntil?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedUntil_lt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_lte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staker?: InputMaybe<Scalars['Bytes']>;
  staker_contains?: InputMaybe<Scalars['Bytes']>;
  staker_in?: InputMaybe<Array<Scalars['Bytes']>>;
  staker_not?: InputMaybe<Scalars['Bytes']>;
  staker_not_contains?: InputMaybe<Scalars['Bytes']>;
  staker_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum TokensStaked_OrderBy {
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  IsUserStaked = 'isUserStaked',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  Transaction = 'transaction',
  User = 'user',
}

export type Trade = {
  __typename?: 'Trade';
  borrowedAmount: Scalars['BigInt'];
  collateralToken: Scalars['Bytes'];
  currentLeverage: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  entryLeverage: Scalars['BigInt'];
  entryPrice: Scalars['BigInt'];
  id: Scalars['ID'];
  interestRate: Scalars['BigInt'];
  lender: Scalars['Bytes'];
  loanId: Loan;
  loanToken: Scalars['Bytes'];
  positionSize: Scalars['BigInt'];
  settlementDate: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  user: User;
};

export type Trade_Filter = {
  borrowedAmount?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_gt?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_gte?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  borrowedAmount_lt?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_lte?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_not?: InputMaybe<Scalars['BigInt']>;
  borrowedAmount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  collateralToken?: InputMaybe<Scalars['Bytes']>;
  collateralToken_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  collateralToken_not?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  collateralToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  currentLeverage?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_gt?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_gte?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentLeverage_lt?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_lte?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_not?: InputMaybe<Scalars['BigInt']>;
  currentLeverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  entryLeverage?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_gt?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_gte?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_in?: InputMaybe<Array<Scalars['BigInt']>>;
  entryLeverage_lt?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_lte?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_not?: InputMaybe<Scalars['BigInt']>;
  entryLeverage_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  entryPrice?: InputMaybe<Scalars['BigInt']>;
  entryPrice_gt?: InputMaybe<Scalars['BigInt']>;
  entryPrice_gte?: InputMaybe<Scalars['BigInt']>;
  entryPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  entryPrice_lt?: InputMaybe<Scalars['BigInt']>;
  entryPrice_lte?: InputMaybe<Scalars['BigInt']>;
  entryPrice_not?: InputMaybe<Scalars['BigInt']>;
  entryPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  interestRate?: InputMaybe<Scalars['BigInt']>;
  interestRate_gt?: InputMaybe<Scalars['BigInt']>;
  interestRate_gte?: InputMaybe<Scalars['BigInt']>;
  interestRate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  interestRate_lt?: InputMaybe<Scalars['BigInt']>;
  interestRate_lte?: InputMaybe<Scalars['BigInt']>;
  interestRate_not?: InputMaybe<Scalars['BigInt']>;
  interestRate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lender?: InputMaybe<Scalars['Bytes']>;
  lender_contains?: InputMaybe<Scalars['Bytes']>;
  lender_in?: InputMaybe<Array<Scalars['Bytes']>>;
  lender_not?: InputMaybe<Scalars['Bytes']>;
  lender_not_contains?: InputMaybe<Scalars['Bytes']>;
  lender_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanId?: InputMaybe<Scalars['String']>;
  loanId_contains?: InputMaybe<Scalars['String']>;
  loanId_ends_with?: InputMaybe<Scalars['String']>;
  loanId_gt?: InputMaybe<Scalars['String']>;
  loanId_gte?: InputMaybe<Scalars['String']>;
  loanId_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_lt?: InputMaybe<Scalars['String']>;
  loanId_lte?: InputMaybe<Scalars['String']>;
  loanId_not?: InputMaybe<Scalars['String']>;
  loanId_not_contains?: InputMaybe<Scalars['String']>;
  loanId_not_ends_with?: InputMaybe<Scalars['String']>;
  loanId_not_in?: InputMaybe<Array<Scalars['String']>>;
  loanId_not_starts_with?: InputMaybe<Scalars['String']>;
  loanId_starts_with?: InputMaybe<Scalars['String']>;
  loanToken?: InputMaybe<Scalars['Bytes']>;
  loanToken_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_in?: InputMaybe<Array<Scalars['Bytes']>>;
  loanToken_not?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_contains?: InputMaybe<Scalars['Bytes']>;
  loanToken_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  positionSize?: InputMaybe<Scalars['BigInt']>;
  positionSize_gt?: InputMaybe<Scalars['BigInt']>;
  positionSize_gte?: InputMaybe<Scalars['BigInt']>;
  positionSize_in?: InputMaybe<Array<Scalars['BigInt']>>;
  positionSize_lt?: InputMaybe<Scalars['BigInt']>;
  positionSize_lte?: InputMaybe<Scalars['BigInt']>;
  positionSize_not?: InputMaybe<Scalars['BigInt']>;
  positionSize_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  settlementDate?: InputMaybe<Scalars['BigInt']>;
  settlementDate_gt?: InputMaybe<Scalars['BigInt']>;
  settlementDate_gte?: InputMaybe<Scalars['BigInt']>;
  settlementDate_in?: InputMaybe<Array<Scalars['BigInt']>>;
  settlementDate_lt?: InputMaybe<Scalars['BigInt']>;
  settlementDate_lte?: InputMaybe<Scalars['BigInt']>;
  settlementDate_not?: InputMaybe<Scalars['BigInt']>;
  settlementDate_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum Trade_OrderBy {
  BorrowedAmount = 'borrowedAmount',
  CollateralToken = 'collateralToken',
  CurrentLeverage = 'currentLeverage',
  EmittedBy = 'emittedBy',
  EntryLeverage = 'entryLeverage',
  EntryPrice = 'entryPrice',
  Id = 'id',
  InterestRate = 'interestRate',
  Lender = 'lender',
  LoanId = 'loanId',
  LoanToken = 'loanToken',
  PositionSize = 'positionSize',
  SettlementDate = 'settlementDate',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  User = 'user',
}

/** Transaction data, including hash and timestamp */
export type Transaction = {
  __typename?: 'Transaction';
  blockNumber: Scalars['BigInt'];
  /** The account that initiated this transaction. This must be an Account and not a Contract. */
  from: Scalars['Bytes'];
  gasLimit: Scalars['BigInt'];
  gasPrice: Scalars['BigInt'];
  /** ID is transaction hash */
  id: Scalars['ID'];
  /** The index of this transaction within the block */
  index: Scalars['BigInt'];
  /** The timestamp the transaction was confirmed */
  timestamp: Scalars['BigInt'];
  to?: Maybe<Scalars['Bytes']>;
  value: Scalars['BigInt'];
};

export type Transaction_Filter = {
  blockNumber?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']>>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  from?: InputMaybe<Scalars['Bytes']>;
  from_contains?: InputMaybe<Scalars['Bytes']>;
  from_in?: InputMaybe<Array<Scalars['Bytes']>>;
  from_not?: InputMaybe<Scalars['Bytes']>;
  from_not_contains?: InputMaybe<Scalars['Bytes']>;
  from_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  gasLimit?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_gte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasLimit_lt?: InputMaybe<Scalars['BigInt']>;
  gasLimit_lte?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not?: InputMaybe<Scalars['BigInt']>;
  gasLimit_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_gte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_in?: InputMaybe<Array<Scalars['BigInt']>>;
  gasPrice_lt?: InputMaybe<Scalars['BigInt']>;
  gasPrice_lte?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not?: InputMaybe<Scalars['BigInt']>;
  gasPrice_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  index?: InputMaybe<Scalars['BigInt']>;
  index_gt?: InputMaybe<Scalars['BigInt']>;
  index_gte?: InputMaybe<Scalars['BigInt']>;
  index_in?: InputMaybe<Array<Scalars['BigInt']>>;
  index_lt?: InputMaybe<Scalars['BigInt']>;
  index_lte?: InputMaybe<Scalars['BigInt']>;
  index_not?: InputMaybe<Scalars['BigInt']>;
  index_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  to?: InputMaybe<Scalars['Bytes']>;
  to_contains?: InputMaybe<Scalars['Bytes']>;
  to_in?: InputMaybe<Array<Scalars['Bytes']>>;
  to_not?: InputMaybe<Scalars['Bytes']>;
  to_not_contains?: InputMaybe<Scalars['Bytes']>;
  to_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  value?: InputMaybe<Scalars['BigInt']>;
  value_gt?: InputMaybe<Scalars['BigInt']>;
  value_gte?: InputMaybe<Scalars['BigInt']>;
  value_in?: InputMaybe<Array<Scalars['BigInt']>>;
  value_lt?: InputMaybe<Scalars['BigInt']>;
  value_lte?: InputMaybe<Scalars['BigInt']>;
  value_not?: InputMaybe<Scalars['BigInt']>;
  value_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum Transaction_OrderBy {
  BlockNumber = 'blockNumber',
  From = 'from',
  GasLimit = 'gasLimit',
  GasPrice = 'gasPrice',
  Id = 'id',
  Index = 'index',
  Timestamp = 'timestamp',
  To = 'to',
  Value = 'value',
}

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type User = {
  __typename?: 'User';
  /** An array of Borrow events */
  borrows?: Maybe<Array<Borrow>>;
  /** ID is user wallet address */
  id: Scalars['ID'];
  /**
   * The lending history of a User, separated into lending pools. Explore the
   * UserLendingHistory entity for more granular events.
   */
  lendingHistory?: Maybe<Array<UserLendingHistory>>;
  /** An array of Liquidation events linked to this user */
  liquidations?: Maybe<Array<Liquidate>>;
  /** An array of all LiquidityAdded and LiquidityRemoved events */
  liquidityHistory?: Maybe<Array<UserLiquidityHistory>>;
  /** All loans taken out by this user, including for margin trading and for borrowing */
  loans?: Maybe<Array<Loan>>;
  /**
   * The Rewards history of one user. This includes actions like EarnReward, RewardSovDeposited, and RewardSovStaked.
   * Explore the UserRewardsEarnedHistory entity for more granular events
   */
  rewardsEarnedHistory?: Maybe<Array<UserRewardsEarnedHistory>>;
  /**
   * The SOV Staking history of a user. This includes withdrawing vested tokens.
   * Explore the UserStakeHistory entity for more granular events.
   */
  stakeHistory?: Maybe<Array<UserStakeHistory>>;
  /**
   * Swaps here refers to only user-triggered swaps. For example, a swap that is part of a margin trade would not be included.
   * Swaps involving multiple amm pools are stored as a single swap, comprised of multiple Conversion events
   */
  swaps?: Maybe<Array<Swap>>;
  /** An array of margin trade Trade events */
  trades?: Maybe<Array<Trade>>;
  /** See UserTotals entity for full documentation */
  userTotals?: Maybe<UserTotal>;
  /** Vesting contracts owned by User, labelled by type */
  vestingContracts?: Maybe<Array<VestingContract>>;
  /** Voting history of User */
  votes?: Maybe<Array<VoteCast>>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserBorrowsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Borrow_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Borrow_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserLendingHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLendingHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserLendingHistory_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserLiquidationsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Liquidate_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Liquidate_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserLiquidityHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserLiquidityHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserLiquidityHistory_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserLoansArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Loan_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Loan_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserRewardsEarnedHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserRewardsEarnedHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserRewardsEarnedHistory_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<UserStakeHistory_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<UserStakeHistory_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserSwapsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Swap_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Swap_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserTradesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Trade_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<Trade_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserVestingContractsArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingContract_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VestingContract_Filter>;
};

/** This entity contains all user-specific data displayed on the dapp, including all user actions */
export type UserVotesArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VoteCast_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VoteCast_Filter>;
};

/** This entity contains the lending and unlending history of one User */
export type UserLendingHistory = {
  __typename?: 'UserLendingHistory';
  /** ID is userAddress + lendingPoolAddress (lendingPool in this case is the lending pool token) */
  id: Scalars['ID'];
  /** Granular Lend/UnLend events. Derived from Mint/Burn events on the contracts */
  lendingHistory?: Maybe<Array<LendingHistoryItem>>;
  lendingPool: LendingPool;
  /**
   * Total volume this User has lent to this pool over all time (in the underlying
   * asset currency, ie rBTC for the rBTC lending pool)
   */
  totalLendVolume: Scalars['BigInt'];
  /** Total volume this User has withdrawn from this pool over all time */
  totalUnlendVolume: Scalars['BigInt'];
  user: User;
};

/** This entity contains the lending and unlending history of one User */
export type UserLendingHistoryLendingHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LendingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LendingHistoryItem_Filter>;
};

export type UserLendingHistory_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lendingPool?: InputMaybe<Scalars['String']>;
  lendingPool_contains?: InputMaybe<Scalars['String']>;
  lendingPool_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_gt?: InputMaybe<Scalars['String']>;
  lendingPool_gte?: InputMaybe<Scalars['String']>;
  lendingPool_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_lt?: InputMaybe<Scalars['String']>;
  lendingPool_lte?: InputMaybe<Scalars['String']>;
  lendingPool_not?: InputMaybe<Scalars['String']>;
  lendingPool_not_contains?: InputMaybe<Scalars['String']>;
  lendingPool_not_ends_with?: InputMaybe<Scalars['String']>;
  lendingPool_not_in?: InputMaybe<Array<Scalars['String']>>;
  lendingPool_not_starts_with?: InputMaybe<Scalars['String']>;
  lendingPool_starts_with?: InputMaybe<Scalars['String']>;
  totalLendVolume?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_gt?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_gte?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalLendVolume_lt?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_lte?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_not?: InputMaybe<Scalars['BigInt']>;
  totalLendVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUnlendVolume?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_gt?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_gte?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalUnlendVolume_lt?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_lte?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_not?: InputMaybe<Scalars['BigInt']>;
  totalUnlendVolume_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserLendingHistory_OrderBy {
  Id = 'id',
  LendingHistory = 'lendingHistory',
  LendingPool = 'lendingPool',
  TotalLendVolume = 'totalLendVolume',
  TotalUnlendVolume = 'totalUnlendVolume',
  User = 'user',
}

/** This entity stores one Users history of adding and removing liquidity from one AMM pool */
export type UserLiquidityHistory = {
  __typename?: 'UserLiquidityHistory';
  id: Scalars['ID'];
  liquidityHistory?: Maybe<Array<LiquidityHistoryItem>>;
  poolToken: PoolToken;
  totalAsset0LiquidityAdded: Scalars['BigInt'];
  totalAsset0LiquidityRemoved: Scalars['BigInt'];
  totalAsset1LiquidityAdded: Scalars['BigInt'];
  totalAsset1LiquidityRemoved: Scalars['BigInt'];
  user: User;
};

/** This entity stores one Users history of adding and removing liquidity from one AMM pool */
export type UserLiquidityHistoryLiquidityHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<LiquidityHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<LiquidityHistoryItem_Filter>;
};

export type UserLiquidityHistory_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  poolToken?: InputMaybe<Scalars['String']>;
  poolToken_contains?: InputMaybe<Scalars['String']>;
  poolToken_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_gt?: InputMaybe<Scalars['String']>;
  poolToken_gte?: InputMaybe<Scalars['String']>;
  poolToken_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_lt?: InputMaybe<Scalars['String']>;
  poolToken_lte?: InputMaybe<Scalars['String']>;
  poolToken_not?: InputMaybe<Scalars['String']>;
  poolToken_not_contains?: InputMaybe<Scalars['String']>;
  poolToken_not_ends_with?: InputMaybe<Scalars['String']>;
  poolToken_not_in?: InputMaybe<Array<Scalars['String']>>;
  poolToken_not_starts_with?: InputMaybe<Scalars['String']>;
  poolToken_starts_with?: InputMaybe<Scalars['String']>;
  totalAsset0LiquidityAdded?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_gt?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_gte?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset0LiquidityAdded_lt?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_lte?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_not?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityAdded_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset0LiquidityRemoved?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_gt?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_gte?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset0LiquidityRemoved_lt?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_lte?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_not?: InputMaybe<Scalars['BigInt']>;
  totalAsset0LiquidityRemoved_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset1LiquidityAdded?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_gt?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_gte?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset1LiquidityAdded_lt?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_lte?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_not?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityAdded_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset1LiquidityRemoved?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_gt?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_gte?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalAsset1LiquidityRemoved_lt?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_lte?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_not?: InputMaybe<Scalars['BigInt']>;
  totalAsset1LiquidityRemoved_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserLiquidityHistory_OrderBy {
  Id = 'id',
  LiquidityHistory = 'liquidityHistory',
  PoolToken = 'poolToken',
  TotalAsset0LiquidityAdded = 'totalAsset0LiquidityAdded',
  TotalAsset0LiquidityRemoved = 'totalAsset0LiquidityRemoved',
  TotalAsset1LiquidityAdded = 'totalAsset1LiquidityAdded',
  TotalAsset1LiquidityRemoved = 'totalAsset1LiquidityRemoved',
  User = 'user',
}

/** This entity contains the history, fees and totals regarding one users' SOV rewards */
export type UserRewardsEarnedHistory = {
  __typename?: 'UserRewardsEarnedHistory';
  /** This is incremented by EarnReward and RewardClaimed events, and set to 0 by RewardWithdrawn events */
  availableRewardSov: Scalars['BigInt'];
  /** This is incremented by EarnReward events, and set to 0 by TokensStaked events on the LockedSOV contract */
  availableTradingRewards: Scalars['BigInt'];
  id: Scalars['ID'];
  rewardsEarnedHistory?: Maybe<Array<RewardsEarnedHistoryItem>>;
  /** This is the total of all EarnReward and RewardClaimed events */
  totalFeesAndRewardsEarned: Scalars['BigInt'];
  user: User;
};

/** This entity contains the history, fees and totals regarding one users' SOV rewards */
export type UserRewardsEarnedHistoryRewardsEarnedHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<RewardsEarnedHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<RewardsEarnedHistoryItem_Filter>;
};

export type UserRewardsEarnedHistory_Filter = {
  availableRewardSov?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_gt?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_gte?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableRewardSov_lt?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_lte?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_not?: InputMaybe<Scalars['BigInt']>;
  availableRewardSov_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableTradingRewards?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_gt?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_gte?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_in?: InputMaybe<Array<Scalars['BigInt']>>;
  availableTradingRewards_lt?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_lte?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_not?: InputMaybe<Scalars['BigInt']>;
  availableTradingRewards_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalFeesAndRewardsEarned?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_gt?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_gte?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalFeesAndRewardsEarned_lt?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_lte?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_not?: InputMaybe<Scalars['BigInt']>;
  totalFeesAndRewardsEarned_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserRewardsEarnedHistory_OrderBy {
  AvailableRewardSov = 'availableRewardSov',
  AvailableTradingRewards = 'availableTradingRewards',
  Id = 'id',
  RewardsEarnedHistory = 'rewardsEarnedHistory',
  TotalFeesAndRewardsEarned = 'totalFeesAndRewardsEarned',
  User = 'user',
}

export type UserStakeHistory = {
  __typename?: 'UserStakeHistory';
  id: Scalars['ID'];
  stakeHistory?: Maybe<Array<StakeHistoryItem>>;
  totalRemaining: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  totalWithdrawn: Scalars['BigInt'];
  user: User;
};

export type UserStakeHistoryStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<StakeHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<StakeHistoryItem_Filter>;
};

export type UserStakeHistory_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalRemaining?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_gt?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_gte?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalRemaining_lt?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_lte?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_not?: InputMaybe<Scalars['BigInt']>;
  totalRemaining_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawn?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_gt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_gte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalWithdrawn_lt?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_lte?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_not?: InputMaybe<Scalars['BigInt']>;
  totalWithdrawn_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserStakeHistory_OrderBy {
  Id = 'id',
  StakeHistory = 'stakeHistory',
  TotalRemaining = 'totalRemaining',
  TotalStaked = 'totalStaked',
  TotalWithdrawn = 'totalWithdrawn',
  User = 'user',
}

/** This is the total volumes of different actions for one user. See ProtocolStats entity for full descriptions. */
export type UserTotal = {
  __typename?: 'UserTotal';
  id: Scalars['ID'];
  totalAmmLpFeesUsd: Scalars['BigDecimal'];
  totalAmmStakerFeesUsd: Scalars['BigDecimal'];
  totalAmmVolumeUsd: Scalars['BigDecimal'];
  totalBorrowVolumeUsd: Scalars['BigDecimal'];
  totalBorrowingFeesUsd: Scalars['BigDecimal'];
  totalCloseWithDepositVolumeUsd: Scalars['BigDecimal'];
  totalCloseWithSwapVolumeUsd: Scalars['BigDecimal'];
  totalDepositCollateralVolumeUsd: Scalars['BigDecimal'];
  totalLendVolumeUsd: Scalars['BigDecimal'];
  totalLendingFeesUsd: Scalars['BigDecimal'];
  totalLiquidateVolumeUsd: Scalars['BigDecimal'];
  totalMarginTradeVolumeUsd: Scalars['BigDecimal'];
  totalTradingFeesUsd: Scalars['BigDecimal'];
  totalUnlendVolumeUsd: Scalars['BigDecimal'];
  user: User;
};

export type UserTotal_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  totalAmmLpFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmLpFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmLpFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmStakerFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmStakerFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalAmmVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalAmmVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalBorrowingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalBorrowingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithDepositVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithDepositVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalCloseWithSwapVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalCloseWithSwapVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalCloseWithSwapVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalDepositCollateralVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalDepositCollateralVolumeUsd_not_in?: InputMaybe<
    Array<Scalars['BigDecimal']>
  >;
  totalLendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLendingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLendingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalLiquidateVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalLiquidateVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalMarginTradeVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalMarginTradeVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalTradingFeesUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalTradingFeesUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_gte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  totalUnlendVolumeUsd_lt?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_lte?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not?: InputMaybe<Scalars['BigDecimal']>;
  totalUnlendVolumeUsd_not_in?: InputMaybe<Array<Scalars['BigDecimal']>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum UserTotal_OrderBy {
  Id = 'id',
  TotalAmmLpFeesUsd = 'totalAmmLpFeesUsd',
  TotalAmmStakerFeesUsd = 'totalAmmStakerFeesUsd',
  TotalAmmVolumeUsd = 'totalAmmVolumeUsd',
  TotalBorrowVolumeUsd = 'totalBorrowVolumeUsd',
  TotalBorrowingFeesUsd = 'totalBorrowingFeesUsd',
  TotalCloseWithDepositVolumeUsd = 'totalCloseWithDepositVolumeUsd',
  TotalCloseWithSwapVolumeUsd = 'totalCloseWithSwapVolumeUsd',
  TotalDepositCollateralVolumeUsd = 'totalDepositCollateralVolumeUsd',
  TotalLendVolumeUsd = 'totalLendVolumeUsd',
  TotalLendingFeesUsd = 'totalLendingFeesUsd',
  TotalLiquidateVolumeUsd = 'totalLiquidateVolumeUsd',
  TotalMarginTradeVolumeUsd = 'totalMarginTradeVolumeUsd',
  TotalTradingFeesUsd = 'totalTradingFeesUsd',
  TotalUnlendVolumeUsd = 'totalUnlendVolumeUsd',
  User = 'user',
}

export type User_Filter = {
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  Borrows = 'borrows',
  Id = 'id',
  LendingHistory = 'lendingHistory',
  Liquidations = 'liquidations',
  LiquidityHistory = 'liquidityHistory',
  Loans = 'loans',
  RewardsEarnedHistory = 'rewardsEarnedHistory',
  StakeHistory = 'stakeHistory',
  Swaps = 'swaps',
  Trades = 'trades',
  UserTotals = 'userTotals',
  VestingContracts = 'vestingContracts',
  Votes = 'votes',
}

export type VestingContract = {
  __typename?: 'VestingContract';
  cliff?: Maybe<Scalars['BigInt']>;
  createdAtTimestamp: Scalars['BigInt'];
  createdAtTransaction: Transaction;
  currentBalance: Scalars['BigInt'];
  duration?: Maybe<Scalars['BigInt']>;
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  stakeHistory?: Maybe<Array<VestingHistoryItem>>;
  startingBalance: Scalars['BigInt'];
  type: VestingContractType;
  user: User;
};

export type VestingContractStakeHistoryArgs = {
  first?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<VestingHistoryItem_OrderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  skip?: InputMaybe<Scalars['Int']>;
  where?: InputMaybe<VestingHistoryItem_Filter>;
};

export enum VestingContractType {
  Fish = 'Fish',
  FishTeam = 'FishTeam',
  Genesis = 'Genesis',
  Origins = 'Origins',
  Rewards = 'Rewards',
  Team = 'Team',
}

export type VestingContract_Filter = {
  cliff?: InputMaybe<Scalars['BigInt']>;
  cliff_gt?: InputMaybe<Scalars['BigInt']>;
  cliff_gte?: InputMaybe<Scalars['BigInt']>;
  cliff_in?: InputMaybe<Array<Scalars['BigInt']>>;
  cliff_lt?: InputMaybe<Scalars['BigInt']>;
  cliff_lte?: InputMaybe<Scalars['BigInt']>;
  cliff_not?: InputMaybe<Scalars['BigInt']>;
  cliff_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_gte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTimestamp_lt?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_lte?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not?: InputMaybe<Scalars['BigInt']>;
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  createdAtTransaction?: InputMaybe<Scalars['String']>;
  createdAtTransaction_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_gte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_lt?: InputMaybe<Scalars['String']>;
  createdAtTransaction_lte?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_contains?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_ends_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  createdAtTransaction_not_starts_with?: InputMaybe<Scalars['String']>;
  createdAtTransaction_starts_with?: InputMaybe<Scalars['String']>;
  currentBalance?: InputMaybe<Scalars['BigInt']>;
  currentBalance_gt?: InputMaybe<Scalars['BigInt']>;
  currentBalance_gte?: InputMaybe<Scalars['BigInt']>;
  currentBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  currentBalance_lt?: InputMaybe<Scalars['BigInt']>;
  currentBalance_lte?: InputMaybe<Scalars['BigInt']>;
  currentBalance_not?: InputMaybe<Scalars['BigInt']>;
  currentBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  duration?: InputMaybe<Scalars['BigInt']>;
  duration_gt?: InputMaybe<Scalars['BigInt']>;
  duration_gte?: InputMaybe<Scalars['BigInt']>;
  duration_in?: InputMaybe<Array<Scalars['BigInt']>>;
  duration_lt?: InputMaybe<Scalars['BigInt']>;
  duration_lte?: InputMaybe<Scalars['BigInt']>;
  duration_not?: InputMaybe<Scalars['BigInt']>;
  duration_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  startingBalance?: InputMaybe<Scalars['BigInt']>;
  startingBalance_gt?: InputMaybe<Scalars['BigInt']>;
  startingBalance_gte?: InputMaybe<Scalars['BigInt']>;
  startingBalance_in?: InputMaybe<Array<Scalars['BigInt']>>;
  startingBalance_lt?: InputMaybe<Scalars['BigInt']>;
  startingBalance_lte?: InputMaybe<Scalars['BigInt']>;
  startingBalance_not?: InputMaybe<Scalars['BigInt']>;
  startingBalance_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  type?: InputMaybe<VestingContractType>;
  type_in?: InputMaybe<Array<VestingContractType>>;
  type_not?: InputMaybe<VestingContractType>;
  type_not_in?: InputMaybe<Array<VestingContractType>>;
  user?: InputMaybe<Scalars['String']>;
  user_contains?: InputMaybe<Scalars['String']>;
  user_ends_with?: InputMaybe<Scalars['String']>;
  user_gt?: InputMaybe<Scalars['String']>;
  user_gte?: InputMaybe<Scalars['String']>;
  user_in?: InputMaybe<Array<Scalars['String']>>;
  user_lt?: InputMaybe<Scalars['String']>;
  user_lte?: InputMaybe<Scalars['String']>;
  user_not?: InputMaybe<Scalars['String']>;
  user_not_contains?: InputMaybe<Scalars['String']>;
  user_not_ends_with?: InputMaybe<Scalars['String']>;
  user_not_in?: InputMaybe<Array<Scalars['String']>>;
  user_not_starts_with?: InputMaybe<Scalars['String']>;
  user_starts_with?: InputMaybe<Scalars['String']>;
};

export enum VestingContract_OrderBy {
  Cliff = 'cliff',
  CreatedAtTimestamp = 'createdAtTimestamp',
  CreatedAtTransaction = 'createdAtTransaction',
  CurrentBalance = 'currentBalance',
  Duration = 'duration',
  EmittedBy = 'emittedBy',
  Id = 'id',
  StakeHistory = 'stakeHistory',
  StartingBalance = 'startingBalance',
  Type = 'type',
  User = 'user',
}

export type VestingHistoryItem = {
  __typename?: 'VestingHistoryItem';
  action: VestingHistoryItemAction;
  amount: Scalars['BigInt'];
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  lockedUntil: Scalars['BigInt'];
  staker: VestingContract;
  timestamp: Scalars['BigInt'];
  totalStaked: Scalars['BigInt'];
  transaction: Transaction;
};

export enum VestingHistoryItemAction {
  TeamTokensRevoked = 'TeamTokensRevoked',
  TokensStaked = 'TokensStaked',
  TokensWithdrawn = 'TokensWithdrawn',
}

export type VestingHistoryItem_Filter = {
  action?: InputMaybe<VestingHistoryItemAction>;
  action_in?: InputMaybe<Array<VestingHistoryItemAction>>;
  action_not?: InputMaybe<VestingHistoryItemAction>;
  action_not_in?: InputMaybe<Array<VestingHistoryItemAction>>;
  amount?: InputMaybe<Scalars['BigInt']>;
  amount_gt?: InputMaybe<Scalars['BigInt']>;
  amount_gte?: InputMaybe<Scalars['BigInt']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']>>;
  amount_lt?: InputMaybe<Scalars['BigInt']>;
  amount_lte?: InputMaybe<Scalars['BigInt']>;
  amount_not?: InputMaybe<Scalars['BigInt']>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  lockedUntil?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_gte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_in?: InputMaybe<Array<Scalars['BigInt']>>;
  lockedUntil_lt?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_lte?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not?: InputMaybe<Scalars['BigInt']>;
  lockedUntil_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  staker?: InputMaybe<Scalars['String']>;
  staker_contains?: InputMaybe<Scalars['String']>;
  staker_ends_with?: InputMaybe<Scalars['String']>;
  staker_gt?: InputMaybe<Scalars['String']>;
  staker_gte?: InputMaybe<Scalars['String']>;
  staker_in?: InputMaybe<Array<Scalars['String']>>;
  staker_lt?: InputMaybe<Scalars['String']>;
  staker_lte?: InputMaybe<Scalars['String']>;
  staker_not?: InputMaybe<Scalars['String']>;
  staker_not_contains?: InputMaybe<Scalars['String']>;
  staker_not_ends_with?: InputMaybe<Scalars['String']>;
  staker_not_in?: InputMaybe<Array<Scalars['String']>>;
  staker_not_starts_with?: InputMaybe<Scalars['String']>;
  staker_starts_with?: InputMaybe<Scalars['String']>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_gte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_in?: InputMaybe<Array<Scalars['BigInt']>>;
  totalStaked_lt?: InputMaybe<Scalars['BigInt']>;
  totalStaked_lte?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not?: InputMaybe<Scalars['BigInt']>;
  totalStaked_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
};

export enum VestingHistoryItem_OrderBy {
  Action = 'action',
  Amount = 'amount',
  EmittedBy = 'emittedBy',
  Id = 'id',
  LockedUntil = 'lockedUntil',
  Staker = 'staker',
  Timestamp = 'timestamp',
  TotalStaked = 'totalStaked',
  Transaction = 'transaction',
}

export type VoteCast = {
  __typename?: 'VoteCast';
  emittedBy: Scalars['Bytes'];
  id: Scalars['ID'];
  proposal: Proposal;
  proposalId: Scalars['BigInt'];
  support: Scalars['Boolean'];
  timestamp: Scalars['BigInt'];
  transaction: Transaction;
  voter: User;
  votes: Scalars['BigInt'];
};

export type VoteCast_Filter = {
  emittedBy?: InputMaybe<Scalars['Bytes']>;
  emittedBy_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_in?: InputMaybe<Array<Scalars['Bytes']>>;
  emittedBy_not?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_contains?: InputMaybe<Scalars['Bytes']>;
  emittedBy_not_in?: InputMaybe<Array<Scalars['Bytes']>>;
  id?: InputMaybe<Scalars['ID']>;
  id_gt?: InputMaybe<Scalars['ID']>;
  id_gte?: InputMaybe<Scalars['ID']>;
  id_in?: InputMaybe<Array<Scalars['ID']>>;
  id_lt?: InputMaybe<Scalars['ID']>;
  id_lte?: InputMaybe<Scalars['ID']>;
  id_not?: InputMaybe<Scalars['ID']>;
  id_not_in?: InputMaybe<Array<Scalars['ID']>>;
  proposal?: InputMaybe<Scalars['String']>;
  proposalId?: InputMaybe<Scalars['BigInt']>;
  proposalId_gt?: InputMaybe<Scalars['BigInt']>;
  proposalId_gte?: InputMaybe<Scalars['BigInt']>;
  proposalId_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposalId_lt?: InputMaybe<Scalars['BigInt']>;
  proposalId_lte?: InputMaybe<Scalars['BigInt']>;
  proposalId_not?: InputMaybe<Scalars['BigInt']>;
  proposalId_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  proposal_contains?: InputMaybe<Scalars['String']>;
  proposal_ends_with?: InputMaybe<Scalars['String']>;
  proposal_gt?: InputMaybe<Scalars['String']>;
  proposal_gte?: InputMaybe<Scalars['String']>;
  proposal_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_lt?: InputMaybe<Scalars['String']>;
  proposal_lte?: InputMaybe<Scalars['String']>;
  proposal_not?: InputMaybe<Scalars['String']>;
  proposal_not_contains?: InputMaybe<Scalars['String']>;
  proposal_not_ends_with?: InputMaybe<Scalars['String']>;
  proposal_not_in?: InputMaybe<Array<Scalars['String']>>;
  proposal_not_starts_with?: InputMaybe<Scalars['String']>;
  proposal_starts_with?: InputMaybe<Scalars['String']>;
  support?: InputMaybe<Scalars['Boolean']>;
  support_in?: InputMaybe<Array<Scalars['Boolean']>>;
  support_not?: InputMaybe<Scalars['Boolean']>;
  support_not_in?: InputMaybe<Array<Scalars['Boolean']>>;
  timestamp?: InputMaybe<Scalars['BigInt']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']>>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
  transaction?: InputMaybe<Scalars['String']>;
  transaction_contains?: InputMaybe<Scalars['String']>;
  transaction_ends_with?: InputMaybe<Scalars['String']>;
  transaction_gt?: InputMaybe<Scalars['String']>;
  transaction_gte?: InputMaybe<Scalars['String']>;
  transaction_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_lt?: InputMaybe<Scalars['String']>;
  transaction_lte?: InputMaybe<Scalars['String']>;
  transaction_not?: InputMaybe<Scalars['String']>;
  transaction_not_contains?: InputMaybe<Scalars['String']>;
  transaction_not_ends_with?: InputMaybe<Scalars['String']>;
  transaction_not_in?: InputMaybe<Array<Scalars['String']>>;
  transaction_not_starts_with?: InputMaybe<Scalars['String']>;
  transaction_starts_with?: InputMaybe<Scalars['String']>;
  voter?: InputMaybe<Scalars['String']>;
  voter_contains?: InputMaybe<Scalars['String']>;
  voter_ends_with?: InputMaybe<Scalars['String']>;
  voter_gt?: InputMaybe<Scalars['String']>;
  voter_gte?: InputMaybe<Scalars['String']>;
  voter_in?: InputMaybe<Array<Scalars['String']>>;
  voter_lt?: InputMaybe<Scalars['String']>;
  voter_lte?: InputMaybe<Scalars['String']>;
  voter_not?: InputMaybe<Scalars['String']>;
  voter_not_contains?: InputMaybe<Scalars['String']>;
  voter_not_ends_with?: InputMaybe<Scalars['String']>;
  voter_not_in?: InputMaybe<Array<Scalars['String']>>;
  voter_not_starts_with?: InputMaybe<Scalars['String']>;
  voter_starts_with?: InputMaybe<Scalars['String']>;
  votes?: InputMaybe<Scalars['BigInt']>;
  votes_gt?: InputMaybe<Scalars['BigInt']>;
  votes_gte?: InputMaybe<Scalars['BigInt']>;
  votes_in?: InputMaybe<Array<Scalars['BigInt']>>;
  votes_lt?: InputMaybe<Scalars['BigInt']>;
  votes_lte?: InputMaybe<Scalars['BigInt']>;
  votes_not?: InputMaybe<Scalars['BigInt']>;
  votes_not_in?: InputMaybe<Array<Scalars['BigInt']>>;
};

export enum VoteCast_OrderBy {
  EmittedBy = 'emittedBy',
  Id = 'id',
  Proposal = 'proposal',
  ProposalId = 'proposalId',
  Support = 'support',
  Timestamp = 'timestamp',
  Transaction = 'transaction',
  Voter = 'voter',
  Votes = 'votes',
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny',
}

export type UsersQueryVariables = Exact<{
  where?: InputMaybe<User_Filter>;
}>;

export type UsersQuery = {
  __typename?: 'Query';
  users: Array<{
    __typename?: 'User';
    id: string;
    userTotals?: {
      __typename?: 'UserTotal';
      totalMarginTradeVolumeUsd: string;
      totalAmmVolumeUsd: string;
      totalLendVolumeUsd: string;
      totalUnlendVolumeUsd: string;
      totalBorrowVolumeUsd: string;
      totalLiquidateVolumeUsd: string;
      totalCloseWithDepositVolumeUsd: string;
    } | null;
  }>;
};

export const UsersDocument = gql`
  query users($where: User_filter) {
    users(subgraphError: allow, where: $where) {
      id
      userTotals {
        totalMarginTradeVolumeUsd
        totalAmmVolumeUsd
        totalLendVolumeUsd
        totalUnlendVolumeUsd
        totalBorrowVolumeUsd
        totalLiquidateVolumeUsd
        totalCloseWithDepositVolumeUsd
      }
    }
  }
`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export function useUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    options,
  );
}
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;

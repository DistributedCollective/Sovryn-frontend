/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { IPairData } from '../LandingPage/components/CryptocurrencyPrices/types';
import { BigNumber } from 'ethers';

export const MARGIN_SLIPPAGE_DEFAULT = 0.5;

export interface MarginTradePageState {
  pairType: TradingPairType;
  collateral: Asset;
  amount: string;
  leverage: number;
  position: TradingPosition;
}

export interface TradingPairs {
  [0]: IPairData;
  [1]: IPairData;
  RBTC_source?: string;
}

export type ContainerState = MarginTradePageState;

type IApiBigNumber = {
  hex: string;
};

export type MarginLimitOrder = {
  hash?: string;
  loanId: string;
  leverageAmount: BigNumber;
  loanTokenAddress: string;
  loanTokenSent: BigNumber;
  collateralTokenSent: BigNumber;
  collateralTokenAddress: string;
  trader: string;
  minReturn: BigNumber;
  loanDataBytes: string;
  deadline: BigNumber;
  createdTimestamp: BigNumber;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filledAmount?: string;
  filled?: BigNumber;
};

export type IApiMarginLimitOrder = {
  loanId: string;
  leverageAmount: IApiBigNumber;
  loanTokenAddress: string;
  loanTokenSent: IApiBigNumber;
  collateralTokenSent: IApiBigNumber;
  collateralTokenAddress: string;
  trader: string;
  minReturn: IApiBigNumber;
  loanDataBytes: string;
  deadline: IApiBigNumber;
  createdTimestamp: IApiBigNumber;
  v: string;
  r: string;
  s: string;
  hash: string;
  canceled: boolean;
  filled: IApiBigNumber;
};

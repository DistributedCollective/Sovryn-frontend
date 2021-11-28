/* --- STATE --- */
import { TradingPairType } from 'utils/dictionaries/trading-pair-dictionary';
import { Asset } from 'types/asset';
import { TradingPosition } from '../../../types/trading-position';
import { IPairData } from '../LandingPage/components/CryptocurrencyPrices/types';
import { BigNumber } from 'ethers';

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

export type MarginLimitOrder = {
  hash?: string;
  maker: string;
  loanId: string;
  leverageAmount: string;
  loanTokenAddress: string;
  loanTokenSent: string;
  collateralTokenSent: string;
  collateralTokenAddress: string;
  trader: string;
  minReturn: string;
  loanDataBytes: string;
  deadline: BigNumber;
  createdTimestamp: BigNumber;
  v: string;
  r: string;
  s: string;
  canceled?: boolean;
  filledAmount?: string;
};

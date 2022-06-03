/*
 * Custom frontend perpUtils
 */

import { numberFromWei } from 'utils/blockchain/math-helpers';
import { gasLimit } from 'utils/classifiers';
import { TxType } from '../../../../store/global/transactions-store/types';
import {
  TraderState,
  AMMState,
  PerpParameters,
  perpUtils,
} from '@sovryn/perpetual-swap';
import { BigNumber } from 'ethers';

const { getTraderPnL, getMarkPrice, getRequiredMarginCollateral } = perpUtils;

/**
 * Get the unrealized Profit/Loss of a trader using mark price as benchmark. Reported in Base currency.
 * @param {AMMState} ammState - AMM state (for mark price and CCY conversion)
 * @param {TraderState} traderState - Trader state (for account balances)
 * @returns {number} PnL = value of position at mark price minus locked in value
 */
export function getTraderPnLInBC(
  traderState: TraderState,
  ammState: AMMState,
  perpParams: PerpParameters,
): number {
  return (
    getTraderPnL(traderState, ammState, perpParams) / getMarkPrice(ammState)
  );
}

/**
 * Get the amount of collateral required to obtain a given leverage with a given position size.
 * Considers the trading fees and gas fees.
 * @param {number} leverage - The leverage that the trader wants to achieve, given the position size
 * @param {number} targetPos  - The trader's (signed) target position in base currency
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @param {AMMState} ammData - AMM state
 * @param {TraderState} traderState - Trader state
 * @param {number} slippagePercent - optional. Specify slippage compared to mid-price that the trader is willing to accept
 * @param {boolean} useMetaTransactions - optional, default false. Adds gas fees to the total
 * @param {boolean} accountForExistingMargin - optional, default false. If true, subtracts existing margin and clamp to 0
 * @param {boolean} accountForExistingPosition - optional, default false. If false, the margin for a trade is calculated
 * @returns {number} balance required to arrive at the perpetual contract to obtain requested leverage
 */
export function getRequiredMarginCollateralWithGasFees(
  leverage: number,
  targetPos: number,
  perpParams: PerpParameters,
  ammData: AMMState,
  traderState: TraderState,
  slippagePercent: number = 0,
  useMetaTransactions: boolean = false,
  accountForExistingMargin: boolean = false,
  accountForExistingPosition: boolean = false,
) {
  let requiredCollateral = getRequiredMarginCollateral(
    leverage,
    targetPos,
    perpParams,
    ammData,
    traderState,
    slippagePercent,
    accountForExistingMargin,
    accountForExistingPosition,
  );

  if (useMetaTransactions) {
    requiredCollateral += numberFromWei(gasLimit[TxType.PERPETUAL_TRADE]);
  }

  return requiredCollateral;
}

// FIXME: move to @sovryn/perpetual-swap
export const MASK_CLOSE_ONLY = BigNumber.from(0x80000000);
export const MASK_MARKET_ORDER = BigNumber.from(0x40000000);
export const MASK_STOP_LOSS_ORDER = BigNumber.from(0x20000000);
export const MASK_TAKE_PROFIT_ORDER = BigNumber.from(0x10000000);
export const MASK_KEEP_POS_LEVERAGE = BigNumber.from(0x08000000);
export const MASK_LIMIT_ORDER = BigNumber.from(0x04000000);

/*
    Helper-functions for frontend
*/

import {
  calcKStar,
  shrinkToLot,
  calcPerpPrice,
  calculateMaintenanceMargin,
  calculateLiquidationPriceCollateralQuote,
  calculateLiquidationPriceCollateralQuanto,
  calculateLiquidationPriceCollateralBase,
  getPricesAndTradesForPercentRage,
  getMaxLeveragePosition,
  isTraderMarginSafe,
} from './perpMath';

/*---
// Suffix CC/BC/QC:
// CC: collateral currency, BC: base currency, QC: quote currency
// Examples:
// for BTCUSD collateralized in BTC: CC=BTC, BC=BTC, QC=USD
// for ETHUSD collateralized in BTC: CC=BTC, BC=ETH, QC=USD
// for TeslaUSD collateralized in BTC: CC=BTC, BC=Tesla, QC=USD
----*/

export interface PerpParameters {
  //get perpetual
  //base parameters
  fInitialMarginRateAlpha: number;
  fMarginRateBeta: number;
  fInitialMarginRateCap: number;
  fOpenInterest: number;
  fMaintenanceMarginRateAlpha: number;
  fTreasuryFeeRate: number;
  fPnLPartRate: number;
  fReferralRebateRate: number;
  fLiquidationPenaltyRate: number;
  fMinimalSpread: number;
  fLotSizeBC: number;
  fFundingRateClamp: number;
  fMarkPriceEMALambda: number;
  fSigma2: number;
  fSigma3: number;
  fRho23: number;
  // default fund / AMM fund
  fStressReturnS2_0: number;
  fStressReturnS2_1: number;
  fStressReturnS3_0: number;
  fStressReturnS3_1: number;
  fDFCoverNRate: number;
  fDFLambda_0: number;
  fDFLambda_1: number;
  fAMMTargetDD_0: number;
  fAMMTargetDD_1: number;
  fAMMMinSizeCC: number;
  fMinimalTraderExposureEMA: number;
  fMaximalTradeSizeBumpUp: number;
  // funding state
  fCurrentFundingRate: number;
  fUnitAccumulatedFunding: number;

  poolId: number;
  oracleS2Addr: string;
  oracleS3Addr: string;
}

export interface PerpCurrencySymbols {
  tradedPair: string; //BTCUSD
  collateralCurrency: string; //USDT
}

export interface AMMState {
  // values from AMM margin account:
  // L1 = -fLockedInValueQC
  // K2 = -fPositionBC
  L1: number;
  K2: number;
  // {M1, M2, M3} = -fLockedInValueQC
  M1: number;
  M2: number;
  M3: number;
  // PerpetualData.fCurrentTraderExposureEMA
  fCurrentTraderExposureEMA: number;
  // Oracle data:
  indexS2PriceData: number; // S2 price used in the current state of the contract
  indexS3PriceData: number; // S3 price used in the current state of the contract
  indexS2PriceDataOracle: number; // most up to date S2 price, can differ from contract price
  indexS3PriceDataOracle: number; // most up to date S4 price, can differ from contract price
  currentMarkPremiumRate: number;
  currentPremiumRate: number;
}

export interface LiqPoolState {
  fPnLparticipantsCashCC: number; // current P&L participants cash
  fAMMFundCashCC: number; // current sum of AMM funds cash
  fDefaultFundCashCC: number; // current default fund size
  iPriceUpdateTimeSec: number; // timestamp from block.timestamp
  fTargetAMMFundSize: number; //target AMM pool size for all perpetuals in pool (sum)
  fTargetDFSize: number; //target default fund size for all perpetuals in pool
  iLastTargetPoolSizeTime: number; //timestamp (seconds) since last update of fTargetDFSize and fTargetAMMFundSize
  iLastFundingTime: number; //timestamp since last funding rate update
  isRunning: boolean;
}

export interface TraderState {
  marginBalanceCC: number; // current margin balance
  availableMarginCC: number; // amount above initial margin (can be negative if below)
  availableCashCC: number; // cash minus unpaid funding
  marginAccountCashCC: number; // from margin account
  marginAccountPositionBC: number; // from margin account
  marginAccountLockedInValueQC: number; // from margin account
  fUnitAccumulatedFundingStart: number; // from margin account
}

/**
 * Get the maximal trade size for a trader with position currentPos (can be 0) for a given
 * perpetual, assuming enough margin is available (i.e. not considering leverage).
 * @param {number} currentPos - The current position of the trade (base currency), negative if short
 * @param {number} direction - {-1, 1} Does the trader want to buy (1), or sell (-1)
 * @param {LiqPoolState} liqPool - Contains current liq pool state data
 * @param {AMMState} ammData - Contains current price/state data
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @param {boolean} isQuanto - True if collateral currency of instrument is different from base and quote
 *                             currency (e.g., SP500 quoted in USD and collateralized in BTC,
 *                             false for BTCUSD backed in BTC)
 * @returns {number} signed position size that the trader can enter
 */
export function getMaximalTradeSizeInPerpetual(
  currentPos: number,
  direction: number,
  ammData: AMMState,
  liqPool: LiqPoolState,
  perpParams: PerpParameters,
): number {
  function getMaxSizeFromPrice(S2: number, S3: number): number {
    let kStar = calcKStar(
      ammData.K2,
      ammData.L1,
      S2,
      S3,
      ammData.M1,
      ammData.M2,
      ammData.M3,
      perpParams.fRho23,
      perpParams.fSigma2,
      perpParams.fSigma3,
    );
    let lotSize = perpParams.fLotSizeBC;
    kStar = shrinkToLot(kStar, lotSize);
    let fundingRatio = liqPool.fDefaultFundCashCC / liqPool.fTargetDFSize;
    let scale: number;
    if (direction === Math.sign(kStar)) {
      scale = perpParams.fMaximalTradeSizeBumpUp;
    } else {
      // adverse direction
      scale = perpParams.fMaximalTradeSizeBumpUp * Math.min(1, fundingRatio);
    }
    let maxAbsPositionSize = ammData.fCurrentTraderExposureEMA * scale;
    maxAbsPositionSize = shrinkToLot(maxAbsPositionSize, lotSize);
    let maxSignedTradeSize: number;
    if (direction < 0) {
      maxSignedTradeSize = Math.min(
        kStar,
        Math.min(-maxAbsPositionSize - currentPos, 0),
      );
    } else {
      maxSignedTradeSize = Math.max(
        kStar,
        Math.max(maxAbsPositionSize - currentPos, 0),
      );
    }
    return maxSignedTradeSize;
  }
  // calculate the max trade size based on the current oracle price and the latest price stored in the contract
  let maxSizeContractPx: number = getMaxSizeFromPrice(
    ammData.indexS2PriceData,
    ammData.indexS3PriceData,
  );
  let maxSizeOraclePx: number = getMaxSizeFromPrice(
    ammData.indexS2PriceDataOracle,
    ammData.indexS3PriceDataOracle,
  );
  return Math.min(maxSizeContractPx, maxSizeOraclePx);
}

/**
 * Extract the mark-price from AMMState-data
 * Use most up to date price data, which can differ from stored value in contract
 * @param {AMMState} ammData - Should contain current state of perpetual
 * @returns {number} mark price
 */

export function getMarkPrice(ammData: AMMState): number {
  return ammData.indexS2PriceDataOracle * (1 + ammData.currentMarkPremiumRate);
}

/**
 * Extract the index-price from AMMState-data
 * Use most up to date price data, which can differ from stored value in contract
 * @param {AMMState} ammData - Should contain current state of perpetual
 * @returns {number} index price
 */

export function getIndexPrice(ammData: AMMState): number {
  return ammData.indexS2PriceDataOracle;
}

/**
 * Extract the quanto-price from AMMState-data.
 * E.g., if ETHUSD backed in BTC, the BTCUSD price is the quanto-price
 * Use most up to date price data, which can differ from stored value in contract
 * @param {AMMState} ammData - Should contain current state of perpetual
 * @returns {number} quanto price (non-zero if 3rd currency involved)
 */

export function getQuantoPrice(ammData: AMMState): number {
  return ammData.indexS3PriceDataOracle;
}

/**
 * Get the trading fee rate, so that fee = abs(position)*rate
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @returns {number} fee relative to position size
 */

export function getTradingFeeRate(perpParams: PerpParameters): number {
  return perpParams.fTreasuryFeeRate + perpParams.fPnLPartRate;
}

/**
 * Get trading fee in collateral currency
 * @param {deltaPosition} number - Traded amount
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @returns {number} fee relative to position size
 */

export function getTradingFee(
  deltaPosition: number,
  perpParams: PerpParameters,
): number {
  return Math.abs(deltaPosition) * getTradingFeeRate(perpParams);
}

/**
 * Get initial margin rate
 * @param {number} position - The position for which we calculate the initial margin rate
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @returns {number} maintenance margin rate
 */

export function getInitialMarginRate(
  position: number,
  perpParams: PerpParameters,
): number {
  let cap = perpParams.fInitialMarginRateCap;
  return Math.min(
    perpParams.fInitialMarginRateAlpha +
      perpParams.fMarginRateBeta * Math.abs(position),
    cap,
  );
}

/**
 * Get maintenance margin rate
 * The margin requirement depends on the position size.
 * @param {number} position - The position for which we calculate the maintenance margin rate
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @returns {number} maintenance margin rate
 */
export function getMaintenanceMarginRate(
  position: number,
  perpParams: PerpParameters,
): number {
  return calculateMaintenanceMargin(
    perpParams.fInitialMarginRateAlpha,
    perpParams.fMaintenanceMarginRateAlpha,
    perpParams.fInitialMarginRateCap,
    perpParams.fMarginRateBeta,
    position,
  );
}

/**
 * Get the maximal leverage that is allowed by the initial margin requirement.
 * The margin requirement depends on the position size.
 * @param {number} position - The position for which we calculate the maximal initial leverage
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @returns {number} maximal leverage
 */

export function getMaxInitialLeverage(
  position: number,
  perpParams: PerpParameters,
): number {
  let mRate = getInitialMarginRate(position, perpParams);
  // leverage = 1 / marginrate
  return 1 / mRate;
}

/**
 * Get minimal short or maximal long position for trader. Direction=-1 for short, 1 for long
 * This function calculates the largest position considering
 * - leverage constraints
 * - position size constraint by AMM
 * - available funds in wallet balance and margin account
 * @param {number} direction - {-1, 1} Does the trader want to buy (1), or sell (-1)
 * @param {number} availableWalletBalance - trader's available wallet balance
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @param {traderState} TraderState - Contains trader state data
 * @param {AMMState} ammData  - Contains amm state data
 * @param {LiqPoolState} poolData - Contains liq pool state data
 * @returns {number} maintenance margin rate
 */

export function getSignedMaxAbsPositionForTrader(
  direction: number,
  availableWalletBalance: number,
  perpParams: PerpParameters,
  traderState: TraderState,
  ammData: AMMState,
  poolData: LiqPoolState,
): number {
  // max position = min(current position + maximal trade size, max position allowed by leverage constraint)
  let currentPos = traderState.marginAccountPositionBC;
  let maxSignedPos =
    currentPos +
    getMaximalTradeSizeInPerpetual(
      currentPos,
      direction,
      ammData,
      poolData,
      perpParams,
    );
  let availableCollateral =
    traderState.availableMarginCC + availableWalletBalance;
  if (availableCollateral < 0) {
    return 0;
  }

  let alpha = perpParams.fInitialMarginRateAlpha;
  let beta = perpParams.fMarginRateBeta;
  let fee = getTradingFeeRate(perpParams);
  let minimalSpread = perpParams.fMinimalSpread;
  let cash = traderState.availableCashCC;
  let posMargin = getMaxLeveragePosition(alpha, beta, cash, fee, minimalSpread);

  if (direction < 0) {
    return Math.max(-posMargin, maxSignedPos);
  } else {
    return Math.max(posMargin, maxSignedPos);
  }
}

/**
 * Calculate the worst price, the trader is willing to accept compared to the provided price
 * @param {number} currentMidPrice - The current price from which we calculate the slippage
 * @param {number} slippagePercent - The slippage that the trader is willing to accept. The number is in decimals (0.01=1%).
 * @param {number} direction - {-1, 1} Does the trader want to buy (1), or sell (-1)
 * @returns {number} worst acceptable price
 */
export function calculateSlippagePrice(
  currentMidPrice: number,
  slippagePercent: number,
  direction: number,
) {
  return currentMidPrice * (1 + Math.sign(direction) * slippagePercent);
}

/**
 * Calculate the worst price, the trader is willing to accept compared to the mid-price calculated as the average
 * of price(+lot) and price(-lot)
 * @param {PerpParameters} perpParams   - Perpetual Parameters
 * @param {AMMState} ammData            - AMM state data
 * @param {number} slippagePercent      - The slippage that the trader is willing to accept. The number is in decimals (0.01=1%).
 * @param {number} direction - {-1, 1} Does the trader want to buy (1), or sell (-1)
 * @returns {number} worst acceptable price
 */
export function calculateSlippagePriceFromMidPrice(
  perpParams: PerpParameters,
  ammData: AMMState,
  slippagePercent: number,
  direction: number,
) {
  const lot = perpParams.fLotSizeBC;
  let price =
    0.5 *
    (getPrice(-lot, perpParams, ammData) + getPrice(lot, perpParams, ammData));
  return calculateSlippagePrice(price, slippagePercent, direction);
}

/**
 * Conversion rate quote to collateral
 * Use most up to date price data
 * @param {AMMState} ammData - Contains current price/state data
 * @returns {number} conversion rate
 */

export function getQuote2CollateralFX(ammData: AMMState): number {
  if (ammData.M1 !== 0) {
    // quote
    return 1;
  } else if (ammData.M2 !== 0) {
    // base
    return 1 / ammData.indexS2PriceDataOracle;
  } else {
    // quanto
    return 1 / ammData.indexS3PriceDataOracle;
  }
}

/**
 * Conversion rate base to collateral
 * Use most up to date price data
 * @param {AMMState} ammData - Contains current price/state data
 * @param {boolean} atMarkPrice - conversion at spot or mark price
 * @returns {number} conversion rate
 */

export function getBase2CollateralFX(
  ammData: AMMState,
  atMarkPrice: boolean,
): number {
  let s2 = atMarkPrice
    ? (ammData.currentMarkPremiumRate + 1) * ammData.indexS2PriceDataOracle
    : ammData.indexS2PriceDataOracle;
  if (ammData.M1 !== 0) {
    // quote
    return s2;
  } else if (ammData.M2 !== 0) {
    // base
    return s2 / ammData.indexS2PriceDataOracle;
  } else {
    // quanto
    return s2 / ammData.indexS3PriceDataOracle;
  }
}

/**
 * Conversion rate base to quote
 * Use most up to date price data
 * @param {AMMState} ammData - Contains current price/state data
 * @param {boolean} atMarkPrice - conversion at spot or mark price
 * @returns {number} conversion rate
 */

export function getBase2QuoteFX(
  ammData: AMMState,
  atMarkPrice: boolean,
): number {
  let s2 = atMarkPrice
    ? (1 + ammData.currentMarkPremiumRate) * ammData.indexS2PriceDataOracle
    : ammData.indexS2PriceDataOracle;
  return s2;
}

/**
 * Calculate the price at which the perpetual will be liquidated
 * Example 1: trader has zero position and wants to trade 1 BTC --> tradeSize=1, traderCashAddedCC from getRequiredMarginCollateral
 * Example 2: trader has a position and wants to trade an additional 0.5 BTC --> tradeSize=0.5, traderCashAddedCC from getRequiredMarginCollateral
 * Example 3: trader already traded and wants to know current liq price --> tradeSize = 0, traderCashAddedCC = 0
 * current liquidation price:
 * @param {TraderState} traderState - Trader state (perpQueries.queryTraderState)
 * @param {AMMState} ammData - AMM state
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @param {number} tradeSize - The trade size (base currency), negative if short
 * @param {number} traderCashAddedCC - Cash of the trader that is added to the perpetual margin account if the trader trades
 *                                     use getRequiredMarginCollateral
 *
 * @returns {number} approximate liquidation price
 */

export function calculateApproxLiquidationPrice(
  traderState: TraderState,
  ammData: AMMState,
  perpParams: PerpParameters,
  tradeSize: number,
  traderCashAddedCC: number,
): number {
  let tradePrice = getPrice(tradeSize, perpParams, ammData);
  let newTraderCash = traderState.availableCashCC + traderCashAddedCC;
  let lockedInValueQC =
    traderState.marginAccountLockedInValueQC + tradeSize * tradePrice;
  let traderNewPosition = traderState.marginAccountPositionBC + tradeSize;
  let maintMarginRate = getMaintenanceMarginRate(traderNewPosition, perpParams);
  if (ammData.M1 !== 0) {
    // quote currency perpetual
    return calculateLiquidationPriceCollateralQuote(
      lockedInValueQC,
      traderNewPosition,
      newTraderCash,
      maintMarginRate,
    );
  } else if (ammData.M2 !== 0) {
    // base currency perpetual
    return calculateLiquidationPriceCollateralBase(
      lockedInValueQC,
      traderNewPosition,
      newTraderCash,
      maintMarginRate,
    );
  } else if (ammData.M3 !== 0) {
    // quanto currency perpetual
    // we calculate a price that leads to a liquidation according to the
    // instrument parameters sigma2/3, rho and current prices
    return calculateLiquidationPriceCollateralQuanto(
      lockedInValueQC,
      traderNewPosition,
      newTraderCash,
      maintMarginRate,
      ammData.indexS3PriceDataOracle,
    );
  }
  return -1;
}

/**
 * Get the amount of collateral required to obtain a given leverage with a given position size.
 * Considers the trading fees and the collateral already deposited.
 * @param {number} leverage - The leverage that the trader wants to achieve, given the position size
 * @param {number} targetPos  - The trader's (signed) target position in base currency
 * @param {number} base2collateral  - If the base currency is different than the collateral. If base is BTC, collateral is USD, this would be 100000 (the USD amount for 1 BTC)
 * @param {PerpParameters} perpParams - Contains parameter of the perpetual
 * @param {AMMState} ammData - AMM state
 * @param {number} slippagePercent - optional. Specify slippage compared to mid-price that the trader is willing to accept
 * @returns {number} balance required to arrive at the perpetual contract to obtain requested leverage
 */
export function getRequiredMarginCollateral(
  leverage: number,
  targetPos: number,
  perpParams: PerpParameters,
  ammData: AMMState,
  traderState: TraderState,
  slippagePercent = 0,
): number {
  let currentPos = traderState.marginAccountPositionBC;
  let positionToTrade = targetPos - currentPos;
  let feesBC = Math.abs(positionToTrade) * getTradingFeeRate(perpParams);
  let dir = Math.sign(positionToTrade);
  let slippagePrice = calculateSlippagePriceFromMidPrice(
    perpParams,
    ammData,
    slippagePercent,
    dir,
  );
  let tradeAmountPrice = getPrice(positionToTrade, perpParams, ammData);
  tradeAmountPrice =
    dir > 0
      ? Math.max(tradeAmountPrice, slippagePrice)
      : Math.min(tradeAmountPrice, slippagePrice);
  let base2collateral = getBase2CollateralFX(ammData, false);
  let quote2collateral = getQuote2CollateralFX(ammData);

  // leverage = position/margincollateral
  // Protocol fees are subtracted from the margincollateral
  // Hence: leverage = position/(margincollateral - fees)
  //   -> margincollateral =  position/leverage + pnl + fees
  let Sm = getMarkPrice(ammData);
  let initialPnLQC =
    currentPos * getMarkPrice(ammData) -
    traderState.marginAccountLockedInValueQC;
  let buffer = Math.abs(positionToTrade) * perpParams.fMinimalSpread * Sm;
  let newPnLQC = positionToTrade * (Sm - tradeAmountPrice) - buffer;
  let pnlCC = (initialPnLQC + newPnLQC) * quote2collateral;
  /*
  console.log("newPnLQC = ", newPnLQC)
  console.log("pnlCC = ", pnlCC)
  console.log("base2collateral = ", base2collateral)
  console.log("leverage = ", leverage)
  console.log("feesBC = ", feesBC)
  console.log("coll base = ", Math.abs(targetPos) * base2collateral / leverage)*/
  let collRequired =
    (Math.abs(targetPos) * base2collateral) / leverage -
    pnlCC +
    feesBC * base2collateral;
  // account for collateral already deposited
  return Math.max(0, collRequired - traderState.availableCashCC);
}

/**
 * Get the unrealized Profit/Loss of a trader using mark price as benchmark. Reported in Quote currency.
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @param {TraderState} traderState - Trader state (for account balances)
 * @returns {number} PnL = value of position at mark price minus locked in value
 */

export function getTraderPnL(
  traderState: TraderState,
  ammData: AMMState,
  perpData: PerpParameters,
  limitPrice: number = NaN,
): number {
  let price = isNaN(limitPrice) ? getMarkPrice(ammData) : limitPrice;
  let tradePnL =
    traderState.marginAccountPositionBC * price -
    traderState.marginAccountLockedInValueQC;
  let fundingPnL =
    getFundingFee(traderState, perpData) / getQuote2CollateralFX(ammData);
  return tradePnL - fundingPnL;
}

/**
 * Get the current leverage of a trader using mark price as benchmark.
 * See chapter "Lemmas / Leverage" in whitepaper
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @param {TraderState} traderState - Trader state (for account balances)
 * @returns {number} current leverage for the trader
 */

export function getTraderLeverage(
  traderState: TraderState,
  ammData: AMMState,
): number {
  let pnlQC =
    traderState.marginAccountPositionBC * getMarkPrice(ammData) -
    traderState.marginAccountLockedInValueQC;
  let b = pnlQC * getQuote2CollateralFX(ammData) + traderState.availableCashCC;
  return (
    (Math.abs(traderState.marginAccountPositionBC) *
      getBase2CollateralFX(ammData, false)) /
    b
  );
}

/**
 * Get the unrealized Profit/Loss of a trader using mark price as benchmark. Reported in collateral currency
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @param {TraderState} traderState - Trader state (for account balances)
 * @returns {number} PnL = value of position at mark price minus locked in value
 */

export function getTraderPnLInCC(
  traderState: TraderState,
  ammData: AMMState,
  perpData: PerpParameters,
  price: number = NaN,
): number {
  return (
    getQuote2CollateralFX(ammData) *
    getTraderPnL(traderState, ammData, perpData, price)
  );
}

/**
 * Get the unpaid, accumulated funding rate in collateral currency
 * @param {TraderState} traderState - Trader state (for account balances)
 * @param {PerpParameters} perpData - Perp parameters
 * @returns {number} PnL = value of position at mark price minus locked in value
 */

export function getFundingFee(
  traderState: TraderState,
  perpData: PerpParameters,
): number {
  let fCurrentFee =
    perpData.fUnitAccumulatedFunding - traderState.fUnitAccumulatedFundingStart;
  // if the fee is positive, the long pays the short receives and vice versa
  // hence no abs(position) required
  return fCurrentFee * traderState.marginAccountPositionBC;
}

/**
 * Get the mid-price based on 0 quantity (no bid-ask spread)
 * Uses the most recent index data (from Oracle), which might differ
 * from the stored data in the contract
 * @param {PerpParameters} perpData - Perp parameters
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @returns {number} PnL = value of position at mark price minus locked in value
 */

export function getMidPrice(
  perpParams: PerpParameters,
  ammData: AMMState,
): number {
  return getPrice(0, perpParams, ammData);
}

/**
 * Calculates the price using the most recent Oracle price data
 * (might differ from the oracle price stored in the contract)
 *
 * @param {number} tradeSize size of the trade
 * @param {PerpParameters} perpData Perpetual data
 * @param {AMMState} ammData - AMM data
 * @returns An array containing [prices, % deviation from mid price ((price - mid-price)/mid-price), trade amounts]
 */

export function getPrice(
  tradeSize: number,
  perpParams: PerpParameters,
  ammData: AMMState,
): number {
  let k = tradeSize;
  let r = 0;
  return calcPerpPrice(
    ammData.K2,
    k,
    ammData.L1,
    ammData.indexS2PriceDataOracle,
    ammData.indexS3PriceDataOracle,
    perpParams.fSigma2,
    perpParams.fSigma3,
    perpParams.fRho23,
    r,
    ammData.M1,
    ammData.M2,
    ammData.M3,
    perpParams.fMinimalSpread,
  );
}

/**
 * Builds the depth matrix using the bid-ask spread to construct prices and trade amounts:
 * - Short prices are equi-spaced from the unit price of an infinitesimal short
 * - Long prices are equi-spaced from the unit price of an infinitesimal long
 * e.g. for -0.4%, we find a trade amount k such that (price(-k) - price(-0)) / price(-0) = -0.4%
 * note that the mid-price is (price(+0) + price(-0)) / 2
 *
 * Uses prices based on the recent oracle data, which can differ from the contract's price entry.
 * @param {PerpParameters} perpData Perpetual data
 * @param {AMMState} ammData - AMM data
 * @returns An array containing [prices, % deviation from mid price ((price - mid-price)/mid-price), trade amounts]
 */

export function getDepthMatrix(perpData: PerpParameters, ammData: AMMState) {
  let pctRange = [
    1.0,
    0.9,
    0.8,
    0.7,
    0.6,
    0.5,
    0.4,
    0.3,
    0.2,
    0,
    -0.2,
    -0.3,
    -0.4,
    -0.5,
    -0.6,
    -0.7,
    -0.8,
    -0.9,
    -1.0,
  ];
  return getPricesAndTradesForPercentRage(
    ammData.K2,
    ammData.L1,
    ammData.indexS2PriceDataOracle,
    ammData.indexS3PriceDataOracle,
    perpData.fSigma2,
    perpData.fSigma3,
    perpData.fRho23,
    0,
    ammData.M1,
    ammData.M2,
    ammData.M3,
    perpData.fMinimalSpread,
    perpData.fLotSizeBC,
    pctRange,
  );
}

/**
 * Builds the depth matrix using the bid-ask spread to construct prices and trade amounts:
 * - Short prices are equi-spaced from the unit price of an infinitesimal short
 * - Long prices are equi-spaced from the unit price of an infinitesimal long
 * e.g. for -0.4%, we find a trade amount k such that (price(-k) - price(-0)) / price(-0) = -0.4%
 * note that the mid-price is (price(+0) + price(-0)) / 2
 *
 * Uses prices based on the recent oracle data, which can differ from the contract's price entry.
 * @param {TraderState} traderState - Trader state (for account balances)
 * @param {PerpParameters} perpData Perpetual data
 * @param {AMMState} ammData - AMM data
 * @returns An array containing [prices, % deviation from mid price ((price - mid-price)/mid-price), trade amounts]
 */

export function isTraderMaintenanceMarginSafe(
  traderState: TraderState,
  perpParams: PerpParameters,
  ammData: AMMState,
) {
  let tau = getMaintenanceMarginRate(
    traderState.marginAccountPositionBC,
    perpParams,
  );
  let m = traderState.availableCashCC;
  let s3 = 1 / getQuote2CollateralFX(ammData);
  return isTraderMarginSafe(
    tau,
    traderState.marginAccountPositionBC,
    getMarkPrice(ammData),
    traderState.marginAccountLockedInValueQC,
    ammData.indexS2PriceDataOracle,
    s3,
    m,
  );
}

// CUSTOM FRONTEND UTILS =======================================================

/**
 * calculate Leverage for new Position.
 * @param {number} targetPositionSizeBC - new target position size
 * @param {TraderState} traderState - Trader state (for account balances)
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @returns {number} current leverage for the trader
 */
export function calculateLeverageForPosition(
  targetPositionSizeBC: number,
  traderState: TraderState,
  ammData: AMMState,
): number {
  return (
    Math.abs(targetPositionSizeBC * getBase2CollateralFX(ammData, true)) /
    traderState.availableCashCC
  );
}

/**
 * calculate Leverage for new Margin.
 * @param {number} targetMarginCC - new target margin
 * @param {TraderState} traderState - Trader state (for account balances)
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @returns {number} current leverage for the trader
 */
export function calculateLeverageForMargin(
  targetMarginCC: number,
  traderState: TraderState,
  ammData: AMMState,
): number {
  return (
    Math.abs(
      traderState.marginAccountPositionBC * getBase2CollateralFX(ammData, true),
    ) / targetMarginCC
  );
}

/**
 * calculate Leverage for new Margin and Position.
 * @param {number} targetPositionSizeBC - new target position size
 * @param {number} targetMarginCC - new target margin
 * @param {AMMState} ammData - AMM state (for mark price and CCY conversion)
 * @returns {number} current leverage for the trader
 */
export function calculateLeverage(
  targetPositionSizeBC: number,
  targetMarginCC: number,
  ammData: AMMState,
): number {
  return (
    Math.abs(targetPositionSizeBC * getBase2CollateralFX(ammData, true)) /
    targetMarginCC
  );
}

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

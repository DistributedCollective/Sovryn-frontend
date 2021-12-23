import { BigNumber, ethers } from 'ethers';
import * as mathjs from 'mathjs';
const BN = ethers.BigNumber;
const ONE_64x64 = BN.from('0x10000000000000000');
const DECIMALS = BN.from(10).pow(BN.from(18));

// constants based on enums
export const COLLATERAL_CURRENCY_QUOTE = 0;
export const COLLATERAL_CURRENCY_BASE = 1;
export const COLLATERAL_CURRENCY_QUANTO = 2;
export const PerpetualStateINVALID = 0;
export const PerpetualStateINITIALIZING = 1;
export const PerpetualStateNORMAL = 2;
export const PerpetualStateEMERGENCY = 3;
export const PerpetualStateCLEARED = 4;

export function cdfNormalStd(x: number, mu = 0, sig = 1) {
  return 0.5 * (1 + mathjs.erf((x - mu) / (sig * Math.sqrt(2))));
}

export function calculateMaintenanceMarginRate(
  fInitialMarginRateAlpha,
  fMaintenanceMarginRateAlpha,
  fInitialMarginRateCap,
  fMarginRateBeta,
  pos,
) {
  let cap =
    fInitialMarginRateCap +
    fMaintenanceMarginRateAlpha -
    fInitialMarginRateAlpha;
  return Math.min(
    fMaintenanceMarginRateAlpha + fMarginRateBeta * Math.abs(pos),
    cap,
  );
}

export function calculateInitialMarginRate(
  fInitialMarginRateAlpha,
  fMaintenanceMarginRateAlpha,
  fInitialMarginRateCap,
  fMarginRateBeta,
  pos,
): number {
  return Math.min(
    fInitialMarginRateAlpha + fMarginRateBeta * Math.abs(pos),
    fInitialMarginRateCap,
  );
}

/**
 * Determine amount to be deposited into margin account so that the given leverage
 * is obtained when trading a position pos (trade amount = position)
 * @param {number} pos - target position
 * @param {number} leverage - target leverage
 * @param {number} price - price to trade amount 'pos'
 * @param {number} S2 - index price S2
 * @param {number} S3 - collateral to quote conversion (=S2 if base-collateral, =1 if quote collateral, = index S3 if quanto)
 * @param {number} S2Mark - mark price
 * @param {number} totalFeeRate - total fee rates (PNL participants + treasury fee)
 * @returns {number} Amount to be deposited to have the given leverage when trading into position pos
 */
export function getDepositAmountForLvgPosition(
  pos: number,
  leverage: number,
  price: number,
  S2: number,
  S3: number,
  S2Mark: number,
  totalFeeRate: number,
) {
  let a = (Math.abs(pos) * S2Mark) / leverage;
  let pnl = pos * (S2Mark - price);
  let fees = Math.abs(pos) * totalFeeRate * S2;
  return (a - pnl + fees) / S3;
}

/**
 * Determine amount to be deposited into margin account so that the given leverage
 * is obtained when trading a position pos (trade amount = position)
 * @param {number} LockedInValueQC - trader locked in value in quote currency
 * @param {number} position - trader position in base currency
 * @param {number} cash_cc - trader available margin cash in collateral currency
 * @param {number} maintenance_margin_ratio - maintenance margin ratio
 * @param {number} S3 - collateral to quote conversion (=S2 if base-collateral, =1 if quuote collateral, = index S3 if quanto)
 * @returns {number} Amount to be deposited to have the given leverage when trading into position pos
 */
export function calculateLiquidationPriceCollateralBase(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
): number {
  // correct only if markprice = spot price
  return (
    LockedInValueQC /
    (position - maintenance_margin_ratio * Math.abs(position) + cash_cc)
  );
}

/**
 * Determine amount to be deposited into margin account so that the given leverage
 * is obtained when trading a position pos (trade amount = position)
 * @param {number} LockedInValueQC - trader locked in value in quote currency
 * @param {number} position - trader position in base currency
 * @param {number} cash_cc - trader available margin cash in collateral currency
 * @param {number} maintenance_margin_ratio - maintenance margin ratio
 * @param {number} S3 - collateral to quote conversion (=S2 if base-collateral, =1 if quuote collateral, = index S3 if quanto)
 * @returns {number} Amount to be deposited to have the given leverage when trading into position pos
 */
export function calculateLiquidationPriceCollateralQuanto(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
  S3,
): number {
  // correct only if markprice = spot price and S3 unchanged
  return (
    (-LockedInValueQC + cash_cc * S3) /
    (maintenance_margin_ratio * Math.abs(position) - position)
  );
}

/**
 * Determine amount to be deposited into margin account so that the given leverage
 * is obtained when trading a position pos (trade amount = position)
 * @param {number} LockedInValueQC - trader locked in value in quote currency
 * @param {number} position - trader position in base currency
 * @param {number} cash_cc - trader available margin cash in collateral currency
 * @param {number} maintenance_margin_ratio - maintenance margin ratio
 * @param {number} S3 - collateral to quote conversion (=S2 if base-collateral, =1 if quuote collateral, = index S3 if quanto)
 * @returns {number} Amount to be deposited to have the given leverage when trading into position pos
 */
export function calculateLiquidationPriceCollateralQuote(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
): number {
  // correct only if markprice = spot price
  return calculateLiquidationPriceCollateralQuanto(
    LockedInValueQC,
    position,
    cash_cc,
    maintenance_margin_ratio,
    1,
  );
}

/**
 * Determine whether the trader is maintenance margin safe, given the required target margin rate tau.
 * @param {number} tau  - target margin rate (e.g., the maintenance margin rate)
 * @param {number} position  - traders position
 * @param {number} markPrice - mark price
 * @param {number} lockedInValueQC - traders locked in value
 * @param {number} S2 - index price S2, base to quote conversion
 * @param {number} S3 - collateral to quote conversion
 * @param {number} m - trader collateral in collateral currency
 * @returns {number} Amount to be liquidated (in base currency)
 */
export function isTraderMarginSafe(
  tau: number,
  position: number,
  markPrice: number,
  lockedInValueQC: number,
  S2: number,
  S3: number,
  m: number,
): boolean {
  let b = calculateMarginBalance(position, markPrice, lockedInValueQC, S3, m);
  let marginRequirement = (Math.abs(position) * tau * S2) / S3;
  return b > marginRequirement;
}

/**
 * Determine amount to be liquidated. If positive sell, if negative buy.
 * @param {number} marginBalanceCC - Current margin balance in collateral currency
 * @param {number} mntncMarginRate - Maintenance margin rate
 * @param {number} targetMarginRate - Margin rate target for after liquidation
 * @param {number} traderPositionBC - Current trader position
 * @param {number} liquidationFee - liquidation fee rate, applied to position size (base currency) being liquidated
 * @param {number} tradingFee - trading fee rate, applied to position size (base currency) being liquidated
 * @param {number} lotSize - lot size (base currency)
 * @param {number} S2 - index price (base to quote)
 * @param {number} S3 - collateral to quote conversion
 * @param {number} Sm - mark price (base to quote conversion)
 * @returns {number} Amount to be liquidated (in base currency)
 */
export function calculateLiquidationAmount(
  marginBalanceCC: number,
  mntncMarginRate: number,
  targetMarginRate: number,
  traderPositionBC: number,
  liquidationFee: number,
  tradingFee: number,
  lotSize: number,
  S3: number,
  S2: number,
  Sm: number,
) {
  console.assert(mntncMarginRate < targetMarginRate);
  if (
    marginBalanceCC * S3 >
    mntncMarginRate * Math.abs(traderPositionBC) * S2
  ) {
    // margin safe
    return 0;
  }
  let f = liquidationFee + tradingFee;
  // if the current margin balance does not exceed the fees,
  // we need to liquidate the whole position
  if (!(marginBalanceCC > (Math.abs(traderPositionBC) * f * S2) / S3)) {
    return traderPositionBC;
  }
  let nom =
    Math.abs(traderPositionBC) * targetMarginRate * Sm - marginBalanceCC * S3;
  let deltapos =
    nom / (Math.sign(traderPositionBC) * (targetMarginRate * Sm - f * S2));
  // now round to lot
  deltapos = growToLot(deltapos, lotSize);
  return deltapos;
}

/**
 * Calculate margin balance in collateral currency for a trader
 * See alternative function below
 * @param {number} pos - position (base currency)
 * @param {number} LockedInValueQC - trader locked in value in quote currency
 * @param {number} S2 - Index S2
 * @param {number} S3 - Index S3 (can be zero if not quanto)
 * @param {number} markPremium - mark price premium in quote currency
 * @param {number} cashCC - collateral
 * @param {number} collateralCurrencyIndex - [0,1,2]
 * @returns {number} margin balance
 */
export function getMarginBalanceCC(
  pos: number,
  LockedInValueQC: number,
  S2: number,
  S3: number,
  markPremium: number,
  cashCC: number,
  collateralCurrencyIndex: number,
): number {
  let q2c = getQuote2CollateralFX(S2, S3, collateralCurrencyIndex);
  return (pos * (S2 + markPremium) - LockedInValueQC) * q2c + cashCC;
}

/**
 * Calculate margin balance in collateral currency for a trader
 * See alternative function above
 * @param {number} position  - traders position
 * @param {number} markPrice - mark price
 * @param {number} lockedInValueQC - traders locked in value
 * @param {number} S3 - collateral to quote conversion
 * @param {number} m - trader collateral in collateral currency
 * @returns {number} Amount to be liquidated (in base currency)
 */
export function calculateMarginBalance(
  position: number,
  markPrice: number,
  lockedInValueQC: number,
  S3: number,
  m: number,
): number {
  return (position * markPrice - lockedInValueQC) / S3 + m;
}

/**
 * Check whether margin is safe for given marginrate
 * @param {number} pos - position (base currency)
 * @param {number} LockedInValueQC - trader locked in value in quote currency
 * @param {number} S2 - Index S2
 * @param {number} S3 - Index S3 (can be zero if not quanto)
 * @param {number} markPremium - mark price premium in quote currency
 * @param {number} cashCC - collateral
 * @param {number} collateralCurrencyIndex - [COLLATERAL_CURRENCY_BASE, COLLATERAL_CURRENCY_QUOTE, COLLATERAL_CURRENCY_QUANTO]
 * @returns {bool} margin balance > Math.abs(pos) * marginrate * b2c;
 */
export function isMarginSafe(
  pos: number,
  LockedInValueQC: number,
  cashCC: number,
  S2: number,
  S3: number,
  markPremium: number,
  collateralCurrencyIndex: number,
  marginrate: number,
): boolean {
  let b2c = getBase2CollateralFX(
    S2,
    S3,
    markPremium,
    collateralCurrencyIndex,
    false,
  );
  let M = getMarginBalanceCC(
    pos,
    LockedInValueQC,
    S2,
    S3,
    markPremium,
    cashCC,
    collateralCurrencyIndex,
  );
  return M > Math.abs(pos) * marginrate * b2c;
}

export function getQuote2CollateralFX(
  indexS2: number,
  indexS3: number,
  collateralCurrencyIndex: number,
): number {
  if (collateralCurrencyIndex == COLLATERAL_CURRENCY_QUOTE) {
    // quote
    return 1;
  } else if (collateralCurrencyIndex == COLLATERAL_CURRENCY_BASE) {
    // base
    return 1 / indexS2;
  } else {
    console.assert(collateralCurrencyIndex == COLLATERAL_CURRENCY_QUANTO);
    // quanto
    return 1 / indexS3;
  }
}

/**
 * Conversion rate base to collateral
 * @param {number} indexS2 - Contains current S2 price data
 * @param {number} indexS3 - Contains current S3 price data
 * @param {number} markPremium - mark price premium (amount above index in quote currency)
 * @param {number} collateral_currency_index - COLLATERAL_CURRENCY_QUOTE, COLLATERAL_CURRENCY_BASE or COLLATERAL_CURRENCY_QUANTO
 * @param {boolean} atMarkPrice - conversion at spot or mark price
 * @returns {number} conversion rate
 */

export function getBase2CollateralFX(
  indexS2: number,
  indexS3: number,
  markPremium: number,
  collateral_currency_index: number,
  atMarkPrice: boolean,
): number {
  let s2 = atMarkPrice ? markPremium + indexS2 : indexS2;
  if (collateral_currency_index == COLLATERAL_CURRENCY_QUOTE) {
    // quote
    return s2;
  } else if (collateral_currency_index == COLLATERAL_CURRENCY_BASE) {
    // base
    return s2 / indexS2;
  } else {
    // quanto
    return s2 / indexS3;
  }
}

export function findRoot(f: Function, x: number) {
  // TODO: lots of clean-up and this fails in corner cases
  let numIter = 100;
  const dx = 1e-6;
  const fTol = 1e-10;
  let y = x + 0.001;

  for (let i = 0; i < numIter; i++) {
    let f1 = f(x);

    if (Math.abs(f1) < fTol) {
      console.log('converged in', i, 'iterations');
      break;
    }

    let f2 = f(y);
    let num = x * f2 - y * f1;
    let den = f2 - f1;
    if (Math.abs(den) < 10 * fTol && Math.abs(num) > fTol) {
      y = y + 0.1;
      f2 = f(y);
      num = x * f2 - y * f1;
      den = f2 - f1;
    }
    let tmp = y;
    y = num / den;
    x = tmp;
    //let f2 = f(x - dx);
    //let f3 = f(x + dx);
    //let fpp = (f2 + f3 - 2 * f1) / dx / dx;
    //let fp = 0.5 * (f3 - f2) / dx;
    // console.log("iter", i, ":");
    // console.log("x=", x, "x-dx=", x - dx, "x+dx=", x + dx);
    // console.log("f(x)=", f1, "f(x+dx)=", f3, "f(x-dx)=", f2);
    // console.log("f'(x)~", fp, "f''(x)~", fpp );
    //x = x - f1 / fp;
    //x = x - 2 * f1 * fp / (2 * fp * fp - f1 * fpp);
    //x = x - 2 * f1 / (2 * fp  - f1 * fpp / fp);
  }
  console.log('failed to converge in', numIter, 'iterations');
  return x;
}

export function probDefNoQuanto(
  K2: number,
  L1: number,
  s2: number,
  sig2: number,
  r: number,
  M1: number,
  M2: number,
): number[] {
  // default probability for collateral not in quanto currency
  if (M2 - K2 >= 0 && -L1 - M1 <= 0) {
    return [0, -20];
  }
  if (M2 - K2 <= 0 && -L1 - M1 > 0) {
    return [1, 20];
  }
  let muY = r - 0.5 * sig2 ** 2;
  let denom = s2 * (M2 - K2);
  let Qplus_score = Math.log((-L1 - M1) / denom) - muY;
  let dd = Qplus_score / sig2;

  if (M2 - K2 < 0) {
    dd = -dd;
  }
  let Qplus = cdfNormalStd(dd);
  return [Qplus, dd];
}

export function probDefQuanto(
  K2: number,
  L1: number,
  S2: number,
  S3: number,
  sig2: number,
  sig3: number,
  rho: number,
  r: number,
  M1: number,
  M2: number,
  M3: number,
) {
  //insurance premium for given level m of quanto fund (M3:=m)
  if (M2 - K2 >= 0 && -L1 - M1 <= 0) {
    return [0, -20];
  }
  let C3 = (M2 * S2 - K2 * S2) / M3 / S3;
  let sigz = Math.sqrt(getVarianceZWithC(r, sig2, sig3, rho, C3));
  let muz = Math.exp(r) * (1 + C3);
  let dd = ((-L1 - M1) / (S3 * M3) - muz) / sigz;
  let qobs = cdfNormalStd(dd);
  return [qobs, dd];
}

function getVarianceZWithC(
  r: number,
  sig2: number,
  sig3: number,
  rho: number,
  C3: number,
) {
  // helper function for probdefquanto
  return (
    Math.exp(2 * r) *
    ((Math.exp(sig2 ** 2) - 1) * C3 ** 2 +
      (Math.exp(sig3 ** 2) - 1) +
      2 * (Math.exp(sig2 * sig3 * rho) - 1) * C3)
  );
}

/**
 * Round value to precision.
 * Replicates the smart contract specification of this function.
 * @param {number} value - number to be rounded
 * @param {number} lotSize - size of the lot (e.g., 0.0001)
 * @returns {number} rounded value
 */
export function roundToLot(value: number, lotSize: number): number {
  //int128 rounded = _fAmountBC.div(fLotSizeBC).add(0x8000000000000000) >> 64;
  //    return (rounded << 64).mul(fLotSizeBC);
  return ABK64x64ToFloat(roundToLotBN(value, lotSize));
}

/**
 * Round value to precision. Replicates the smart contract specification of this function.
 * @param {number} value - float, number to be rounded
 * @param {number} lotSize - float, size of the lot (e.g., 0.0001)
 * @returns {BigNumber} rounded value in ABDK64.64 BigNumber format
 */
export function roundToLotBN(value: number, lotSize: number): BigNumber {
  //int128 rounded = _fAmountBC.div(fLotSizeBC).add(0x8000000000000000) >> 64;
  //    return (rounded << 64).mul(fLotSizeBC);
  let fValue = floatToABK64x64(Math.abs(value));
  let fLotSize = floatToABK64x64(lotSize);
  let rounded = div64x64(fValue, fLotSize).add(
    BigNumber.from('0x8000000000000000'),
  );
  rounded = rounded.div(BigNumber.from('18446744073709551616'));
  rounded = rounded.mul(BigNumber.from('18446744073709551616'));
  let res = mul64x64(rounded, fLotSize);
  return value < 0 ? res.mul(-1) : res;
}

/**
 * Round value down (towards zero) to precision
 * @param {number} value - number to be rounded
 * @param {number} lotSize - size of the lot (e.g., 0.0001)
 * @returns {number} rounded value
 */
export function shrinkToLot(value: number, lotSize: number): number {
  if (value < 0) {
    return Math.ceil(value / lotSize) * lotSize;
  }
  return Math.floor(value / lotSize) * lotSize;
}

/**
 * Round value up (away from zero) to precision
 * @param {number} value - number to be rounded
 * @param {number} lotSize - size of the lot (e.g., 0.0001)
 * @returns {number} rounded value
 */
export function growToLot(value: number, lotSize: number): number {
  if (value < 0) {
    return Math.floor(value / lotSize) * lotSize;
  }
  return Math.ceil(value / lotSize) * lotSize;
}

export function calcKStar(
  K2: number,
  L1: number,
  S2: number,
  S3: number,
  M1: number,
  M2: number,
  M3: number,
  rho: number,
  sig2: number,
  sig3: number,
) {
  let kStar = M2 - K2;
  if (M3 != 0) {
    let h =
      (((S3 / S2) * (Math.exp(rho * sig2 * sig3) - 1)) /
        (Math.exp(sig2 * sig2) - 1)) *
      M3;
    kStar = kStar + h;
  }
  return kStar;
}

export function calcPerpPrice(
  K2: number,
  k: number,
  L1: number,
  S2: number,
  S3: number,
  sig2: number,
  sig3: number,
  rho: number,
  r: number,
  M1: number,
  M2: number,
  M3: number,
  minimalSpread: number,
) {
  // calculate the price of the perpetual

  let res, sgnm;
  let dL = k * S2;
  let kStar = M2 - K2;
  if (M3 == 0) {
    res = probDefNoQuanto(K2 + k, L1 + dL, S2, sig2, r, M1, M2);
  } else {
    let h =
      (((S3 / S2) * (Math.exp(rho * sig2 * sig3) - 1)) /
        (Math.exp(sig2 * sig2) - 1)) *
      M3;
    kStar = kStar + h;
    res = probDefQuanto(
      K2 + k,
      L1 + dL,
      S2,
      S3,
      sig2,
      sig3,
      rho,
      r,
      M1,
      M2,
      M3,
    );
  }
  sgnm = Math.sign(k - kStar);
  let q = res[0];
  return S2 * (1 + sgnm * q + Math.sign(k) * minimalSpread);
}

export function getTradeAmountFromPrice(
  K2: number,
  price: number,
  L1: number,
  S2: number,
  S3: number,
  sig2: number,
  sig3: number,
  rho: number,
  r: number,
  M1: number,
  M2: number,
  M3: number,
  minimalSpread: number,
  lotSize: number,
) {
  const numIter = 100;
  const dk = 1e-8;
  const fTol = 1e-7;

  function getPrice(x: number) {
    let px = calcPerpPrice(
      K2,
      x,
      L1,
      S2,
      S3,
      sig2,
      sig3,
      rho,
      r,
      M1,
      M2,
      M3,
      minimalSpread,
    );
    return px;
  }
  // check on which side of the mid-price we are
  let midPrice = 0.5 * (getPrice(lotSize) + getPrice(-lotSize));
  if (Math.abs(midPrice - price) < fTol) {
    return 0;
  }
  if (price < midPrice) {
    console.assert(
      price <= getPrice(-lotSize),
      'below mid price but above 0-short price',
    );
  }
  if (price > midPrice) {
    console.assert(
      price >= getPrice(lotSize),
      'above mid price but below 0-long price',
    );
  }
  // set up initial interval
  let ku = price < midPrice ? -lotSize : 0.01;
  let kd = price < midPrice ? -0.01 : lotSize;
  // right-end
  let count = 0;
  while (ku > 0 && getPrice(ku) <= price && count < numIter) {
    ku = 2 * ku;
    count = count + 1;
  }
  // left-end
  count = 0;
  while (kd < 0 && getPrice(kd) >= price && count < numIter) {
    kd = 2 * kd;
    count = count + 1;
  }
  // check that price belongs to range
  if ((getPrice(kd) - price) * (getPrice(ku) - price) >= 0) {
    console.log(
      kd,
      getPrice(kd),
      ku,
      getPrice(ku),
      price,
      getPrice(-lotSize),
      midPrice,
      getPrice(lotSize),
    );
  }
  console.assert(
    (getPrice(kd) - price) * (getPrice(ku) - price) < 0,
    'valid interval not found',
  );

  // bisection search
  let km = 0.5 * (ku + kd);
  count = 0;
  while (Math.abs(getPrice(km) - price) > fTol && count < numIter) {
    if (getPrice(km) < price) {
      kd = km;
    } else {
      ku = km;
    }
    km = 0.5 * (ku + kd);
    count = count + 1;
  }

  return km;
}

export function getPricesAndTradesForPercentRage(
  K2: number,
  L1: number,
  S2: number,
  S3: number,
  sig2: number,
  sig3: number,
  rho: number,
  r: number,
  M1: number,
  M2: number,
  M3: number,
  minimalSpread: number,
  lotSize: number,
  pctRange: number[],
) {
  // bid-ask spread and mid prices
  let shortPrice0 = calcPerpPrice(
    K2,
    -lotSize,
    L1,
    S2,
    S3,
    sig2,
    sig3,
    rho,
    r,
    M1,
    M2,
    M3,
    minimalSpread,
  );
  let longPrice0 = calcPerpPrice(
    K2,
    lotSize,
    L1,
    S2,
    S3,
    sig2,
    sig3,
    rho,
    r,
    M1,
    M2,
    M3,
    minimalSpread,
  );
  let midPrice = 0.5 * (shortPrice0 + longPrice0);
  // pre-allocate
  let kRange = Array(pctRange.length);
  let priceRange = Array(pctRange.length);
  let pctRangeOut = Array(pctRange.length);

  for (let i = 0; i < pctRange.length; i++) {
    // if 0%, use mid-price
    if (pctRange[i] == 0) {
      kRange[i] = 0;
      priceRange[i] = midPrice;
      pctRangeOut[i] = 0;
      continue;
    }
    if (pctRange[i] > 0) {
      // above mid price, use 0-long-position as reference
      priceRange[i] = longPrice0 * (1 + pctRange[i] / 100);
    } else {
      // below mid price, use 0-short-position as reference
      priceRange[i] = shortPrice0 * (1 + pctRange[i] / 100);
    }
    kRange[i] = getTradeAmountFromPrice(
      K2,
      priceRange[i],
      L1,
      S2,
      S3,
      sig2,
      sig3,
      rho,
      r,
      M1,
      M2,
      M3,
      minimalSpread,
      lotSize,
    );
    // percentage relative to mid-price
    pctRangeOut[i] = (100 * (priceRange[i] - midPrice)) / midPrice;
    //console.log(pctRangeOut[i], pctRange[i]);
  }
  return [priceRange, pctRangeOut, kRange];
}

export function calculateFundingRate(
  premiumRateEWMA: number,
  S2: number,
  clamp: number,
  pos: number,
  AMMFundCashCC: number,
  collateralCCY: number,
) {
  const baserate = 0.0001;
  const r = premiumRateEWMA;
  const K2 = pos;
  let M2 = AMMFundCashCC;
  if (collateralCCY != COLLATERAL_CURRENCY_BASE) {
    M2 = 0;
  }
  let kStar = M2 - K2; //correct only for M3 = 0
  return (
    Math.max(r, clamp) + Math.min(r, -clamp) + Math.sign(-kStar) * baserate
  );
}

function getTargetCollateralM2(K2, S2, L1, sigma2, DDTarget) {
  let mu = -0.5 * sigma2 ** 2;
  let m: number;
  if (L1 < 0 && K2 != 0) {
    m = K2 - L1 / Math.exp(mu + sigma2 * DDTarget) / S2;
  } else if (L1 > 0 && K2 != 0) {
    m = K2 - L1 / Math.exp(mu - sigma2 * DDTarget) / S2;
  } else {
    m = -1;
  }
  return m;
}

function getTargetCollateralM1(K2, S2, L1, sigma2, DDTarget) {
  let mu = -0.5 * sigma2 ** 2;
  let m: number;
  if (K2 < 0) {
    m = K2 * S2 * Math.exp(mu + sigma2 * DDTarget) - L1;
  } else if (K2 > 0) {
    m = K2 * S2 * Math.exp(mu - sigma2 * DDTarget) - L1;
  } else {
    m = -1;
  }
  return m;
}

function getTargetCollateralM3(
  K2,
  S2,
  S3,
  L1,
  sigma2,
  sigma3,
  rho23,
  r,
  DDTarget,
) {
  if (K2 == 0) {
    return -1;
  }
  let kappa = L1 / S2 / K2;
  let a = Math.exp(sigma3 ** 2) - 1;
  let b = 2 * (Math.exp(sigma3 * sigma2 * rho23) - 1);
  let c = Math.exp(sigma2 ** 2) - 1;
  let qinv2 = DDTarget ** 2;
  let v = -S3 / S2 / K2;
  let a0 = (a * qinv2 - 1) * v ** 2;
  //console.log("b=",b)
  let b0 = (b * qinv2 - 2 + 2 * kappa * Math.exp(-r)) * v;
  //console.log("b0=",b0)
  let c0 =
    c * qinv2 - kappa ** 2 * Math.exp(-2 * r) + 2 * kappa * Math.exp(-r) - 1;
  let Mstar1 = (-b0 + Math.sqrt(b0 ** 2 - 4 * a0 * c0)) / (2 * a0);
  let Mstar2 = (-b0 - Math.sqrt(b0 ** 2 - 4 * a0 * c0)) / (2 * a0);
  return Math.max(Mstar1, Mstar2);
}

export function calculateAMMTargetSize(
  DDTarget,
  CMinimal,
  sigma2,
  sigma3,
  rho23,
  S2,
  S3,
  K2,
  L1,
  collateralCCY,
) {
  let M;
  if (collateralCCY == COLLATERAL_CURRENCY_BASE) {
    M = getTargetCollateralM2(K2, S2, L1, sigma2, DDTarget);
  } else if (collateralCCY == COLLATERAL_CURRENCY_QUOTE) {
    M = getTargetCollateralM1(K2, S2, L1, sigma2, DDTarget);
  } else {
    console.assert(collateralCCY == COLLATERAL_CURRENCY_QUANTO);
    M = getTargetCollateralM3(
      K2,
      S2,
      S3,
      L1,
      sigma2,
      sigma3,
      rho23,
      0,
      DDTarget,
    );
  }
  return Math.max(CMinimal, M);
}

export function getDFTargetSize(
  K2pair: number[],
  k2Trader: number,
  r2pair: number[],
  r3pair: number[],
  n: number,
  S2: number,
  S3: number,
  collateralCCY: number,
) {
  /*Calculate the target size for the default fund
    K2pair ([number, number]): Conservative AMM K2 for K2<0, and K2>0 respectively
    k2pair ([number, number]): : Conservative trader k2 for k2<0, and k2>0 respectively
    r2pair ([number, number]): Negative extreme return, positive extreme return for S2
    r3pair ([number, number]): Negative extreme return, positive extreme return for S3
    n ([number]): cover-n rule: how many defaulting traders would the AMM cover?
    S2 ([number]): current S2 index
    S3 ([number]): current S3 (quanto) index
    collateralCCY ([int]): COLLATERAL_CURRENCY_QUOTE
    2 for M2 (base), 3 for M3 (quanto) 

    Returns:
    [number]: target size
    */
  K2pair = [Math.abs(K2pair[0]), Math.abs(K2pair[1])];
  k2Trader = Math.abs(k2Trader);
  let loss_down = (K2pair[0] + n * k2Trader) * (1 - Math.exp(r2pair[0]));
  let loss_up = (K2pair[1] + n * k2Trader) * (Math.exp(r2pair[1]) - 1);
  if (collateralCCY == COLLATERAL_CURRENCY_QUOTE) {
    return S2 * Math.max(loss_down, loss_up);
  } else if (collateralCCY == COLLATERAL_CURRENCY_BASE) {
    return Math.max(
      loss_down / Math.exp(r2pair[0]),
      loss_up / Math.exp(r2pair[1]),
    );
  } else {
    console.assert(collateralCCY == COLLATERAL_CURRENCY_QUANTO);
    let m0 = loss_down / Math.exp(r3pair[0]);
    let m1 = loss_up / Math.exp(r3pair[1]);
    return (S2 / S3) * Math.max(m0, m1);
  }
}

export function equalForPrecision(
  x: BigNumber,
  y: BigNumber,
  decimals: number,
  doPrintLog = false,
) {
  const denum = '1' + '0'.repeat(decimals);
  const eps = ONE_64x64.div(BN.from(denum));
  const x_dn = x.sub(eps);
  const x_up = x.add(eps);
  if (doPrintLog) {
    console.log('x = ', ABK64x64ToFloat(x));
    console.log('eps= ', ABK64x64ToFloat(eps));
    console.log('x- = ', ABK64x64ToFloat(x_dn));
    console.log('x+ = ', ABK64x64ToFloat(x_up));
    console.log('y = ', ABK64x64ToFloat(y));
  }
  return y.gt(x_dn) && y.lt(x_up);
}

export function equalForPrecisionFloat(
  x: number,
  y: number,
  decimals: number,
  doPrintLog = false,
) {
  const eps = 10 ** -decimals;
  const x_dn = x - eps;
  const x_up = x + eps;
  if (doPrintLog) {
    console.log('x = ', x);
    console.log('eps= ', eps);
    console.log('x- = ', x_dn);
    console.log('x+ = ', x_up);
    console.log('y = ', y);
  }
  return y >= x_dn && y <= x_up;
}

export function mul64x64(x: BigNumber, y: BigNumber) {
  return x.mul(y).div(ONE_64x64);
}

export function div64x64(x: BigNumber, y: BigNumber) {
  return x.mul(ONE_64x64).div(y);
}

export function add64x64(x: BigNumber, y: BigNumber) {
  return x.add(y);
}

export function sub64x64(x: BigNumber, y: BigNumber) {
  return x.sub(y);
}

export function abs64x64(x: BigNumber) {
  let r = x.lt(0) ? x.mul(-1) : x;
  return r;
}

export function floatToABK64x64(x) {
  // convert float to ABK64x64 bigint-format
  // Create string from number with 18 decimals
  if (x == 0) {
    return BigNumber.from(0);
  }
  let sg = Math.sign(x);
  x = Math.abs(x);
  let strX = parseFloat(x).toFixed(18);
  const arrX = strX.split('.');
  let xInt = BigNumber.from(arrX[0]);
  let xDec = BigNumber.from(arrX[1]);
  let xIntBig = xInt.mul(ONE_64x64);
  let dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  let xDecBig = xDec.mul(ONE_64x64).div(dec18);
  return xIntBig.add(xDecBig).mul(sg);
}

export function fractionToABDK64x64(nominator: number, denominator: number) {
  // convert a fraction of to integers to ABDK64x64 bigint-format
  // more accurate than the floating point version.
  if (nominator == 0) {
    return BigNumber.from(0);
  }
  if (denominator == 0) {
    throw new Error('fractionToABDK64x64 denominator must not be zero');
  }
  if (
    nominator - Math.floor(nominator) != 0 ||
    denominator - Math.floor(denominator)
  ) {
    throw new Error('fractionToABDK64x64 arguments must be integer numbers');
  }
  let x = BigNumber.from(nominator).mul(ONE_64x64);
  let y = x.div(denominator);
  return y;
}

export function ABK64x64ToFloat(x: BigNumber) {
  // convert ABK64x64 bigint-format to float
  let s = x.lt(0) ? -1 : 1;
  x = x.mul(s);
  let xInt = x.div(ONE_64x64);
  let dec18 = BigNumber.from(10).pow(BigNumber.from(18));
  let xDec = x.sub(xInt.mul(ONE_64x64));
  xDec = xDec.mul(dec18).div(ONE_64x64);
  let k = 18 - xDec.toString().length;
  console.assert(k >= 0);
  let sPad = '0'.repeat(k);
  let NumberStr = xInt.toString() + '.' + sPad + xDec.toString();
  return parseFloat(NumberStr) * s;
}

export function dec18ToFloat(x) {
  //x: BigNumber in Dec18 format to float
  let s = x.lt(0) ? -1 : 1;
  x = x.mul(s);
  let xInt = x.div(DECIMALS);
  let xDec = x.sub(xInt.mul(DECIMALS));
  let k = 18 - xDec.toString().length;
  let sPad = '0'.repeat(k);
  let NumberStr = xInt.toString() + '.' + sPad + xDec.toString();
  //console.log("num=",NumberStr)
  return parseFloat(NumberStr) * s;
}

export function divDec18(x, y) {
  return x.mul(DECIMALS).div(y);
}

export function mulDec18(x, y) {
  return x.mul(y).div(DECIMALS);
}

export function floatToDec18(x) {
  // float number to dec 18
  if (x == 0) {
    return BigNumber.from(0);
  }
  let sg = Math.sign(x);
  x = Math.abs(x);
  let strX = x.toFixed(18);
  //console.log("str=", strX);
  const arrX = strX.split('.');
  let xInt = BigNumber.from(arrX[0]);
  let xDec = BigNumber.from(arrX[1]);
  let xIntBig = xInt.mul(DECIMALS);
  return xIntBig.add(xDec).mul(sg);
}

export function fromDec18(x: BigNumber) {
  return x.mul(ONE_64x64).div(DECIMALS);
}

export function toDec18(x: BigNumber) {
  return x.mul(DECIMALS).div(ONE_64x64);
}

export function getMaxLeveragePosition(
  cashBC,
  targetPremiumRate,
  alpha,
  beta,
  feeRate,
  slippageRate = null,
) {
  // initial margin rate = min(alpha + beta * |pos|, cap)
  // we want to find a position size such that
  // (margin balance) - (initial balance) >= (trading fees)
  // pos * Sm / S3 - L / S3 + cash_cc  - m_r * |pos| * Sm / S3 >= f_r * |pos| * S2 / S3
  if (slippageRate == null) {
    slippageRate = targetPremiumRate;
  }
  let a = beta * (1 - targetPremiumRate);
  let b =
    targetPremiumRate +
    slippageRate +
    feeRate +
    alpha * (1 - targetPremiumRate);
  let c = cashBC; // cash_cc * S3 / S2;
  let discriminant = b * b + 4 * a * c;
  if (discriminant < 0) {
    return 0;
  }
  let maxPos = (-b + Math.sqrt(discriminant)) / (2 * a);
  return maxPos;
}

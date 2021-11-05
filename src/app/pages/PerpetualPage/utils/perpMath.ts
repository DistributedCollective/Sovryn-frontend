import newtonraphson from 'newton-raphson-method';

export function calculateMaintenanceMargin(
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

export function calculateLiquidationPriceCollateralBase(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
) {
  // correct only if markprice = spot price
  return (
    LockedInValueQC /
    (position - maintenance_margin_ratio * Math.abs(position) + cash_cc)
  );
}

export function calculateLiquidationPriceCollateralQuote(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
) {
  // correct only if markprice = spot price
  console.log('unfinished: calculateLiquidationPriceCollateralQuote');
  return (
    (LockedInValueQC - cash_cc) /
    (position - maintenance_margin_ratio * Math.abs(position))
  );
}

/**
 * We calculate a price that in 90% of the cases leads to a liquidation according to the
 * @param {number} currentPos - The current position of the trade (base currency), negative if short
 * @param {number} position - position of the trader
 * @param {number} cash_cc - Cash of the trader
 * @param {number} maintenance_margin_ratio - required maintenance margin ratio
 * @param {number} rho23 - correlation of the quanto and base indices
 * @param {number} sigma2 - standard dev of the base index
 * @param {number} sigma3 - standard dev of the quanto index
 * @param {number} S2 - current price of base/quote pair
 * @param {number} S3 - current price of quanto/quote pair
 * @returns {number} approximate liquidation price
 */
export function calculateLiquidationPriceCollateralQuanto(
  LockedInValueQC,
  position,
  cash_cc,
  maintenance_margin_ratio,
  rho23,
  sigma2,
  sigma3,
  S2,
  S3,
) {
  // correct only if markprice = spot price, and quanto price movement assumption holds

  let alpha = position - Math.abs(position) * maintenance_margin_ratio;
  let normInv = 1.2815515655446004; //90%
  let gamma = cash_cc * S3 * Math.exp(normInv * Math.sqrt(1 - rho23) * sigma2);
  let omega = (Math.sqrt(rho23) * sigma3) / sigma2;
  function f(x) {
    return (
      LockedInValueQC - alpha * S2 * Math.exp(x) - gamma * Math.exp(x * omega)
    );
  }
  let r_start = Math.sign(position) * 0.1;
  let r = newtonraphson(f, r_start);
  let S2liq = S2 * Math.exp(r);
  return S2liq;
}

/**
 * Round value to precision
 * @param {number} value - number to be rounded
 * @param {number} lotSize - size of the lot (e.g., 0.0001)
 * @returns {number} rounded value
 */
export function roundToLot(value: number, lotSize: number): number {
  return Math.round(value / lotSize) * lotSize;
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

export function calcKStar(
  K2: number,
  L1: number,
  S2: number,
  M1: number,
  M2: number,
  M3: number,
) {
  if (M3 !== 0) {
    return 0;
  }
  let u = -L1 / S2 - M1 / S2;
  let v = K2 - M2;
  let kStar = (u - v) / 2;
  return kStar;
}

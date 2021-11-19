import newtonraphson from 'newton-raphson-method';
import { erf } from 'mathjs';

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
    ((Math.exp(sig3 ** 2) - 1) * C3 ** 2 +
      (Math.exp(sig2 ** 2) - 1) +
      2 * (Math.exp(sig2 * sig3 * rho) - 1) * C3)
  );
}

export function cdfNormalStd(x: number, mu = 0, sig = 1) {
  return 0.5 * (1 + erf((x - mu) / (sig * Math.sqrt(2))));
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
  let C3 = (M3 * S3) / (M2 * S2 - K2 * S2);
  let sigz = Math.sqrt(getVarianceZWithC(r, sig2, sig3, rho, C3));
  let muz = Math.exp(r) * (1 + C3);
  let dd = ((-L1 - M1) / (S2 * (M2 - K2)) - muz) / sigz;
  if (M2 - K2 >= 0 && -L1 - M1 <= 0) {
    return [0, -20];
  }
  if (M2 - K2 < 0) {
    dd = -dd;
  }
  let qobs = cdfNormalStd(dd);
  return [qobs, dd];
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
  spreads: number[],
) {
  // calculate the price of the perpetual

  let res, sgnm, incentive;
  let dL = k * S2;
  if (M3 === 0) {
    res = probDefNoQuanto(K2 + k, L1 + dL, S2, sig2, r, M1, M2);
    let u = -L1 / S2 - M1 / S2;
    let v = K2 - M2;
    let kStar = (u - v) / 2;
    sgnm = Math.sign(k - kStar);
    incentive = spreads[1] * (k - kStar);
  } else {
    const dk = 1e-7;
    let dL2 = dL + dk * dL;
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
    let resUp = probDefQuanto(
      K2 + k + dk,
      L1 + dL2,
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
    sgnm = resUp[0] < res[0] ? -1 : 1;
    incentive = 0;
  }
  let q = res[0];
  return S2 * (1 + sgnm * q + Math.sign(k) * spreads[0] + incentive);
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
  spreads: number[],
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
      spreads,
    );
    return px;
  }
  // check on which side of the mid-price we are
  let midPrice = 0.5 * (getPrice(dk) + getPrice(-dk));
  if (Math.abs(midPrice - price) < fTol) {
    return 0;
  }

  // set up initial interval
  let ku = price < midPrice ? -dk : 0.01;
  let kd = price < midPrice ? -0.01 : dk;
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
  spreads: number[],
  pctRange: number[],
) {
  const dk = 1e-8;
  // bid-ask spread and mid prices
  let shortPrice0 = calcPerpPrice(
    K2,
    -dk,
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
    spreads,
  );
  let longPrice0 = calcPerpPrice(
    K2,
    dk,
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
    spreads,
  );
  let midPrice = 0.5 * (shortPrice0 + longPrice0);
  // pre-allocate
  let kRange = Array(pctRange.length);
  let priceRange = Array(pctRange.length);
  let pctRangeOut = Array(pctRange.length);

  for (let i = 0; i < pctRange.length; i++) {
    // if 0%, use mid-price
    if (pctRange[i] === 0) {
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
      spreads,
    );
    // percentage relative to mid-price
    pctRangeOut[i] = (100 * (priceRange[i] - midPrice)) / midPrice;
  }
  return [priceRange, pctRangeOut, kRange];
}

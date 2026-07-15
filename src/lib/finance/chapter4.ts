/**
 * Chapter 4 — Interest Rate Futures (STIR)
 * Pure, dependency-free implementations used by calculators and tests.
 *
 * Conventions:
 * - Interest rates are decimal fractions (0.05 = 5% p.a.) unless noted.
 * - Futures quotes use the classic index style: Price = 100 − R%, where R% is
 *   the implied futures rate in percent (e.g. rate 0.05 → quote 95.00).
 * - Default contract sketch: $1,000,000 notional, 3-month (t = 0.25) period —
 *   the textbook Eurodollar / short-term rate futures pattern.
 */

/** Futures quote index from a decimal rate: 100 − 100×r */
export function futuresPriceFromRate(rate: number): number {
  return 100 - 100 * rate;
}

/** Implied decimal rate from futures quote: (100 − price) / 100 */
export function impliedRateFromPrice(futuresPrice: number): number {
  return (100 - futuresPrice) / 100;
}

/**
 * Value of a one basis-point (0.01%) move in the implied rate for a STIR contract.
 * VP01 = N × 0.0001 × t
 * Classic $1m × 90/360: VP01 = 1_000_000 × 0.0001 × 0.25 = $25
 */
export function valuePerBasisPoint(
  contractNotional: number,
  periodYearFraction: number
): number {
  return contractNotional * 0.0001 * periodYearFraction;
}

/**
 * Dollar value of a 0.01 move in the futures *price* index (one “tick” of 0.01
 * on the 100 − R quote). Because price and rate move 1:1 in percent terms,
 * this equals the value of a 1 bp rate move: VP01.
 */
export function tickValue(contractNotional: number, periodYearFraction: number): number {
  return valuePerBasisPoint(contractNotional, periodYearFraction);
}

/**
 * Value of a full 1.00 point move in the futures price (100 bp of rate).
 * Point value = 100 × tick value.
 */
export function pointValue(contractNotional: number, periodYearFraction: number): number {
  return 100 * tickValue(contractNotional, periodYearFraction);
}

/**
 * Mark-to-market P&amp;L for a long futures position when the quote moves
 * from entryPrice to exitPrice.
 * Long P&amp;L = (exit − entry) × (point value per 1.00) × contracts
 *             = (exit − entry) / 0.01 × tickValue × contracts
 */
export function futuresPnlLong(
  entryPrice: number,
  exitPrice: number,
  contractNotional: number,
  periodYearFraction: number,
  contracts = 1
): number {
  const perContract = ((exitPrice - entryPrice) / 0.01) * tickValue(contractNotional, periodYearFraction);
  return perContract * contracts;
}

/** Short P&amp;L is the opposite of long. */
export function futuresPnlShort(
  entryPrice: number,
  exitPrice: number,
  contractNotional: number,
  periodYearFraction: number,
  contracts = 1
): number {
  return -futuresPnlLong(entryPrice, exitPrice, contractNotional, periodYearFraction, contracts);
}

/**
 * Simple rate basis: cash or FRA/forward rate minus futures-implied rate.
 * basis = r_cash_or_forward − r_futures
 * Positive basis → cash/forward higher than futures-implied rate.
 */
export function rateBasis(cashOrForwardRate: number, futuresImpliedRate: number): number {
  return cashOrForwardRate - futuresImpliedRate;
}

/**
 * Price-index basis using quotes: futures price − theoretical price from cash/forward rate.
 * priceBasis = futuresPrice − (100 − 100×r_forward)
 */
export function priceBasis(futuresPrice: number, cashOrForwardRate: number): number {
  return futuresPrice - futuresPriceFromRate(cashOrForwardRate);
}

/**
 * Number of STIR futures contracts to hedge an exposure.
 *
 * n = (N_exposure / N_contract) × (t_exposure / t_contract) × β
 *
 * - Matching 3-month exposure with 3-month futures and β = 1 → n = N_exposure / N_contract
 * - β (beta) scales for imperfect correlation with the futures rate (default 1)
 *
 * Sign convention: return is a magnitude (positive). Direction (long vs short)
 * is chosen separately: borrowers who fear rising rates *sell* STIR futures.
 */
export function hedgeContracts(
  exposureNotional: number,
  contractNotional: number,
  exposureYearFraction: number,
  contractYearFraction: number,
  beta = 1
): number {
  if (contractNotional === 0 || contractYearFraction === 0) {
    throw new Error("contract notional and year fraction must be non-zero");
  }
  return (
    (exposureNotional / contractNotional) *
    (exposureYearFraction / contractYearFraction) *
    beta
  );
}

/** Round hedge ratio to nearest whole contract (common desk practice). */
export function hedgeContractsRounded(
  exposureNotional: number,
  contractNotional: number,
  exposureYearFraction: number,
  contractYearFraction: number,
  beta = 1
): number {
  return Math.round(
    hedgeContracts(
      exposureNotional,
      contractNotional,
      exposureYearFraction,
      contractYearFraction,
      beta
    )
  );
}

/**
 * Year fraction from day count and basis (money-market style).
 */
export function yearFractionFromDays(days: number, yearBasis: 360 | 365 | 366 = 360): number {
  if (yearBasis <= 0) throw new Error("yearBasis must be positive");
  return days / yearBasis;
}

export function formatRate(rate: number, decimals = 4): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

export function formatMoney(value: number, decimals = 2): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

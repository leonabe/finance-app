/**
 * Chapter 3 — Forward-Forwards and FRAs
 * Pure, dependency-free implementations used by calculators and tests.
 *
 * Conventions:
 * - Rates are decimal fractions (0.05 = 5% p.a.).
 * - Year fractions t are money-market style (e.g. days/360).
 * - FRA buyer locks a borrowing rate (pays fixed K, settles against fixing L).
 */

/**
 * Forward-forward (implied forward) rate from two simple cash rates.
 *
 * Cash to the near date: 1 + r1 × t1
 * Cash to the far date:  1 + r2 × t2
 * Forward period:        tF  (typically t2 − t1 when both start today)
 *
 * (1 + r1 t1)(1 + F tF) = (1 + r2 t2)
 * F = [ (1 + r2 t2) / (1 + r1 t1) − 1 ] / tF
 */
export function forwardForwardRate(
  nearRate: number,
  nearYearFraction: number,
  farRate: number,
  farYearFraction: number,
  forwardYearFraction?: number
): number {
  const t1 = nearYearFraction;
  const t2 = farYearFraction;
  const tF = forwardYearFraction ?? t2 - t1;
  if (t1 < 0 || t2 <= 0 || tF <= 0) {
    throw new Error("year fractions must be positive (forward period > 0)");
  }
  if (t2 < t1 && forwardYearFraction === undefined) {
    throw new Error("far tenor must be longer than near tenor");
  }
  const denom = 1 + nearRate * t1;
  if (denom === 0) throw new Error("invalid near rate / tenor");
  return ((1 + farRate * t2) / denom - 1) / tF;
}

/**
 * Year fraction from day count and basis (same convention as Ch2 helpers).
 */
export function yearFractionFromDays(days: number, yearBasis: 360 | 365 | 366 = 360): number {
  if (yearBasis <= 0) throw new Error("yearBasis must be positive");
  return days / yearBasis;
}

/**
 * Undiscounted FRA interest difference at the end of the FRA period.
 * Δ = N × (L − K) × t
 * Positive = amount in favour of the FRA buyer (receives floating vs pays fixed).
 */
export function fraInterestDifference(
  notional: number,
  fixingRate: number,
  fraRate: number,
  periodYearFraction: number
): number {
  return notional * (fixingRate - fraRate) * periodYearFraction;
}

/**
 * Standard FRA settlement amount paid at the start of the FRA period
 * (discounted at the fixing rate L):
 *
 * Settlement = N × (L − K) × t / (1 + L × t)
 *
 * Positive = paid to the FRA buyer; negative = paid by the buyer (to the seller).
 */
export function fraSettlement(
  notional: number,
  fixingRate: number,
  fraRate: number,
  periodYearFraction: number
): number {
  const t = periodYearFraction;
  const L = fixingRate;
  const denom = 1 + L * t;
  if (denom === 0) throw new Error("invalid fixing rate / period");
  return (notional * (L - fraRate) * t) / denom;
}

/**
 * Settlement from the seller's perspective (opposite of buyer).
 */
export function fraSettlementSeller(
  notional: number,
  fixingRate: number,
  fraRate: number,
  periodYearFraction: number
): number {
  return -fraSettlement(notional, fixingRate, fraRate, periodYearFraction);
}

/**
 * Break-even: given near/far cash rates, the fair FRA rate for the forward period
 * equals the forward-forward rate (no-arbitrage).
 */
export function fairFraRate(
  nearRate: number,
  nearYearFraction: number,
  farRate: number,
  farYearFraction: number,
  forwardYearFraction?: number
): number {
  return forwardForwardRate(
    nearRate,
    nearYearFraction,
    farRate,
    farYearFraction,
    forwardYearFraction
  );
}

/**
 * Mark-to-market value of an existing FRA for the buyer, using current fair
 * forward rate F as the "fixing" substitute and discounting over the remaining
 * period to settlement (simplified single-curve textbook form).
 *
 * Value ≈ N × (F − K) × t / (1 + F × t)   when valued at FRA start / fixing-style.
 * For valuation before start, textbooks often further discount to today; this
 * helper uses the settlement-style discount at F for the FRA period only.
 */
export function fraValueBuyer(
  notional: number,
  currentForwardRate: number,
  fraRate: number,
  periodYearFraction: number
): number {
  return fraSettlement(notional, currentForwardRate, fraRate, periodYearFraction);
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

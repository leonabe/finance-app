/**
 * Chapter 1 — Financial Arithmetic Basics
 * Pure, dependency-free implementations used by calculators and tests.
 *
 * Conventions:
 * - Rates are decimal fractions (0.05 = 5% p.a.) unless noted.
 * - Periods `n` are in years for annual compounding unless `m` (compounds/year) is given.
 */

export type Cashflow = {
  /** Time in years from valuation date (t = 0). */
  t: number;
  /** Signed cash amount (+ inflow, − outflow). */
  amount: number;
};

/** Simple interest: I = P × r × t ; FV = P × (1 + r × t) */
export function simpleInterest(principal: number, rate: number, timeYears: number): number {
  return principal * rate * timeYears;
}

export function simpleFutureValue(principal: number, rate: number, timeYears: number): number {
  return principal * (1 + rate * timeYears);
}

export function simplePresentValue(futureValue: number, rate: number, timeYears: number): number {
  return futureValue / (1 + rate * timeYears);
}

/**
 * Compound interest future value.
 * FV = P × (1 + r/m)^(m×t)
 * When m = 1 (annual), FV = P × (1 + r)^t
 */
export function compoundFutureValue(
  principal: number,
  rate: number,
  timeYears: number,
  compoundsPerYear = 1
): number {
  if (compoundsPerYear <= 0) {
    throw new Error("compoundsPerYear must be positive");
  }
  const m = compoundsPerYear;
  return principal * Math.pow(1 + rate / m, m * timeYears);
}

/** PV = FV / (1 + r/m)^(m×t) */
export function compoundPresentValue(
  futureValue: number,
  rate: number,
  timeYears: number,
  compoundsPerYear = 1
): number {
  if (compoundsPerYear <= 0) {
    throw new Error("compoundsPerYear must be positive");
  }
  const m = compoundsPerYear;
  return futureValue / Math.pow(1 + rate / m, m * timeYears);
}

/** Interest amount earned under compound interest. */
export function compoundInterest(
  principal: number,
  rate: number,
  timeYears: number,
  compoundsPerYear = 1
): number {
  return compoundFutureValue(principal, rate, timeYears, compoundsPerYear) - principal;
}

/**
 * Continuous compounding: FV = P × e^(r×t)
 */
export function continuousFutureValue(principal: number, rate: number, timeYears: number): number {
  return principal * Math.exp(rate * timeYears);
}

export function continuousPresentValue(
  futureValue: number,
  rate: number,
  timeYears: number
): number {
  return futureValue * Math.exp(-rate * timeYears);
}

/**
 * Discount factor for a single period under periodic compounding.
 * DF(t) = 1 / (1 + r/m)^(m×t)
 */
export function discountFactor(
  rate: number,
  timeYears: number,
  compoundsPerYear = 1
): number {
  if (compoundsPerYear <= 0) {
    throw new Error("compoundsPerYear must be positive");
  }
  const m = compoundsPerYear;
  return 1 / Math.pow(1 + rate / m, m * timeYears);
}

/** Continuous discount factor: e^(-r×t) */
export function continuousDiscountFactor(rate: number, timeYears: number): number {
  return Math.exp(-rate * timeYears);
}

/**
 * Effective annual rate from nominal rate with m compounds per year.
 * EAR = (1 + r/m)^m − 1
 */
export function effectiveAnnualRate(nominalRate: number, compoundsPerYear: number): number {
  if (compoundsPerYear <= 0) {
    throw new Error("compoundsPerYear must be positive");
  }
  return Math.pow(1 + nominalRate / compoundsPerYear, compoundsPerYear) - 1;
}

/**
 * Net present value of a cashflow stream discounted at constant rate r
 * with annual compounding (or m compounds/year).
 * NPV = Σ CF_i × DF(t_i)
 */
export function netPresentValue(
  cashflows: Cashflow[],
  rate: number,
  compoundsPerYear = 1
): number {
  return cashflows.reduce((sum, cf) => {
    return sum + cf.amount * discountFactor(rate, cf.t, compoundsPerYear);
  }, 0);
}

/**
 * Internal rate of return via Newton–Raphson on NPV(r) = 0.
 * Returns annual effective rate (decimal), or null if not found.
 */
export function internalRateOfReturn(
  cashflows: Cashflow[],
  options?: {
    guess?: number;
    tolerance?: number;
    maxIterations?: number;
  }
): number | null {
  const guess = options?.guess ?? 0.1;
  const tolerance = options?.tolerance ?? 1e-10;
  const maxIterations = options?.maxIterations ?? 100;

  if (cashflows.length === 0) return null;

  // Need both positive and negative cashflows for a meaningful IRR
  const hasPos = cashflows.some((c) => c.amount > 0);
  const hasNeg = cashflows.some((c) => c.amount < 0);
  if (!hasPos || !hasNeg) return null;

  let r = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dNpv = 0;

    for (const cf of cashflows) {
      // Use continuous-time style derivative of (1+r)^(-t):
      // f = Σ a × (1+r)^(-t)
      // f' = Σ a × (-t) × (1+r)^(-t-1)
      const base = 1 + r;
      if (base <= 0) {
        r = Math.abs(r) * 0.5 + 0.01;
        continue;
      }
      const df = Math.pow(base, -cf.t);
      npv += cf.amount * df;
      dNpv += cf.amount * (-cf.t) * Math.pow(base, -cf.t - 1);
    }

    if (Math.abs(dNpv) < 1e-14) {
      // Fallback: small step bisection-like adjustment
      r = r + (npv > 0 ? 0.01 : -0.01);
      continue;
    }

    const next = r - npv / dNpv;
    if (!Number.isFinite(next)) return null;
    if (Math.abs(next - r) < tolerance) {
      return next;
    }
    r = next;
  }

  // Final check
  const finalNpv = netPresentValue(cashflows, r, 1);
  if (Math.abs(finalNpv) < 1e-6) return r;
  return null;
}

/** Format a decimal rate as a percentage string with given decimals. */
export function formatRate(rate: number, decimals = 4): string {
  return `${(rate * 100).toFixed(decimals)}%`;
}

/** Format currency-like number with fixed decimals. */
export function formatMoney(value: number, decimals = 2): string {
  const sign = value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

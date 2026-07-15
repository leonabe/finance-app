/**
 * Chapter 2 — The Money Market
 * Pure, dependency-free implementations used by calculators and tests.
 *
 * Conventions:
 * - Rates are decimal fractions (0.05 = 5% p.a.) unless noted.
 * - Day-count year fractions use calendar days unless 30/360 is selected.
 * - Discount instruments: price/proceeds from face and bank discount rate.
 */

export type DayCountConvention =
  | "ACT/360"
  | "ACT/365"
  | "ACT/365F"
  | "30/360"
  | "ACT/ACT";

/** Parse YYYY-MM-DD (or Date) as UTC midnight to avoid local TZ skew. */
export function parseIsoDate(input: string | Date): Date {
  if (input instanceof Date) {
    return new Date(Date.UTC(input.getUTCFullYear(), input.getUTCMonth(), input.getUTCDate()));
  }
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.trim());
  if (!m) {
    throw new Error(`Expected ISO date YYYY-MM-DD, got: ${input}`);
  }
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return new Date(Date.UTC(y, mo - 1, d));
}

/** Calendar days between two dates (end − start), integer, can be negative. */
export function calendarDaysBetween(start: string | Date, end: string | Date): number {
  const a = parseIsoDate(start).getTime();
  const b = parseIsoDate(end).getTime();
  return Math.round((b - a) / (24 * 60 * 60 * 1000));
}

/**
 * 30/360 (US/NASD-style simplified):
 * D1' = min(D1, 30); if D1' = 30 then D2' = min(D2, 30) else D2' = D2
 * days = 360×(Y2−Y1) + 30×(M2−M1) + (D2'−D1')
 */
export function days360(
  start: string | Date,
  end: string | Date,
  method: "US" | "EU" = "US"
): number {
  const s = parseIsoDate(start);
  const e = parseIsoDate(end);
  const y1 = s.getUTCFullYear();
  const m1 = s.getUTCMonth() + 1;
  let d1 = s.getUTCDate();
  const y2 = e.getUTCFullYear();
  const m2 = e.getUTCMonth() + 1;
  let d2 = e.getUTCDate();

  if (method === "EU") {
    d1 = Math.min(d1, 30);
    d2 = Math.min(d2, 30);
  } else {
    // US/NASD
    if (d1 === 31) d1 = 30;
    if (d2 === 31 && d1 === 30) d2 = 30;
  }

  return 360 * (y2 - y1) + 30 * (m2 - m1) + (d2 - d1);
}

/** Days in the ACT/ACT year containing the start date (365 or 366). */
export function daysInUtcYear(year: number): number {
  const leap =
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return leap ? 366 : 365;
}

/**
 * Year fraction under a day-count convention.
 * For ACT/ACT over spans that cross years, sum partial years (ISDA-style simple split).
 */
export function yearFraction(
  start: string | Date,
  end: string | Date,
  convention: DayCountConvention
): number {
  const s = parseIsoDate(start);
  const e = parseIsoDate(end);
  if (e.getTime() === s.getTime()) return 0;

  switch (convention) {
    case "ACT/360":
      return calendarDaysBetween(s, e) / 360;
    case "ACT/365":
    case "ACT/365F":
      return calendarDaysBetween(s, e) / 365;
    case "30/360":
      return days360(s, e, "US") / 360;
    case "ACT/ACT":
      return yearFractionActAct(s, e);
    default: {
      const _exhaustive: never = convention;
      throw new Error(`Unknown convention: ${_exhaustive}`);
    }
  }
}

/** Year fraction from an explicit day count and year basis. */
export function yearFractionFromDays(days: number, yearBasis: 360 | 365 | 366): number {
  if (yearBasis <= 0) throw new Error("yearBasis must be positive");
  return days / yearBasis;
}

function yearFractionActAct(start: Date, end: Date): number {
  // Ensure start <= end for accumulation; flip sign if reversed
  let sign = 1;
  let s = start;
  let e = end;
  if (e.getTime() < s.getTime()) {
    sign = -1;
    s = end;
    e = start;
  }

  let yf = 0;
  let cur = new Date(s.getTime());
  while (cur.getUTCFullYear() < e.getUTCFullYear()) {
    const nextYear = new Date(Date.UTC(cur.getUTCFullYear() + 1, 0, 1));
    const days = calendarDaysBetween(cur, nextYear);
    yf += days / daysInUtcYear(cur.getUTCFullYear());
    cur = nextYear;
  }
  const days = calendarDaysBetween(cur, e);
  yf += days / daysInUtcYear(e.getUTCFullYear());
  return sign * yf;
}

/**
 * Bank discount instrument proceeds (price).
 * P = F × (1 − d × t)  where t is year fraction under the market convention.
 */
export function discountProceeds(
  face: number,
  discountRate: number,
  yearFractionT: number
): number {
  return face * (1 - discountRate * yearFractionT);
}

/** Discount amount = face − proceeds. */
export function discountAmount(
  face: number,
  discountRate: number,
  yearFractionT: number
): number {
  return face - discountProceeds(face, discountRate, yearFractionT);
}

/**
 * Discount rate implied by face, proceeds, and year fraction.
 * d = (F − P) / (F × t)
 */
export function discountRateFromPrice(
  face: number,
  proceeds: number,
  yearFractionT: number
): number {
  if (face === 0 || yearFractionT === 0) {
    throw new Error("face and yearFraction must be non-zero");
  }
  return (face - proceeds) / (face * yearFractionT);
}

/**
 * Simple money-market (true / investment) yield.
 * y = (F − P) / (P × t)
 */
export function simpleYieldFromPrice(
  face: number,
  proceeds: number,
  yearFractionT: number
): number {
  if (proceeds === 0 || yearFractionT === 0) {
    throw new Error("proceeds and yearFraction must be non-zero");
  }
  return (face - proceeds) / (proceeds * yearFractionT);
}

/**
 * Convert bank discount rate d to simple yield y for the same t:
 * y = d / (1 − d × t)
 */
export function yieldFromDiscountRate(discountRate: number, yearFractionT: number): number {
  const denom = 1 - discountRate * yearFractionT;
  if (denom === 0) throw new Error("invalid discount rate / tenor combination");
  return discountRate / denom;
}

/**
 * Convert simple yield y to bank discount rate d for the same t:
 * d = y / (1 + y × t)
 */
export function discountRateFromYield(simpleYield: number, yearFractionT: number): number {
  const denom = 1 + simpleYield * yearFractionT;
  if (denom === 0) throw new Error("invalid yield / tenor combination");
  return simpleYield / denom;
}

/**
 * Simple money-market deposit / CD maturity value.
 * FV = P × (1 + r × t)
 */
export function moneyMarketFutureValue(
  principal: number,
  rate: number,
  yearFractionT: number
): number {
  return principal * (1 + rate * yearFractionT);
}

/** Interest on a simple money-market deposit. */
export function moneyMarketInterest(
  principal: number,
  rate: number,
  yearFractionT: number
): number {
  return principal * rate * yearFractionT;
}

/**
 * Simple rate implied by principal and maturity amount.
 * r = (FV − P) / (P × t)
 */
export function moneyMarketRateFromAmounts(
  principal: number,
  maturityValue: number,
  yearFractionT: number
): number {
  if (principal === 0 || yearFractionT === 0) {
    throw new Error("principal and yearFraction must be non-zero");
  }
  return (maturityValue - principal) / (principal * yearFractionT);
}

/** Re-export formatting helpers aligned with Ch1 style. */
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

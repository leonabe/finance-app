import { describe, it, expect } from "vitest";
import {
  calendarDaysBetween,
  days360,
  yearFraction,
  yearFractionFromDays,
  discountProceeds,
  discountAmount,
  discountRateFromPrice,
  simpleYieldFromPrice,
  yieldFromDiscountRate,
  discountRateFromYield,
  moneyMarketFutureValue,
  moneyMarketInterest,
  moneyMarketRateFromAmounts,
  daysInUtcYear,
} from "./chapter2";

describe("Chapter 2 — day counts", () => {
  it("counts calendar days for a known span", () => {
    // 2024-01-15 to 2024-04-15 = 91 days (2024 is leap year; Jan 15–Apr 15)
    expect(calendarDaysBetween("2024-01-15", "2024-04-15")).toBe(91);
  });

  it("ACT/360 year fraction = days/360", () => {
    const days = 91;
    expect(yearFractionFromDays(days, 360)).toBeCloseTo(91 / 360, 12);
    expect(yearFraction("2024-01-15", "2024-04-15", "ACT/360")).toBeCloseTo(91 / 360, 12);
  });

  it("ACT/365 year fraction = days/365", () => {
    expect(yearFraction("2024-01-15", "2024-04-15", "ACT/365")).toBeCloseTo(91 / 365, 12);
  });

  it("30/360 US day count for same span", () => {
    // 15 Jan → 15 Apr: 360*(0) + 30*(3) + (15-15) = 90
    expect(days360("2024-01-15", "2024-04-15", "US")).toBe(90);
    expect(yearFraction("2024-01-15", "2024-04-15", "30/360")).toBeCloseTo(90 / 360, 12);
  });

  it("ACT/ACT uses 366 in a leap year segment", () => {
    // Entire 2024 (leap): 2024-01-01 to 2025-01-01
    expect(daysInUtcYear(2024)).toBe(366);
    expect(yearFraction("2024-01-01", "2025-01-01", "ACT/ACT")).toBeCloseTo(1, 12);
    // Non-leap 2025
    expect(daysInUtcYear(2025)).toBe(365);
    expect(yearFraction("2025-01-01", "2026-01-01", "ACT/ACT")).toBeCloseTo(1, 12);
  });
});

describe("Chapter 2 — discount instruments", () => {
  it("prices a T-bill style instrument: P = F(1 − d t)", () => {
    // Face 1_000_000, d = 5%, t = 90/360
    const F = 1_000_000;
    const d = 0.05;
    const t = 90 / 360;
    const P = discountProceeds(F, d, t);
    // P = 1_000_000 × (1 − 0.05×0.25) = 1_000_000 × 0.9875 = 987_500
    expect(P).toBeCloseTo(987_500, 6);
    expect(discountAmount(F, d, t)).toBeCloseTo(12_500, 6);
  });

  it("recovers discount rate from face and proceeds", () => {
    const F = 1_000_000;
    const d = 0.05;
    const t = 90 / 360;
    const P = discountProceeds(F, d, t);
    expect(discountRateFromPrice(F, P, t)).toBeCloseTo(d, 12);
  });

  it("simple yield from price matches (F−P)/(P t)", () => {
    const F = 1_000_000;
    const P = 987_500;
    const t = 90 / 360;
    const y = simpleYieldFromPrice(F, P, t);
    expect(y).toBeCloseTo((F - P) / (P * t), 12);
    // y = 12500 / (987500 × 0.25) = 12500 / 246875 ≈ 0.0506329
    expect(y).toBeCloseTo(0.0506329114, 8);
  });
});

describe("Chapter 2 — discount ↔ yield conversion", () => {
  it("y = d / (1 − d t) and reverse d = y / (1 + y t)", () => {
    const d = 0.05;
    const t = 90 / 360;
    const y = yieldFromDiscountRate(d, t);
    expect(y).toBeCloseTo(d / (1 - d * t), 12);
    expect(discountRateFromYield(y, t)).toBeCloseTo(d, 12);
  });

  it("round-trip discount rate via price and yield path", () => {
    const F = 500_000;
    const d = 0.04;
    const t = 182 / 360;
    const P = discountProceeds(F, d, t);
    const y = simpleYieldFromPrice(F, P, t);
    expect(y).toBeCloseTo(yieldFromDiscountRate(d, t), 10);
    expect(discountRateFromYield(y, t)).toBeCloseTo(d, 10);
  });
});

describe("Chapter 2 — money-market deposits", () => {
  it("simple deposit FV = P(1 + r t) on ACT/360", () => {
    const P = 2_000_000;
    const r = 0.035;
    const t = 91 / 360;
    const fv = moneyMarketFutureValue(P, r, t);
    expect(fv).toBeCloseTo(P * (1 + r * t), 6);
    expect(moneyMarketInterest(P, r, t)).toBeCloseTo(fv - P, 6);
  });

  it("implied rate from principal and maturity", () => {
    const P = 1_000_000;
    const r = 0.06;
    const t = 180 / 360;
    const fv = moneyMarketFutureValue(P, r, t);
    expect(moneyMarketRateFromAmounts(P, fv, t)).toBeCloseTo(r, 12);
  });
});

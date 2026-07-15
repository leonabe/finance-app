import { describe, it, expect } from "vitest";
import {
  simpleInterest,
  simpleFutureValue,
  simplePresentValue,
  compoundFutureValue,
  compoundPresentValue,
  compoundInterest,
  continuousFutureValue,
  continuousPresentValue,
  discountFactor,
  continuousDiscountFactor,
  effectiveAnnualRate,
  netPresentValue,
  internalRateOfReturn,
  type Cashflow,
} from "./chapter1";

const EPS = 1e-9;

describe("Chapter 1 — simple interest", () => {
  it("computes interest I = P × r × t", () => {
    // 10_000 at 5% for 2 years → 1_000
    expect(simpleInterest(10_000, 0.05, 2)).toBeCloseTo(1_000, 9);
  });

  it("computes simple FV and recovers PV (round-trip)", () => {
    const P = 10_000;
    const r = 0.08;
    const t = 1.5;
    const fv = simpleFutureValue(P, r, t);
    // FV = 10_000 × (1 + 0.08×1.5) = 10_000 × 1.12 = 11_200
    expect(fv).toBeCloseTo(11_200, 9);
    expect(simplePresentValue(fv, r, t)).toBeCloseTo(P, 9);
  });
});

describe("Chapter 1 — compound interest", () => {
  it("annual compound FV: P(1+r)^n", () => {
    // 1_000 at 6% for 3 years: 1000 × 1.06^3 = 1191.016
    expect(compoundFutureValue(1_000, 0.06, 3, 1)).toBeCloseTo(1_191.016, 3);
  });

  it("quarterly compounding matches (1 + r/4)^(4t)", () => {
    const P = 5_000;
    const r = 0.08;
    const t = 2;
    const m = 4;
    const expected = P * Math.pow(1 + r / m, m * t);
    expect(compoundFutureValue(P, r, t, m)).toBeCloseTo(expected, 9);
    expect(compoundFutureValue(P, r, t, m)).toBeCloseTo(5_858.298, 2);
  });

  it("PV/FV round-trip under compounding", () => {
    const fv = 12_000;
    const r = 0.05;
    const t = 4;
    const m = 2;
    const pv = compoundPresentValue(fv, r, t, m);
    expect(compoundFutureValue(pv, r, t, m)).toBeCloseTo(fv, 8);
  });

  it("compound interest amount = FV − P", () => {
    const P = 2_000;
    const r = 0.1;
    const t = 2;
    expect(compoundInterest(P, r, t, 1)).toBeCloseTo(compoundFutureValue(P, r, t, 1) - P, 9);
  });
});

describe("Chapter 1 — continuous compounding", () => {
  it("FV = P e^{rt}", () => {
    const P = 1_000;
    const r = 0.05;
    const t = 1;
    expect(continuousFutureValue(P, r, t)).toBeCloseTo(P * Math.exp(r * t), EPS);
  });

  it("continuous PV recovers FV", () => {
    const fv = 1_000 * Math.exp(0.05);
    expect(continuousPresentValue(fv, 0.05, 1)).toBeCloseTo(1_000, 8);
  });
});

describe("Chapter 1 — discount factors", () => {
  it("annual DF = 1/(1+r)^t", () => {
    // 5% for 1 year → 1/1.05 ≈ 0.95238095
    expect(discountFactor(0.05, 1, 1)).toBeCloseTo(1 / 1.05, 9);
    // 5% for 2 years → 1/1.05^2
    expect(discountFactor(0.05, 2, 1)).toBeCloseTo(1 / Math.pow(1.05, 2), 9);
  });

  it("DF × FV recovers PV", () => {
    const r = 0.07;
    const t = 3;
    const fv = 10_000;
    const df = discountFactor(r, t, 1);
    expect(fv * df).toBeCloseTo(compoundPresentValue(fv, r, t, 1), 9);
  });

  it("continuous DF = e^{-rt}", () => {
    expect(continuousDiscountFactor(0.06, 2)).toBeCloseTo(Math.exp(-0.12), 9);
  });
});

describe("Chapter 1 — effective annual rate", () => {
  it("EAR from nominal with m compounds", () => {
    // 12% nominal monthly: (1 + 0.12/12)^12 − 1 ≈ 0.126825
    expect(effectiveAnnualRate(0.12, 12)).toBeCloseTo(0.1268250301, 8);
  });

  it("m = 1 leaves rate unchanged", () => {
    expect(effectiveAnnualRate(0.09, 1)).toBeCloseTo(0.09, 12);
  });
});

describe("Chapter 1 — NPV", () => {
  it("discounts multi-period cashflows correctly", () => {
    // −100 at t=0, +60 at t=1, +60 at t=2, r = 10%
    // NPV = −100 + 60/1.1 + 60/1.1^2
    const cfs: Cashflow[] = [
      { t: 0, amount: -100 },
      { t: 1, amount: 60 },
      { t: 2, amount: 60 },
    ];
    const expected = -100 + 60 / 1.1 + 60 / Math.pow(1.1, 2);
    expect(netPresentValue(cfs, 0.1, 1)).toBeCloseTo(expected, 9);
    expect(netPresentValue(cfs, 0.1, 1)).toBeCloseTo(4.1322314, 5);
  });

  it("NPV at zero rate is sum of cashflows", () => {
    const cfs: Cashflow[] = [
      { t: 0, amount: -50 },
      { t: 1, amount: 30 },
      { t: 2, amount: 40 },
    ];
    expect(netPresentValue(cfs, 0, 1)).toBeCloseTo(20, 9);
  });
});

describe("Chapter 1 — IRR", () => {
  it("finds IRR for a simple two-period project", () => {
    // −100, +110 at t=1 → IRR = 10%
    const cfs: Cashflow[] = [
      { t: 0, amount: -100 },
      { t: 1, amount: 110 },
    ];
    const irr = internalRateOfReturn(cfs);
    expect(irr).not.toBeNull();
    expect(irr!).toBeCloseTo(0.1, 6);
    expect(netPresentValue(cfs, irr!, 1)).toBeCloseTo(0, 5);
  });

  it("finds IRR for multi-period textbook-style cashflows", () => {
    // Classic: −1000, +300, +400, +500  (approx IRR ~ 8.9%)
    const cfs: Cashflow[] = [
      { t: 0, amount: -1000 },
      { t: 1, amount: 300 },
      { t: 2, amount: 400 },
      { t: 3, amount: 500 },
    ];
    const irr = internalRateOfReturn(cfs);
    expect(irr).not.toBeNull();
    // NPV at IRR should be ~0
    expect(netPresentValue(cfs, irr!, 1)).toBeCloseTo(0, 4);
    // Sanity: positive NPV at 0, negative at high rates
    expect(netPresentValue(cfs, 0, 1)).toBeGreaterThan(0);
    expect(netPresentValue(cfs, 0.5, 1)).toBeLessThan(0);
  });

  it("returns null when cashflows are all positive", () => {
    expect(internalRateOfReturn([{ t: 0, amount: 10 }, { t: 1, amount: 20 }])).toBeNull();
  });
});

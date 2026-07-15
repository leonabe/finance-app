import { describe, it, expect } from "vitest";
import {
  forwardForwardRate,
  yearFractionFromDays,
  fraInterestDifference,
  fraSettlement,
  fraSettlementSeller,
  fairFraRate,
  fraValueBuyer,
} from "./chapter3";
import {
  formatExerciseSolution,
  isExerciseCorrect,
} from "./exercise-answer";

describe("Chapter 3 — forward-forward rate", () => {
  it("matches (1+r1 t1)(1+F tF)=(1+r2 t2) rearrangement", () => {
    // Classic: 3m @ 4%, 6m @ 4.5%, ACT/360, 90 and 180 days
    const t1 = 90 / 360;
    const t2 = 180 / 360;
    const tF = 90 / 360;
    const r1 = 0.04;
    const r2 = 0.045;
    const F = forwardForwardRate(r1, t1, r2, t2, tF);
    // Manual: F = ((1+0.045*0.5)/(1+0.04*0.25) - 1) / 0.25
    const expected = ((1 + r2 * t2) / (1 + r1 * t1) - 1) / tF;
    expect(F).toBeCloseTo(expected, 12);
    // ((1.0225)/(1.01) − 1) / 0.25 = 0.04950495049...
    expect(F).toBeCloseTo(0.049504950495, 10);
    // Round-trip: reinvestment identity holds
    expect((1 + r1 * t1) * (1 + F * tF)).toBeCloseTo(1 + r2 * t2, 10);
  });

  it("defaults forward year fraction to t2 − t1", () => {
    const t1 = 90 / 360;
    const t2 = 180 / 360;
    const a = forwardForwardRate(0.05, t1, 0.055, t2);
    const b = forwardForwardRate(0.05, t1, 0.055, t2, t2 - t1);
    expect(a).toBeCloseTo(b, 12);
  });

  it("yearFractionFromDays is days/basis", () => {
    expect(yearFractionFromDays(91, 360)).toBeCloseTo(91 / 360, 12);
  });

  it("fair FRA rate equals forward-forward", () => {
    const t1 = 60 / 360;
    const t2 = 150 / 360;
    const tF = 90 / 360;
    expect(fairFraRate(0.03, t1, 0.035, t2, tF)).toBeCloseTo(
      forwardForwardRate(0.03, t1, 0.035, t2, tF),
      12
    );
  });
});

describe("Chapter 3 — FRA settlement", () => {
  it("undiscounted interest difference N(L−K)t", () => {
    const N = 10_000_000;
    const L = 0.06;
    const K = 0.05;
    const t = 90 / 360;
    expect(fraInterestDifference(N, L, K, t)).toBeCloseTo(N * (L - K) * t, 6);
    expect(fraInterestDifference(N, L, K, t)).toBeCloseTo(25_000, 6);
  });

  it("discounted settlement N(L−K)t/(1+L t)", () => {
    const N = 10_000_000;
    const L = 0.06;
    const K = 0.05;
    const t = 90 / 360;
    const expected = (N * (L - K) * t) / (1 + L * t);
    expect(fraSettlement(N, L, K, t)).toBeCloseTo(expected, 6);
    // 25000 / (1.015) ≈ 24630.54
    expect(fraSettlement(N, L, K, t)).toBeCloseTo(24_630.54187, 2);
  });

  it("seller settlement is negative of buyer", () => {
    const args = [5_000_000, 0.04, 0.045, 0.25] as const;
    expect(fraSettlementSeller(...args)).toBeCloseTo(-fraSettlement(...args), 9);
  });

  it("when L = K settlement is zero", () => {
    expect(fraSettlement(1_000_000, 0.05, 0.05, 0.25)).toBeCloseTo(0, 12);
  });

  it("fraValueBuyer uses settlement form with current forward as L", () => {
    const N = 1_000_000;
    const F = 0.055;
    const K = 0.05;
    const t = 0.25;
    expect(fraValueBuyer(N, F, K, t)).toBeCloseTo(fraSettlement(N, F, K, t), 12);
  });
});

describe("Chapter 3 — exercise solution ↔ checker alignment", () => {
  it("forward-forward rate solution re-enters successfully", () => {
    const expected = forwardForwardRate(0.04, 90 / 360, 0.045, 180 / 360, 90 / 360);
    const shown = formatExerciseSolution(expected, "rate");
    expect(shown).not.toMatch(/%/);
    expect(isExerciseCorrect(shown, expected, 1e-6, "rate")).toBe(true);
  });

  it("FRA settlement money solution re-enters successfully", () => {
    const expected = fraSettlement(10_000_000, 0.06, 0.05, 90 / 360);
    const shown = formatExerciseSolution(expected, "money");
    expect(isExerciseCorrect(shown, expected, 0.05, "money")).toBe(true);
  });
});

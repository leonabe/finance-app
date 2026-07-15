import { describe, it, expect } from "vitest";
import {
  futuresPriceFromRate,
  impliedRateFromPrice,
  valuePerBasisPoint,
  tickValue,
  pointValue,
  futuresPnlLong,
  futuresPnlShort,
  rateBasis,
  priceBasis,
  hedgeContracts,
  hedgeContractsRounded,
  yearFractionFromDays,
} from "./chapter4";
import { formatExerciseSolution, isExerciseCorrect } from "./exercise-answer";

describe("Chapter 4 — STIR quote / pricing", () => {
  it("price = 100 − 100r and reverses", () => {
    expect(futuresPriceFromRate(0.05)).toBeCloseTo(95.0, 10);
    expect(impliedRateFromPrice(95.0)).toBeCloseTo(0.05, 12);
    expect(impliedRateFromPrice(futuresPriceFromRate(0.0375))).toBeCloseTo(0.0375, 12);
  });

  it("classic $1m 3m VP01 is $25", () => {
    const t = 90 / 360;
    expect(valuePerBasisPoint(1_000_000, t)).toBeCloseTo(25, 10);
    expect(tickValue(1_000_000, t)).toBeCloseTo(25, 10);
    expect(pointValue(1_000_000, t)).toBeCloseTo(2500, 8);
  });

  it("yearFractionFromDays", () => {
    expect(yearFractionFromDays(90, 360)).toBeCloseTo(0.25, 12);
  });
});

describe("Chapter 4 — P&L", () => {
  it("long gains when price rises (rates fall)", () => {
    // Buy at 95.00, sell at 95.10 → +10 ticks × $25 = +$250
    const pnl = futuresPnlLong(95.0, 95.1, 1_000_000, 0.25, 1);
    expect(pnl).toBeCloseTo(250, 6);
  });

  it("short is opposite of long", () => {
    const args = [96.0, 95.5, 1_000_000, 0.25, 2] as const;
    expect(futuresPnlShort(...args)).toBeCloseTo(-futuresPnlLong(...args), 8);
    // Short from 96.00 to 95.50: rates up, short gains 50 ticks × $25 × 2 = $2500
    expect(futuresPnlShort(...args)).toBeCloseTo(2500, 4);
  });
});

describe("Chapter 4 — basis", () => {
  it("rate basis = cash/forward − futures implied", () => {
    const futRate = impliedRateFromPrice(95.0); // 5%
    expect(rateBasis(0.052, futRate)).toBeCloseTo(0.002, 12);
  });

  it("price basis = futures quote − theoretical quote from forward rate", () => {
    // Forward 5.2% → theo price 94.80; futures 95.00 → basis +0.20
    expect(priceBasis(95.0, 0.052)).toBeCloseTo(0.2, 10);
  });
});

describe("Chapter 4 — hedge ratio", () => {
  it("matching 3m exposure with 3m $1m futures is notional ratio", () => {
    const n = hedgeContracts(50_000_000, 1_000_000, 0.25, 0.25, 1);
    expect(n).toBeCloseTo(50, 10);
    expect(hedgeContractsRounded(50_000_000, 1_000_000, 0.25, 0.25, 1)).toBe(50);
  });

  it("scales by period length and beta", () => {
    // 6-month risk hedged with 3-month futures: twice as many contracts
    expect(hedgeContracts(10_000_000, 1_000_000, 0.5, 0.25, 1)).toBeCloseTo(20, 10);
    expect(hedgeContracts(10_000_000, 1_000_000, 0.25, 0.25, 0.8)).toBeCloseTo(8, 10);
  });
});

describe("Chapter 4 — exercise solution ↔ checker", () => {
  it("rate solution re-enters successfully", () => {
    const expected = impliedRateFromPrice(96.25);
    const shown = formatExerciseSolution(expected, "rate");
    expect(shown).not.toMatch(/%/);
    expect(isExerciseCorrect(shown, expected, 1e-6, "rate")).toBe(true);
  });

  it("money P&L solution re-enters successfully", () => {
    const expected = futuresPnlLong(95.0, 95.1, 1_000_000, 0.25, 1);
    const shown = formatExerciseSolution(expected, "money");
    expect(isExerciseCorrect(shown, expected, 0.05, "money")).toBe(true);
  });

  it("hedge contract count as factor/days-style number", () => {
    const expected = hedgeContracts(50_000_000, 1_000_000, 0.25, 0.25, 1);
    const shown = formatExerciseSolution(expected, "factor");
    expect(isExerciseCorrect(shown, expected, 1e-6, "factor")).toBe(true);
  });
});

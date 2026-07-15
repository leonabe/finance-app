import { describe, it, expect } from "vitest";
import {
  formatExerciseSolution,
  parseExerciseInput,
  isExerciseCorrect,
} from "./exercise-answer";
import { yieldFromDiscountRate } from "./chapter2";

describe("exercise answer formatting aligns with checker", () => {
  it("rate solution string is a decimal that passes Check when re-entered", () => {
    const expected = yieldFromDiscountRate(0.05, 90 / 360);
    const shown = formatExerciseSolution(expected, "rate");

    // Must not be a percent string like "5.063291%"
    expect(shown).not.toMatch(/%/);
    expect(Number(shown)).toBeCloseTo(expected, 8);

    // Entering the revealed solution must pass the shipped checker
    expect(isExerciseCorrect(shown, expected, 1e-6, "rate")).toBe(true);
  });

  it("money solution is numeric and checkable", () => {
    const expected = 987_500;
    const shown = formatExerciseSolution(expected, "money");
    expect(isExerciseCorrect(shown, expected, 0.01, "money")).toBe(true);
  });

  it("factor solution is numeric and checkable", () => {
    const expected = 91 / 360;
    const shown = formatExerciseSolution(expected, "factor");
    expect(isExerciseCorrect(shown, expected, 1e-8, "factor")).toBe(true);
  });

  it("accepts percent entry for rate unit when |value| > 1", () => {
    const expected = 0.0506329114;
    expect(parseExerciseInput("5.063291", "rate")).toBeCloseTo(0.05063291, 6);
    expect(isExerciseCorrect("5.063291", expected, 1e-5, "rate")).toBe(true);
  });
});

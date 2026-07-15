/**
 * Shared exercise answer formatting / checking.
 * "Show solution" text must be enterable into the number field and pass Check.
 */

export type ExerciseUnit = "money" | "factor" | "rate" | "days";

/**
 * Format the solution for display. For rates, show the decimal fraction
 * (e.g. 0.050633) that matches the numeric checker — not a percent string.
 */
export function formatExerciseSolution(expected: number, unit: ExerciseUnit): string {
  if (unit === "money") {
    // Fixed 2 d.p. plain number (no thousands separators) so it pastes into <input type="number">
    return expected.toFixed(2);
  }
  if (unit === "rate") {
    return expected.toFixed(8);
  }
  if (unit === "days") {
    return String(expected);
  }
  // factor
  return expected.toFixed(8);
}

/**
 * Parse user input for checking. Rate answers may be entered as decimal (0.05)
 * or percent (5) — values with |x| > 1 are treated as percent for unit "rate".
 */
export function parseExerciseInput(raw: string, unit: ExerciseUnit): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const val = Number(trimmed);
  if (!Number.isFinite(val)) return null;
  if (unit === "rate" && Math.abs(val) > 1) {
    return val / 100;
  }
  return val;
}

export function isExerciseCorrect(
  raw: string,
  expected: number,
  tolerance: number,
  unit: ExerciseUnit
): boolean {
  const val = parseExerciseInput(raw, unit);
  if (val === null) return false;
  return Math.abs(val - expected) <= tolerance;
}

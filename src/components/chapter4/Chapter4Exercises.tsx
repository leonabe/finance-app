"use client";

import { useMemo, useState } from "react";
import {
  futuresPriceFromRate,
  impliedRateFromPrice,
  futuresPnlShort,
  hedgeContracts,
  rateBasis,
} from "@/lib/finance/chapter4";
import {
  formatExerciseSolution,
  isExerciseCorrect,
  type ExerciseUnit,
} from "@/lib/finance/exercise-answer";

type Exercise = {
  id: string;
  prompt: string;
  hint: string;
  expected: number;
  tolerance: number;
  unit: ExerciseUnit;
};

const EXERCISES: Exercise[] = [
  {
    id: "ex1",
    prompt:
      "A 3-month STIR futures is priced at 96.25. What is the implied futures rate as a decimal?",
    hint: "r = (100 − price) / 100",
    expected: impliedRateFromPrice(96.25),
    tolerance: 1e-6,
    unit: "rate",
  },
  {
    id: "ex2",
    prompt:
      "Implied rate is 5% p.a. What is the futures price index (100 − R%)?",
    hint: "Price = 100 − 100 × r",
    expected: futuresPriceFromRate(0.05),
    tolerance: 0.001,
    unit: "factor",
  },
  {
    id: "ex3",
    prompt:
      "Short 10 contracts of $1m 90/360 STIR futures from 95.00 to 94.50. What is the P&L in currency units?",
    hint: "Short gains when price falls: ticks × $25 × contracts",
    expected: futuresPnlShort(95.0, 94.5, 1_000_000, 0.25, 10),
    tolerance: 0.05,
    unit: "money",
  },
  {
    id: "ex4",
    prompt:
      "Hedge $50m of 3-month exposure with $1m 3-month futures, β = 1. How many contracts (exact)?",
    hint: "n = (N_e / N_c) × (t_e / t_c) × β",
    expected: hedgeContracts(50_000_000, 1_000_000, 0.25, 0.25, 1),
    tolerance: 1e-6,
    unit: "factor",
  },
  {
    id: "ex5",
    prompt:
      "FRA/forward rate is 5.2% and futures-implied rate is 5.0%. What is the rate basis (decimal)?",
    hint: "basis = r_forward − r_futures",
    expected: rateBasis(0.052, 0.05),
    tolerance: 1e-8,
    unit: "rate",
  },
];

export function Chapter4Exercises() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean | null>>({});

  const status = useMemo(() => {
    return EXERCISES.map((ex) => {
      const raw = answers[ex.id];
      if (raw === undefined || raw.trim() === "") return null;
      return isExerciseCorrect(raw, ex.expected, ex.tolerance, ex.unit);
    });
  }, [answers]);

  function check(id: string) {
    const ex = EXERCISES.find((e) => e.id === id)!;
    const raw = answers[id] ?? "";
    setChecked((c) => ({
      ...c,
      [id]: isExerciseCorrect(raw, ex.expected, ex.tolerance, ex.unit),
    }));
  }

  return (
    <div className="space-y-6">
      {EXERCISES.map((ex, idx) => (
        <div key={ex.id} className="border border-ink-200 bg-white p-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-500">
            Exercise {idx + 1}
          </div>
          <p className="text-ink-900">{ex.prompt}</p>
          <p className="mt-1 text-sm text-ink-600">
            <span className="font-medium">Hint:</span> {ex.hint}
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-2">
            <label className="field grow">
              <span>Your answer</span>
              <input
                type="number"
                step="any"
                value={answers[ex.id] ?? ""}
                onChange={(e) => {
                  setAnswers((a) => ({ ...a, [ex.id]: e.target.value }));
                  setChecked((c) => ({ ...c, [ex.id]: null }));
                }}
              />
            </label>
            <button type="button" className="btn-secondary" onClick={() => check(ex.id)}>
              Check
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setRevealed((r) => ({ ...r, [ex.id]: !r[ex.id] }))}
            >
              {revealed[ex.id] ? "Hide solution" : "Show solution"}
            </button>
          </div>
          {checked[ex.id] === true && (
            <p className="mt-2 text-sm font-medium text-green-800">Correct.</p>
          )}
          {checked[ex.id] === false && (
            <p className="mt-2 text-sm font-medium text-red-800">
              Not quite — check quote convention, tick value, and hedge formula.
            </p>
          )}
          {revealed[ex.id] && (
            <p className="mt-2 border-t border-ink-100 pt-2 font-mono text-sm text-ink-800">
              Solution: {formatExerciseSolution(ex.expected, ex.unit)}
            </p>
          )}
        </div>
      ))}
      <p className="text-sm text-ink-500">
        Answered correctly: {status.filter((s) => s === true).length} / {EXERCISES.length}
      </p>
    </div>
  );
}

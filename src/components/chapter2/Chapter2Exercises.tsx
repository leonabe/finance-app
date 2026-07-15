"use client";

import { useMemo, useState } from "react";
import {
  yearFractionFromDays,
  discountProceeds,
  yieldFromDiscountRate,
  moneyMarketFutureValue,
} from "@/lib/finance/chapter2";
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
      "A money-market period has 91 actual days. What is the ACT/360 year fraction? (as a decimal)",
    hint: "t = days / 360",
    expected: yearFractionFromDays(91, 360),
    tolerance: 1e-8,
    unit: "factor",
  },
  {
    id: "ex2",
    prompt:
      "T-bill face 1,000,000, bank discount rate 5% p.a., 90 days on ACT/360. What are the proceeds?",
    hint: "P = F × (1 − d × t), t = 90/360",
    expected: discountProceeds(1_000_000, 0.05, 90 / 360),
    tolerance: 0.01,
    unit: "money",
  },
  {
    id: "ex3",
    prompt:
      "Same bill: convert the 5% discount rate to simple yield (enter as a decimal rate, e.g. 0.05 not 5%). ACT/360, 90 days.",
    hint: "y = d / (1 − d × t)",
    expected: yieldFromDiscountRate(0.05, 90 / 360),
    tolerance: 1e-6,
    unit: "rate",
  },
  {
    id: "ex4",
    prompt:
      "Deposit 2,000,000 at 3.5% p.a. for 91 days ACT/360. What is the maturity value?",
    hint: "FV = P × (1 + r × t)",
    expected: moneyMarketFutureValue(2_000_000, 0.035, 91 / 360),
    tolerance: 0.01,
    unit: "money",
  },
];

export function Chapter2Exercises() {
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
              Not quite — check the day basis and formula.
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

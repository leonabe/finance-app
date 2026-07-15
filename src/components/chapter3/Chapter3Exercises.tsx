"use client";

import { useMemo, useState } from "react";
import {
  forwardForwardRate,
  fraSettlement,
  fraInterestDifference,
} from "@/lib/finance/chapter3";
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
      "Cash rates: 90-day 4% and 180-day 4.5% (ACT/360). What is the 3×6 forward-forward rate? Enter as a decimal (e.g. 0.05).",
    hint: "F = [(1+r₂ t₂)/(1+r₁ t₁) − 1] / t_F with t = days/360",
    expected: forwardForwardRate(0.04, 90 / 360, 0.045, 180 / 360, 90 / 360),
    tolerance: 1e-6,
    unit: "rate",
  },
  {
    id: "ex2",
    prompt:
      "FRA: notional 10,000,000, K = 5%, fixing L = 6%, period 90 days ACT/360. What is the discounted settlement to the buyer?",
    hint: "Settlement = N(L−K)t / (1+L t)",
    expected: fraSettlement(10_000_000, 0.06, 0.05, 90 / 360),
    tolerance: 0.05,
    unit: "money",
  },
  {
    id: "ex3",
    prompt:
      "Same FRA inputs as exercise 2. What is the undiscounted interest difference N(L−K)t?",
    hint: "Δ = N × (L − K) × t",
    expected: fraInterestDifference(10_000_000, 0.06, 0.05, 90 / 360),
    tolerance: 0.01,
    unit: "money",
  },
  {
    id: "ex4",
    prompt:
      "Near 60 days @ 3%, far 150 days @ 3.5% (ACT/360). Fair 2×5 FRA rate as a decimal?",
    hint: "Same forward-forward formula; t_F = 90/360",
    expected: forwardForwardRate(0.03, 60 / 360, 0.035, 150 / 360, 90 / 360),
    tolerance: 1e-6,
    unit: "rate",
  },
];

export function Chapter3Exercises() {
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
              Not quite — check tenors, day basis, and whether settlement is discounted.
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

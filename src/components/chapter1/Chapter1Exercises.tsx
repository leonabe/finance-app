"use client";

import { useMemo, useState } from "react";
import {
  simpleFutureValue,
  compoundFutureValue,
  discountFactor,
  netPresentValue,
  formatMoney,
} from "@/lib/finance/chapter1";

type Exercise = {
  id: string;
  prompt: string;
  hint: string;
  /** Expected numeric answer for checking */
  expected: number;
  tolerance: number;
  unit: "money" | "factor" | "rate";
};

const EXERCISES: Exercise[] = [
  {
    id: "ex1",
    prompt:
      "A deposit of 10,000 earns simple interest at 5% p.a. for 2 years. What is the future value?",
    hint: "FV = P × (1 + r × t)",
    expected: simpleFutureValue(10_000, 0.05, 2),
    tolerance: 0.01,
    unit: "money",
  },
  {
    id: "ex2",
    prompt:
      "Compound 1,000 at 6% p.a. annually for 3 years. What is the future value (to 2 d.p.)?",
    hint: "FV = P × (1 + r)^n",
    expected: compoundFutureValue(1_000, 0.06, 3, 1),
    tolerance: 0.05,
    unit: "money",
  },
  {
    id: "ex3",
    prompt:
      "What is the annual discount factor for a cashflow in 1 year when the discount rate is 5%?",
    hint: "DF = 1 / (1 + r)",
    expected: discountFactor(0.05, 1, 1),
    tolerance: 1e-6,
    unit: "factor",
  },
  {
    id: "ex4",
    prompt:
      "Project cashflows: −100 at t=0, +60 at t=1, +60 at t=2. NPV at 10% p.a. (annual compounding)?",
    hint: "NPV = Σ CF_t / (1+r)^t",
    expected: netPresentValue(
      [
        { t: 0, amount: -100 },
        { t: 1, amount: 60 },
        { t: 2, amount: 60 },
      ],
      0.1,
      1
    ),
    tolerance: 0.01,
    unit: "money",
  },
];

function formatExpected(ex: Exercise): string {
  if (ex.unit === "money") return formatMoney(ex.expected);
  if (ex.unit === "rate") return `${(ex.expected * 100).toFixed(4)}%`;
  return ex.expected.toFixed(8);
}

export function Chapter1Exercises() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean | null>>({});

  const status = useMemo(() => {
    return EXERCISES.map((ex) => {
      const raw = answers[ex.id];
      if (raw === undefined || raw.trim() === "") return null;
      const val = Number(raw);
      if (!Number.isFinite(val)) return false;
      return Math.abs(val - ex.expected) <= ex.tolerance;
    });
  }, [answers]);

  function check(id: string) {
    const ex = EXERCISES.find((e) => e.id === id)!;
    const val = Number(answers[id]);
    const ok = Number.isFinite(val) && Math.abs(val - ex.expected) <= ex.tolerance;
    setChecked((c) => ({ ...c, [id]: ok }));
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
              Not quite — check the formula and rounding.
            </p>
          )}
          {revealed[ex.id] && (
            <p className="mt-2 border-t border-ink-100 pt-2 font-mono text-sm text-ink-800">
              Solution: {formatExpected(ex)}
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

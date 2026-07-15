"use client";

import { useMemo, useState } from "react";
import {
  compoundFutureValue,
  compoundPresentValue,
  continuousFutureValue,
  continuousPresentValue,
  formatMoney,
} from "@/lib/finance/chapter1";

export function TvmCalculator() {
  const [mode, setMode] = useState<"fv" | "pv">("fv");
  const [amount, setAmount] = useState(1_000);
  const [ratePct, setRatePct] = useState(6);
  const [years, setYears] = useState(3);
  const [m, setM] = useState(1);
  const [continuous, setContinuous] = useState(false);

  const rate = ratePct / 100;

  const result = useMemo(() => {
    if (continuous) {
      return mode === "fv"
        ? continuousFutureValue(amount, rate, years)
        : continuousPresentValue(amount, rate, years);
    }
    return mode === "fv"
      ? compoundFutureValue(amount, rate, years, m)
      : compoundPresentValue(amount, rate, years, m);
  }, [mode, amount, rate, years, m, continuous]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Time value of money (PV / FV)</h3>
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`tab-btn ${mode === "fv" ? "active" : ""}`}
          onClick={() => setMode("fv")}
        >
          Future value of P
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === "pv" ? "active" : ""}`}
          onClick={() => setMode("pv")}
        >
          Present value of FV
        </button>
      </div>
      <div className="calc-grid">
        <label className="field">
          <span>{mode === "fv" ? "Principal P" : "Future value FV"}</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Rate r (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Time t (years)</span>
          <input
            type="number"
            step="0.01"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Compounds / year (m)</span>
          <input
            type="number"
            min={1}
            disabled={continuous}
            value={m}
            onChange={(e) => setM(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      </div>
      <label className="mt-2 flex items-center gap-2 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={continuous}
          onChange={(e) => setContinuous(e.target.checked)}
        />
        Continuous compounding
      </label>
      <div className="mt-4 border-t border-ink-200 pt-3">
        <div className="text-xs uppercase tracking-wider text-ink-500">
          {mode === "fv" ? "Future value" : "Present value"}
        </div>
        <div className="font-mono text-2xl text-ink-900">{formatMoney(result)}</div>
      </div>
    </div>
  );
}

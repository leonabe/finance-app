"use client";

import { useMemo, useState } from "react";
import {
  yieldFromDiscountRate,
  discountRateFromYield,
  yearFractionFromDays,
  formatRate,
} from "@/lib/finance/chapter2";

export function YieldConversionCalculator() {
  const [mode, setMode] = useState<"d2y" | "y2d">("d2y");
  const [ratePct, setRatePct] = useState(5);
  const [days, setDays] = useState(90);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const rate = ratePct / 100;

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    if (mode === "d2y") {
      const y = yieldFromDiscountRate(rate, t);
      return { t, inputLabel: "Discount rate d", outputLabel: "Simple yield y", output: y };
    }
    const d = discountRateFromYield(rate, t);
    return { t, inputLabel: "Simple yield y", outputLabel: "Discount rate d", output: d };
  }, [mode, rate, days, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Discount rate ↔ simple yield</h3>
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`tab-btn ${mode === "d2y" ? "active" : ""}`}
          onClick={() => setMode("d2y")}
        >
          d → y
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === "y2d" ? "active" : ""}`}
          onClick={() => setMode("y2d")}
        >
          y → d
        </button>
      </div>
      <div className="calc-grid">
        <label className="field">
          <span>{results.inputLabel} (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Days</span>
          <input
            type="number"
            min={1}
            value={days}
            onChange={(e) => setDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Year basis</span>
          <select
            value={yearBasis}
            onChange={(e) => setYearBasis(Number(e.target.value) as 360 | 365)}
          >
            <option value={360}>360</option>
            <option value={365}>365</option>
          </select>
        </label>
      </div>
      <div className="mt-4 border-t border-ink-200 pt-3">
        <div className="text-xs uppercase tracking-wider text-ink-500">
          {results.outputLabel} · t = {results.t.toFixed(6)}
        </div>
        <div className="font-mono text-2xl text-ink-900">{formatRate(results.output, 6)}</div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  discountFactor,
  continuousDiscountFactor,
  effectiveAnnualRate,
  formatRate,
} from "@/lib/finance/chapter1";

export function DiscountFactorCalculator() {
  const [ratePct, setRatePct] = useState(5);
  const [years, setYears] = useState(1);
  const [m, setM] = useState(1);

  const rate = ratePct / 100;

  const results = useMemo(() => {
    const df = discountFactor(rate, years, m);
    const cdf = continuousDiscountFactor(rate, years);
    const ear = effectiveAnnualRate(rate, m);
    return { df, cdf, ear };
  }, [rate, years, m]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Discount factors & EAR</h3>
      <div className="calc-grid">
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
            value={m}
            onChange={(e) => setM(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      </div>
      <table className="result-table">
        <tbody>
          <tr>
            <td>Discount factor DF(t)</td>
            <td className="num font-mono">{results.df.toFixed(8)}</td>
          </tr>
          <tr>
            <td>Continuous DF e^{"-rt"}</td>
            <td className="num font-mono">{results.cdf.toFixed(8)}</td>
          </tr>
          <tr>
            <td>Effective annual rate</td>
            <td className="num font-mono">{formatRate(results.ear, 6)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-sm text-ink-600">
        Present value of a unit cashflow at t: PV = 1 × DF(t). For amount A: PV = A × DF(t).
      </p>
    </div>
  );
}

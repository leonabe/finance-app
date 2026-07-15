"use client";

import { useMemo, useState } from "react";
import {
  forwardForwardRate,
  yearFractionFromDays,
  formatRate,
} from "@/lib/finance/chapter3";

export function ForwardForwardCalculator() {
  const [nearRatePct, setNearRatePct] = useState(4);
  const [farRatePct, setFarRatePct] = useState(4.5);
  const [nearDays, setNearDays] = useState(90);
  const [farDays, setFarDays] = useState(180);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    const t1 = yearFractionFromDays(nearDays, yearBasis);
    const t2 = yearFractionFromDays(farDays, yearBasis);
    const tF = yearFractionFromDays(farDays - nearDays, yearBasis);
    if (farDays <= nearDays) {
      return { t1, t2, tF, F: null as number | null, error: "Far days must exceed near days." };
    }
    try {
      const F = forwardForwardRate(nearRatePct / 100, t1, farRatePct / 100, t2, tF);
      return { t1, t2, tF, F, error: null as string | null };
    } catch (e) {
      return {
        t1,
        t2,
        tF,
        F: null,
        error: e instanceof Error ? e.message : "Invalid inputs",
      };
    }
  }, [nearRatePct, farRatePct, nearDays, farDays, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Forward-forward rate</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Near cash rate r₁ (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={nearRatePct}
            onChange={(e) => setNearRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Far cash rate r₂ (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={farRatePct}
            onChange={(e) => setFarRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Near days (to start)</span>
          <input
            type="number"
            min={1}
            value={nearDays}
            onChange={(e) => setNearDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Far days (to end)</span>
          <input
            type="number"
            min={1}
            value={farDays}
            onChange={(e) => setFarDays(Math.max(0, Number(e.target.value) || 0))}
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
      {results.error ? (
        <p className="mt-3 text-sm text-red-800">{results.error}</p>
      ) : (
        <table className="result-table">
          <tbody>
            <tr>
              <td>t₁ (near)</td>
              <td className="num font-mono">{results.t1.toFixed(8)}</td>
            </tr>
            <tr>
              <td>t₂ (far)</td>
              <td className="num font-mono">{results.t2.toFixed(8)}</td>
            </tr>
            <tr>
              <td>t_F (forward period)</td>
              <td className="num font-mono">{results.tF.toFixed(8)}</td>
            </tr>
            <tr>
              <td>Forward-forward rate F</td>
              <td className="num font-mono text-lg">
                {results.F !== null ? formatRate(results.F, 6) : "—"}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

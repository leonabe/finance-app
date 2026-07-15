"use client";

import { useMemo, useState } from "react";
import {
  fraValueBuyer,
  forwardForwardRate,
  yearFractionFromDays,
  formatMoney,
  formatRate,
} from "@/lib/finance/chapter3";

export function FraValueCalculator() {
  const [notional, setNotional] = useState(10_000_000);
  const [fraRatePct, setFraRatePct] = useState(5);
  const [nearRatePct, setNearRatePct] = useState(4);
  const [farRatePct, setFarRatePct] = useState(4.8);
  const [nearDays, setNearDays] = useState(30);
  const [farDays, setFarDays] = useState(120);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    if (farDays <= nearDays) {
      return { error: "Far days must exceed near days.", F: null as number | null, value: null as number | null, tF: 0 };
    }
    const t1 = yearFractionFromDays(nearDays, yearBasis);
    const t2 = yearFractionFromDays(farDays, yearBasis);
    const tF = yearFractionFromDays(farDays - nearDays, yearBasis);
    const F = forwardForwardRate(nearRatePct / 100, t1, farRatePct / 100, t2, tF);
    const value = fraValueBuyer(notional, F, fraRatePct / 100, tF);
    return { error: null as string | null, F, value, tF };
  }, [notional, fraRatePct, nearRatePct, farRatePct, nearDays, farDays, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · FRA value from current cash curve</h3>
      <p className="mb-3 text-sm text-ink-600">
        Builds today&apos;s fair forward F from two cash rates, then values an existing buyer FRA as
        N(F−K)t/(1+F t). If F &gt; K, the hedge has positive mark-to-market for the buyer (rates
        moved against the locked borrow rate).
      </p>
      <div className="calc-grid">
        <label className="field">
          <span>Notional N</span>
          <input
            type="number"
            value={notional}
            onChange={(e) => setNotional(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Contract FRA rate K (%)</span>
          <input
            type="number"
            step="0.01"
            value={fraRatePct}
            onChange={(e) => setFraRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Near cash r₁ (%)</span>
          <input
            type="number"
            step="0.01"
            value={nearRatePct}
            onChange={(e) => setNearRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Far cash r₂ (%)</span>
          <input
            type="number"
            step="0.01"
            value={farRatePct}
            onChange={(e) => setFarRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Days to FRA start</span>
          <input
            type="number"
            value={nearDays}
            onChange={(e) => setNearDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Days to FRA end</span>
          <input
            type="number"
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
        <div className="mt-4 grid gap-3 border-t border-ink-200 pt-3 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Fair forward F</div>
            <div className="font-mono text-2xl text-ink-900">
              {results.F !== null ? formatRate(results.F, 6) : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">
              Value to buyer (t_F = {results.tF.toFixed(4)})
            </div>
            <div className="font-mono text-2xl text-ink-900">
              {results.value !== null ? formatMoney(results.value) : "—"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  discountProceeds,
  discountAmount,
  simpleYieldFromPrice,
  yieldFromDiscountRate,
  yearFractionFromDays,
  formatMoney,
  formatRate,
} from "@/lib/finance/chapter2";

export function DiscountInstrumentCalculator() {
  const [face, setFace] = useState(1_000_000);
  const [discountPct, setDiscountPct] = useState(5);
  const [days, setDays] = useState(90);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const d = discountPct / 100;

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    const proceeds = discountProceeds(face, d, t);
    const discAmt = discountAmount(face, d, t);
    const y = simpleYieldFromPrice(face, proceeds, t);
    const yFromD = yieldFromDiscountRate(d, t);
    return { t, proceeds, discAmt, y, yFromD };
  }, [face, d, days, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Discount instrument (T-bill style)</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Face value F</span>
          <input type="number" value={face} onChange={(e) => setFace(Number(e.target.value))} />
        </label>
        <label className="field">
          <span>Discount rate d (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={discountPct}
            onChange={(e) => setDiscountPct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Days to maturity</span>
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
            <option value={360}>360 (ACT/360)</option>
            <option value={365}>365 (ACT/365)</option>
          </select>
        </label>
      </div>
      <table className="result-table">
        <tbody>
          <tr>
            <td>Year fraction t</td>
            <td className="num font-mono">{results.t.toFixed(8)}</td>
          </tr>
          <tr>
            <td>Proceeds / price P</td>
            <td className="num">{formatMoney(results.proceeds)}</td>
          </tr>
          <tr>
            <td>Discount amount F − P</td>
            <td className="num">{formatMoney(results.discAmt)}</td>
          </tr>
          <tr>
            <td>Simple yield y</td>
            <td className="num font-mono">{formatRate(results.y, 6)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-sm text-ink-600">
        Check: y = d / (1 − d t) → {formatRate(results.yFromD, 6)} (matches simple yield from price).
      </p>
    </div>
  );
}

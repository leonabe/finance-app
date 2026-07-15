"use client";

import { useMemo, useState } from "react";
import {
  moneyMarketFutureValue,
  moneyMarketInterest,
  yearFractionFromDays,
  formatMoney,
  formatRate,
} from "@/lib/finance/chapter2";

export function DepositCalculator() {
  const [principal, setPrincipal] = useState(2_000_000);
  const [ratePct, setRatePct] = useState(3.5);
  const [days, setDays] = useState(91);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const rate = ratePct / 100;

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    const interest = moneyMarketInterest(principal, rate, t);
    const fv = moneyMarketFutureValue(principal, rate, t);
    return { t, interest, fv };
  }, [principal, rate, days, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Money-market deposit / CD</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Principal P</span>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
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
      <table className="result-table">
        <tbody>
          <tr>
            <td>Year fraction t</td>
            <td className="num font-mono">{results.t.toFixed(8)}</td>
          </tr>
          <tr>
            <td>Interest</td>
            <td className="num">{formatMoney(results.interest)}</td>
          </tr>
          <tr>
            <td>Maturity value FV</td>
            <td className="num">{formatMoney(results.fv)}</td>
          </tr>
          <tr>
            <td>Quoted rate</td>
            <td className="num font-mono">{formatRate(rate, 4)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

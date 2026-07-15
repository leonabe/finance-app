"use client";

import { useMemo, useState } from "react";
import {
  simpleInterest,
  simpleFutureValue,
  compoundInterest,
  compoundFutureValue,
  formatMoney,
} from "@/lib/finance/chapter1";

export function InterestCalculator() {
  const [principal, setPrincipal] = useState(10_000);
  const [ratePct, setRatePct] = useState(5);
  const [years, setYears] = useState(2);
  const [m, setM] = useState(1);

  const rate = ratePct / 100;

  const results = useMemo(() => {
    const simpleI = simpleInterest(principal, rate, years);
    const simpleFv = simpleFutureValue(principal, rate, years);
    const compoundI = compoundInterest(principal, rate, years, m);
    const compoundFv = compoundFutureValue(principal, rate, years, m);
    return { simpleI, simpleFv, compoundI, compoundFv };
  }, [principal, rate, years, m]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Simple vs compound interest</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Principal (P)</span>
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
          <span>Time t (years)</span>
          <input
            type="number"
            step="0.01"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Compounds per year (m)</span>
          <input
            type="number"
            min={1}
            step={1}
            value={m}
            onChange={(e) => setM(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
      </div>
      <table className="result-table">
        <thead>
          <tr>
            <th>Method</th>
            <th className="num">Interest</th>
            <th className="num">Future value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Simple</td>
            <td className="num">{formatMoney(results.simpleI)}</td>
            <td className="num">{formatMoney(results.simpleFv)}</td>
          </tr>
          <tr>
            <td>Compound (m = {m})</td>
            <td className="num">{formatMoney(results.compoundI)}</td>
            <td className="num">{formatMoney(results.compoundFv)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

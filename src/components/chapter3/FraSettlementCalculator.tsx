"use client";

import { useMemo, useState } from "react";
import {
  fraSettlement,
  fraSettlementSeller,
  fraInterestDifference,
  yearFractionFromDays,
  formatMoney,
  formatRate,
} from "@/lib/finance/chapter3";

export function FraSettlementCalculator() {
  const [notional, setNotional] = useState(10_000_000);
  const [fraRatePct, setFraRatePct] = useState(5);
  const [fixingPct, setFixingPct] = useState(6);
  const [days, setDays] = useState(90);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    const K = fraRatePct / 100;
    const L = fixingPct / 100;
    const interest = fraInterestDifference(notional, L, K, t);
    const buyer = fraSettlement(notional, L, K, t);
    const seller = fraSettlementSeller(notional, L, K, t);
    return { t, K, L, interest, buyer, seller };
  }, [notional, fraRatePct, fixingPct, days, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · FRA settlement</h3>
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
          <span>FRA rate K (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={fraRatePct}
            onChange={(e) => setFraRatePct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Fixing L (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={fixingPct}
            onChange={(e) => setFixingPct(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>FRA period (days)</span>
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
            <td>Period t</td>
            <td className="num font-mono">{results.t.toFixed(8)}</td>
          </tr>
          <tr>
            <td>Undiscounted N(L−K)t</td>
            <td className="num">{formatMoney(results.interest)}</td>
          </tr>
          <tr>
            <td>Settlement to buyer</td>
            <td className="num">{formatMoney(results.buyer)}</td>
          </tr>
          <tr>
            <td>Settlement to seller</td>
            <td className="num">{formatMoney(results.seller)}</td>
          </tr>
          <tr>
            <td>L − K</td>
            <td className="num font-mono">{formatRate(results.L - results.K, 4)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-sm text-ink-600">
        Positive settlement to the buyer means cash received at the start of the FRA period — the
        offset a borrower uses when fixings rise above the locked rate K.
      </p>
    </div>
  );
}

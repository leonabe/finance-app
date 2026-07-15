"use client";

import { useMemo, useState } from "react";
import {
  futuresPriceFromRate,
  impliedRateFromPrice,
  tickValue,
  pointValue,
  yearFractionFromDays,
  formatRate,
  formatMoney,
} from "@/lib/finance/chapter4";

export function StirPricingCalculator() {
  const [mode, setMode] = useState<"rate2px" | "px2rate">("rate2px");
  const [ratePct, setRatePct] = useState(5);
  const [price, setPrice] = useState(95);
  const [notional, setNotional] = useState(1_000_000);
  const [days, setDays] = useState(90);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    const r = mode === "rate2px" ? ratePct / 100 : impliedRateFromPrice(price);
    const px = mode === "rate2px" ? futuresPriceFromRate(ratePct / 100) : price;
    const tick = tickValue(notional, t);
    const point = pointValue(notional, t);
    return { t, r, px, tick, point };
  }, [mode, ratePct, price, notional, days, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · STIR quote, rate &amp; tick value</h3>
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`tab-btn ${mode === "rate2px" ? "active" : ""}`}
          onClick={() => setMode("rate2px")}
        >
          Rate → price
        </button>
        <button
          type="button"
          className={`tab-btn ${mode === "px2rate" ? "active" : ""}`}
          onClick={() => setMode("px2rate")}
        >
          Price → rate
        </button>
      </div>
      <div className="calc-grid">
        {mode === "rate2px" ? (
          <label className="field">
            <span>Implied rate (% p.a.)</span>
            <input
              type="number"
              step="0.01"
              value={ratePct}
              onChange={(e) => setRatePct(Number(e.target.value))}
            />
          </label>
        ) : (
          <label className="field">
            <span>Futures price (index)</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />
          </label>
        )}
        <label className="field">
          <span>Contract notional</span>
          <input
            type="number"
            value={notional}
            onChange={(e) => setNotional(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Underlying days</span>
          <input
            type="number"
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
            <td>Futures price (100 − R%)</td>
            <td className="num font-mono">{results.px.toFixed(4)}</td>
          </tr>
          <tr>
            <td>Implied rate</td>
            <td className="num font-mono">{formatRate(results.r, 6)}</td>
          </tr>
          <tr>
            <td>Year fraction t</td>
            <td className="num font-mono">{results.t.toFixed(6)}</td>
          </tr>
          <tr>
            <td>Tick value (1 bp / 0.01 price)</td>
            <td className="num">{formatMoney(results.tick)}</td>
          </tr>
          <tr>
            <td>Point value (1.00 price)</td>
            <td className="num">{formatMoney(results.point)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  impliedRateFromPrice,
  rateBasis,
  priceBasis,
  futuresPriceFromRate,
  formatRate,
} from "@/lib/finance/chapter4";

export function BasisCalculator() {
  const [futuresPrice, setFuturesPrice] = useState(95);
  const [forwardPct, setForwardPct] = useState(5.2);

  const results = useMemo(() => {
    const futRate = impliedRateFromPrice(futuresPrice);
    const fwd = forwardPct / 100;
    const rb = rateBasis(fwd, futRate);
    const pb = priceBasis(futuresPrice, fwd);
    const theo = futuresPriceFromRate(fwd);
    return { futRate, fwd, rb, pb, theo };
  }, [futuresPrice, forwardPct]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Futures vs forward basis</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Futures price (index)</span>
          <input
            type="number"
            step="0.01"
            value={futuresPrice}
            onChange={(e) => setFuturesPrice(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>FRA / forward rate (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={forwardPct}
            onChange={(e) => setForwardPct(Number(e.target.value))}
          />
        </label>
      </div>
      <table className="result-table">
        <tbody>
          <tr>
            <td>Futures-implied rate</td>
            <td className="num font-mono">{formatRate(results.futRate, 6)}</td>
          </tr>
          <tr>
            <td>Theoretical price from forward (100 − R%)</td>
            <td className="num font-mono">{results.theo.toFixed(4)}</td>
          </tr>
          <tr>
            <td>Rate basis (forward − futures)</td>
            <td className="num font-mono">{formatRate(results.rb, 6)}</td>
          </tr>
          <tr>
            <td>Price basis (futures − theoretical)</td>
            <td className="num font-mono">{results.pb.toFixed(4)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-sm text-ink-600">
        Convexity and margining can keep futures rates slightly different from FRA rates for the
        same window — that gap is the basis you hedge and monitor.
      </p>
    </div>
  );
}

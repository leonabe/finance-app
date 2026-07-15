"use client";

import { useMemo, useState } from "react";
import {
  futuresPnlLong,
  futuresPnlShort,
  yearFractionFromDays,
  formatMoney,
} from "@/lib/finance/chapter4";

export function PnlCalculator() {
  const [side, setSide] = useState<"long" | "short">("short");
  const [entry, setEntry] = useState(95);
  const [exitPx, setExitPx] = useState(94.5);
  const [notional, setNotional] = useState(1_000_000);
  const [days, setDays] = useState(90);
  const [contracts, setContracts] = useState(10);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    const t = yearFractionFromDays(days, yearBasis);
    const pnl =
      side === "long"
        ? futuresPnlLong(entry, exitPx, notional, t, contracts)
        : futuresPnlShort(entry, exitPx, notional, t, contracts);
    return { t, pnl };
  }, [side, entry, exitPx, notional, days, contracts, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Futures P&amp;L</h3>
      <div className="mb-3 flex flex-wrap gap-2 text-sm">
        <button
          type="button"
          className={`tab-btn ${side === "long" ? "active" : ""}`}
          onClick={() => setSide("long")}
        >
          Long (gains if rates fall)
        </button>
        <button
          type="button"
          className={`tab-btn ${side === "short" ? "active" : ""}`}
          onClick={() => setSide("short")}
        >
          Short (gains if rates rise)
        </button>
      </div>
      <div className="calc-grid">
        <label className="field">
          <span>Entry price</span>
          <input
            type="number"
            step="0.01"
            value={entry}
            onChange={(e) => setEntry(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Exit price</span>
          <input
            type="number"
            step="0.01"
            value={exitPx}
            onChange={(e) => setExitPx(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Contracts</span>
          <input
            type="number"
            min={1}
            value={contracts}
            onChange={(e) => setContracts(Math.max(1, Number(e.target.value) || 1))}
          />
        </label>
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
      <div className="mt-4 border-t border-ink-200 pt-3">
        <div className="text-xs uppercase tracking-wider text-ink-500">
          Mark-to-market P&amp;L ({side})
        </div>
        <div className="font-mono text-2xl text-ink-900">{formatMoney(results.pnl)}</div>
      </div>
    </div>
  );
}

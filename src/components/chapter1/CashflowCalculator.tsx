"use client";

import { useMemo, useState } from "react";
import {
  netPresentValue,
  internalRateOfReturn,
  formatMoney,
  formatRate,
  type Cashflow,
} from "@/lib/finance/chapter1";

type Row = { t: string; amount: string };

const defaultRows: Row[] = [
  { t: "0", amount: "-1000" },
  { t: "1", amount: "300" },
  { t: "2", amount: "400" },
  { t: "3", amount: "500" },
];

export function CashflowCalculator() {
  const [rows, setRows] = useState<Row[]>(defaultRows);
  const [ratePct, setRatePct] = useState(10);

  const cashflows: Cashflow[] = useMemo(() => {
    return rows
      .map((r) => ({
        t: Number(r.t),
        amount: Number(r.amount),
      }))
      .filter((c) => Number.isFinite(c.t) && Number.isFinite(c.amount));
  }, [rows]);

  const rate = ratePct / 100;

  const npv = useMemo(() => netPresentValue(cashflows, rate, 1), [cashflows, rate]);
  const irr = useMemo(() => internalRateOfReturn(cashflows), [cashflows]);

  function updateRow(index: number, key: keyof Row, value: string) {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addRow() {
    setRows((prev) => [...prev, { t: String(prev.length), amount: "0" }]);
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Cashflow NPV & IRR</h3>
      <div className="calc-grid mb-3">
        <label className="field">
          <span>Discount rate r (% p.a.)</span>
          <input
            type="number"
            step="0.01"
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
          />
        </label>
      </div>
      <table className="result-table">
        <thead>
          <tr>
            <th>t (years)</th>
            <th className="num">Cashflow</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  className="w-full border border-ink-200 bg-white px-2 py-1 font-mono text-sm"
                  value={row.t}
                  onChange={(e) => updateRow(i, "t", e.target.value)}
                />
              </td>
              <td>
                <input
                  className="w-full border border-ink-200 bg-white px-2 py-1 text-right font-mono text-sm"
                  value={row.amount}
                  onChange={(e) => updateRow(i, "amount", e.target.value)}
                />
              </td>
              <td>
                <button
                  type="button"
                  className="text-xs text-ink-500 hover:text-ink-800"
                  onClick={() => removeRow(i)}
                  aria-label="Remove row"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" className="mt-2 text-sm text-ink-700 underline" onClick={addRow}>
        + Add cashflow
      </button>
      <div className="mt-4 grid gap-3 border-t border-ink-200 pt-3 sm:grid-cols-2">
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500">NPV @ {ratePct}%</div>
          <div className="font-mono text-2xl text-ink-900">{formatMoney(npv)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-ink-500">IRR (annual)</div>
          <div className="font-mono text-2xl text-ink-900">
            {irr === null ? "n/a" : formatRate(irr, 4)}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import {
  calendarDaysBetween,
  days360,
  yearFraction,
  type DayCountConvention,
} from "@/lib/finance/chapter2";

const CONVENTIONS: DayCountConvention[] = [
  "ACT/360",
  "ACT/365",
  "ACT/365F",
  "30/360",
  "ACT/ACT",
];

export function DayCountCalculator() {
  const [start, setStart] = useState("2024-01-15");
  const [end, setEnd] = useState("2024-04-15");
  const [convention, setConvention] = useState<DayCountConvention>("ACT/360");

  const results = useMemo(() => {
    try {
      const actDays = calendarDaysBetween(start, end);
      const d360 = days360(start, end, "US");
      const yf = yearFraction(start, end, convention);
      return { actDays, d360, yf, error: null as string | null };
    } catch (e) {
      return {
        actDays: 0,
        d360: 0,
        yf: 0,
        error: e instanceof Error ? e.message : "Invalid dates",
      };
    }
  }, [start, end, convention]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Day-count year fraction</h3>
      <div className="calc-grid">
        <label className="field">
          <span>Start date</span>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label className="field">
          <span>End date</span>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label className="field">
          <span>Convention</span>
          <select
            value={convention}
            onChange={(e) => setConvention(e.target.value as DayCountConvention)}
          >
            {CONVENTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>
      {results.error ? (
        <p className="mt-3 text-sm text-red-800">{results.error}</p>
      ) : (
        <table className="result-table">
          <tbody>
            <tr>
              <td>Actual calendar days</td>
              <td className="num font-mono">{results.actDays}</td>
            </tr>
            <tr>
              <td>30/360 days (US)</td>
              <td className="num font-mono">{results.d360}</td>
            </tr>
            <tr>
              <td>Year fraction ({convention})</td>
              <td className="num font-mono">{results.yf.toFixed(10)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

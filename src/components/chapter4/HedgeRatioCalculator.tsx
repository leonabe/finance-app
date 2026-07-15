"use client";

import { useMemo, useState } from "react";
import {
  hedgeContracts,
  hedgeContractsRounded,
  yearFractionFromDays,
} from "@/lib/finance/chapter4";

export function HedgeRatioCalculator() {
  const [exposure, setExposure] = useState(50_000_000);
  const [contractN, setContractN] = useState(1_000_000);
  const [expDays, setExpDays] = useState(90);
  const [contractDays, setContractDays] = useState(90);
  const [beta, setBeta] = useState(1);
  const [yearBasis, setYearBasis] = useState<360 | 365>(360);

  const results = useMemo(() => {
    const tE = yearFractionFromDays(expDays, yearBasis);
    const tC = yearFractionFromDays(contractDays, yearBasis);
    try {
      const n = hedgeContracts(exposure, contractN, tE, tC, beta);
      const rounded = hedgeContractsRounded(exposure, contractN, tE, tC, beta);
      return { tE, tC, n, rounded, error: null as string | null };
    } catch (e) {
      return {
        tE,
        tC,
        n: 0,
        rounded: 0,
        error: e instanceof Error ? e.message : "Invalid inputs",
      };
    }
  }, [exposure, contractN, expDays, contractDays, beta, yearBasis]);

  return (
    <div className="calc-card">
      <h3 className="calc-title">Calculator · Hedge ratio (number of contracts)</h3>
      <p className="mb-3 text-sm text-ink-600">
        n = (N_exposure / N_contract) × (t_exposure / t_contract) × β. Direction: sell futures to
        hedge a borrower against rising rates; buy to hedge a lender against falling rates.
      </p>
      <div className="calc-grid">
        <label className="field">
          <span>Exposure notional</span>
          <input
            type="number"
            value={exposure}
            onChange={(e) => setExposure(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Contract notional</span>
          <input
            type="number"
            value={contractN}
            onChange={(e) => setContractN(Number(e.target.value))}
          />
        </label>
        <label className="field">
          <span>Exposure days</span>
          <input
            type="number"
            value={expDays}
            onChange={(e) => setExpDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Contract days</span>
          <input
            type="number"
            value={contractDays}
            onChange={(e) => setContractDays(Math.max(0, Number(e.target.value) || 0))}
          />
        </label>
        <label className="field">
          <span>Beta (β)</span>
          <input
            type="number"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(Number(e.target.value))}
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
            <div className="text-xs uppercase tracking-wider text-ink-500">Contracts (exact)</div>
            <div className="font-mono text-2xl text-ink-900">{results.n.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-500">Rounded (nearest)</div>
            <div className="font-mono text-2xl text-ink-900">{results.rounded}</div>
          </div>
        </div>
      )}
    </div>
  );
}

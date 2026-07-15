import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StirPricingCalculator } from "@/components/chapter4/StirPricingCalculator";
import { PnlCalculator } from "@/components/chapter4/PnlCalculator";
import { BasisCalculator } from "@/components/chapter4/BasisCalculator";
import { HedgeRatioCalculator } from "@/components/chapter4/HedgeRatioCalculator";
import { Chapter4Exercises } from "@/components/chapter4/Chapter4Exercises";

export function Chapter4Page() {
  return (
    <article className="prose-textbook">
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Chapter 4</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          Interest Rate Futures
        </h1>
        <p className="mt-2 max-w-3xl text-ink-700">
          Short-term interest rate (STIR) futures put a liquid, exchange-traded price on the same
          kind of forward rates you met with FRAs. This chapter covers the quote convention, tick
          value, basis versus cash/FRA rates, and how many contracts to trade when hedging — with
          the same clean calculators and exercises as earlier chapters.
        </p>
        <nav className="chapter-toc mt-4 text-sm" aria-label="Chapter sections">
          <ol className="flex flex-wrap gap-x-4 gap-y-1 list-none pl-0">
            <li>
              <a href="#stir">4.1 STIR futures</a>
            </li>
            <li>
              <a href="#pricing">4.2 Pricing &amp; P&amp;L</a>
            </li>
            <li>
              <a href="#basis">4.3 Basis</a>
            </li>
            <li>
              <a href="#hedge">4.4 Hedge ratios</a>
            </li>
            <li>
              <a href="#exercises">4.5 Exercises</a>
            </li>
          </ol>
        </nav>
      </header>

      <section id="stir">
        <SectionHeading number="4.1">Short-term interest rate futures</SectionHeading>
        <p>
          <strong>Why this matters.</strong> An FRA is a custom OTC deal with a bank. A{" "}
          <strong>STIR futures</strong> (Eurodollar-style, SOFR futures, short sterling, etc.) is a
          standardised exchange contract on a three-month (or similar) forward rate. You get daily
          margin, transparent prices, and easy entry/exit — useful when you need to hedge or trade
          the rate view without negotiating each ticket.
        </p>
        <p>
          Economically the contract still tracks a forward interest rate for a future deposit
          period. The difference is packaging: futures use an <em>index quote</em>, mark to market
          every day, and have a fixed notional and period (textbook default: $1,000,000 × 90 days on
          a 360-day basis).
        </p>
        <p>
          <strong>Direction reminder.</strong> Futures <em>prices</em> rise when implied rates fall
          (quote = 100 − rate%). So a borrower who fears <em>higher</em> rates typically{" "}
          <strong>sells</strong> STIR futures — the mirror image of buying an FRA to hedge the same
          risk (Chapter 3).
        </p>
      </section>

      <section id="pricing">
        <SectionHeading number="4.2">Pricing, ticks, and P&amp;L</SectionHeading>
        <p>
          The market quotes an index, not the rate itself. If the implied futures rate is 5% p.a.,
          the price is 95.00. Move the rate up one basis point (to 5.01%) and the price falls to
          94.99. That one-tick move has a fixed dollar value on a given contract:
        </p>
        <FormulaBlock
          title="Quote and tick value"
          formula={`Price = 100 − (rate × 100)
Rate  = (100 − Price) / 100

VP01 = tick value = N × 0.0001 × t
Classic: N = 1,000,000, t = 90/360 → VP01 = $25

Point value (1.00 on the index) = 100 × VP01`}
          notes={[
            "N = contract notional, t = underlying year fraction",
            "Long P&L ≈ (exit − entry) / 0.01 × VP01 × contracts",
            "Short P&L = − long P&L",
          ]}
        />
        <p>
          Daily variation margin means P&amp;L is realised as the quote moves — another reason
          futures rates can differ slightly from FRA rates for the same window (see basis).
        </p>
        <StirPricingCalculator />
        <PnlCalculator />
      </section>

      <section id="basis">
        <SectionHeading number="4.3">Basis (futures vs cash / FRA)</SectionHeading>
        <p>
          The <strong>basis</strong> is the gap between the futures-implied rate and a related cash
          or FRA/forward rate for a comparable period. It is not an error: margining, convexity, and
          day-count details keep the two markets close but not identical. Hedgers watch basis
          because a “perfect” futures hedge still leaves residual basis risk.
        </p>
        <FormulaBlock
          title="Simple basis measures"
          formula={`Rate basis  = r_forward (or cash) − r_futures
Price basis = futures price − theoretical price from r_forward
            = futures price − (100 − 100 × r_forward)`}
          notes={[
            "Positive rate basis → forward/cash higher than futures-implied rate",
            "Convexity often pulls futures rates slightly above FRA rates for longer horizons",
          ]}
        />
        <BasisCalculator />
      </section>

      <section id="hedge">
        <SectionHeading number="4.4">Hedge ratios and practical use</SectionHeading>
        <p>
          <strong>Borrower hedge.</strong> A firm rolling $50m of three-month funding in line with a
          futures expiry can <strong>sell</strong> STIR futures so that if rates rise, futures P&amp;L
          offsets higher loan interest. Matching notionals and periods with β = 1 gives about 50
          contracts of $1m futures.
        </p>
        <p>
          <strong>Lender / investor hedge.</strong> Someone locking a future investment rate{" "}
          <strong>buys</strong> futures so that falling rates produce futures gains that replace
          missing deposit income.
        </p>
        <FormulaBlock
          title="Number of contracts"
          formula={`n = (N_exposure / N_contract) × (t_exposure / t_contract) × β

β = sensitivity of the exposure rate to the futures rate (default 1)
Round n to a whole number of contracts in practice.`}
          notes={[
            "Longer exposure periods need more short-period contracts (t ratio)",
            "Choose long vs short separately from the size n",
          ]}
        />
        <HedgeRatioCalculator />
      </section>

      <section id="exercises">
        <SectionHeading number="4.5">Practice exercises</SectionHeading>
        <p>
          Work quote conversion, short hedge P&amp;L, hedge size, and basis. Enter rates as decimals
          (e.g. 0.05). Solutions use the same checker path as the unit tests.
        </p>
        <Chapter4Exercises />
      </section>

      <section className="mt-12 border-t border-ink-200 pt-6 text-sm text-ink-600">
        <h2 className="mb-2 text-base font-semibold text-ink-900">Formula quick reference</h2>
        <table className="result-table">
          <thead>
            <tr>
              <th>Topic</th>
              <th>Key formula</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Futures price</td>
              <td className="font-mono text-xs">100 − 100r</td>
            </tr>
            <tr>
              <td>Tick / VP01</td>
              <td className="font-mono text-xs">N × 0.0001 × t</td>
            </tr>
            <tr>
              <td>Rate basis</td>
              <td className="font-mono text-xs">r_fwd − r_fut</td>
            </tr>
            <tr>
              <td>Hedge contracts</td>
              <td className="font-mono text-xs">
                (N_e / N_c) × (t_e / t_c) × β
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}

import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ForwardForwardCalculator } from "@/components/chapter3/ForwardForwardCalculator";
import { FraSettlementCalculator } from "@/components/chapter3/FraSettlementCalculator";
import { FraValueCalculator } from "@/components/chapter3/FraValueCalculator";
import { Chapter3Exercises } from "@/components/chapter3/Chapter3Exercises";

export function Chapter3Page() {
  return (
    <article className="prose-textbook">
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Chapter 3</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          Forward-Forwards and FRAs
        </h1>
        <p className="mt-2 max-w-3xl text-ink-700">
          Cash markets only quote rates that start <em>today</em>. Firms, banks, and investors often
          care about a rate that will apply <em>later</em> — for example a three-month loan starting
          in three months. This chapter shows how today&apos;s curve implies that future rate, how a
          FRA turns it into a hedge contract, and how settlement cash makes the hedge work.
        </p>
        <nav className="chapter-toc mt-4 text-sm" aria-label="Chapter sections">
          <ol className="flex flex-wrap gap-x-4 gap-y-1 list-none pl-0">
            <li>
              <a href="#ff">3.1 Forward-forward rates</a>
            </li>
            <li>
              <a href="#fra">3.2 Forward rate agreements</a>
            </li>
            <li>
              <a href="#settlement">3.3 Settlement</a>
            </li>
            <li>
              <a href="#hedge">3.4 Hedging uses</a>
            </li>
            <li>
              <a href="#exercises">3.5 Exercises</a>
            </li>
          </ol>
        </nav>
      </header>

      <section id="ff">
        <SectionHeading number="3.1">Forward-forward rates</SectionHeading>
        <p>
          <strong>Why this matters.</strong> Suppose you can borrow (or deposit) for 90 days at one
          rate and for 180 days at another. Those two prices already encode a view of what the
          market will charge for money <em>between</em> day 90 and day 180. That implied future rate
          is the <strong>forward-forward rate</strong> — the break-even rate that makes rolling a
          short deposit as good as taking the longer deposit outright.
        </p>
        <p>
          The intuition is no-arbitrage: growing $1 for the long period in one step must match
          growing it in two steps (near period, then reinvest for the forward period). If the
          mid-path rate differed, traders could lock a risk-free profit by borrowing on one path
          and lending on the other. Markets therefore set the forward so the two paths match:
        </p>
        <FormulaBlock
          title="Forward-forward rate F"
          formula={`(1 + r₁ × t₁) × (1 + F × t_F) = (1 + r₂ × t₂)

F = [ (1 + r₂ t₂) / (1 + r₁ t₁) − 1 ] / t_F`}
          notes={[
            "r₁, t₁ — cash rate and year fraction to the near date (start of the future period)",
            "r₂, t₂ — cash rate and year fraction to the far date (end of the future period)",
            "t_F — length of the forward window (often t₂ − t₁ when both cash rates start today)",
            "Use the same day-count as the cash market (e.g. ACT/360)",
          ]}
        />
        <p>
          Market shorthand such as <em>3×6</em> means “a three-month rate starting in three months”
          (near = 3 months, far = 6 months). That number is exactly the fair fixed rate for an FRA
          covering the same window — which is why we compute F before we discuss the contract.
        </p>
        <ForwardForwardCalculator />
      </section>

      <section id="fra">
        <SectionHeading number="3.2">Forward rate agreements (FRAs)</SectionHeading>
        <p>
          Knowing the fair forward rate is useful; trading it is more useful. A{" "}
          <strong>forward rate agreement (FRA)</strong> is an OTC contract that locks that future
          interest rate on a notional amount for a stated period. No loan principal changes hands —
          only a cash settlement when the market fixing is known.
        </p>
        <p>
          Two rates appear in every problem: the agreed FRA rate <em>K</em> (fixed at trade) and the
          later reference fixing <em>L</em> (historically LIBOR; textbooks still use the same
          algebra with any agreed fixing). The contract pays the present value of the difference
          between <em>L</em> and <em>K</em> on the notional.
        </p>
        <ul>
          <li>
            <strong>Buyer</strong> of the FRA — economically locks a <em>borrowing</em> rate: pays
            fixed <em>K</em>, and is compensated if the fixing <em>L</em> rises above <em>K</em>.
          </li>
          <li>
            <strong>Seller</strong> of the FRA — locks a <em>lending / investment</em> rate: receives
            fixed <em>K</em>, and is compensated if fixings fall below <em>K</em>.
          </li>
        </ul>
        <p>
          If <em>K</em> equals today&apos;s fair forward-forward rate, the FRA starts at zero value
          (ignoring bid–offer and credit). You are not “buying cheap rates”; you are locking the
          rate the curve already implies.
        </p>
      </section>

      <section id="settlement">
        <SectionHeading number="3.3">Settlement — how the cash offset works</SectionHeading>
        <p>
          Over the FRA period, interest on notional <em>N</em> at rate <em>L</em> versus <em>K</em>{" "}
          would differ by <em>N(L − K)t</em>. In practice that difference is paid{" "}
          <em>up front</em> (at the start of the period / at fixing), so it is discounted for the
          period at the fixing rate. That is why settlement is smaller than the raw interest gap.
        </p>
        <FormulaBlock
          title="FRA settlement (to the buyer)"
          formula={`Interest difference (end of period):  N × (L − K) × t

Discounted settlement (start of period):
  Settlement = N × (L − K) × t / (1 + L × t)`}
          notes={[
            "N = notional, K = FRA rate, L = fixing, t = period year fraction",
            "Positive settlement → cash paid to the buyer",
            "Seller receives the opposite amount",
          ]}
        />
        <p>
          <strong>Reading the sign.</strong> If rates rise so <em>L &gt; K</em>, the buyer receives
          cash. That cash offsets the higher interest the borrower will pay on the actual loan —
          the mechanism behind the hedge in the next section. If rates fall, the buyer pays the
          seller, which offsets cheaper funding the borrower could have obtained in the market.
        </p>
        <FraSettlementCalculator />
      </section>

      <section id="hedge">
        <SectionHeading number="3.4">Hedging uses and valuation</SectionHeading>
        <p>
          <strong>Borrower — why buy an FRA.</strong> Imagine a company that will roll a floating
          loan (or draw a facility) starting in three months for three months. It fears rates will
          rise. By <strong>buying</strong> a matching 3×6 FRA it locks the effective funding rate
          near today&apos;s fair forward. If market rates rise, the FRA settlement paid to the buyer
          offsets the higher loan interest; if rates fall, the FRA costs money but the loan is
          cheaper — net, the package behaves like fixed-rate funding. That is the standard “buy FRA
          to hedge rising rates” story.
        </p>
        <p>
          <strong>Lender / investor — why sell an FRA.</strong> A bank or treasurer expecting to
          place deposits (or receive floating interest) over a future window can{" "}
          <strong>sell</strong> an FRA to lock a lending rate. If rates fall, the seller receives
          settlement that replaces the missing investment income; if rates rise, the seller pays on
          the FRA but earns more on the deposit.
        </p>
        <p>
          After trade date, cash rates move and the fair forward <em>F</em> changes. An off-market
          FRA then has mark-to-market value. A simple textbook estimate reuses the settlement formula
          with <em>F</em> in place of the fixing:
        </p>
        <FormulaBlock
          title="Simplified value to FRA buyer"
          formula={`Value ≈ N × (F − K) × t / (1 + F × t)

where F is the current fair forward-forward rate for the same period.`}
          notes={[
            "Same structure as settlement; L is replaced by today’s fair F",
            "Production systems may discount further from FRA start back to today",
          ]}
        />
        <FraValueCalculator />
      </section>

      <section id="exercises">
        <SectionHeading number="3.5">Practice exercises</SectionHeading>
        <p>
          Use the intuition above: first build the forward from two cash rates, then settle or value
          the FRA. Enter rates as decimals (e.g. 0.05). Solutions use the same checker path as the
          unit tests.
        </p>
        <Chapter3Exercises />
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
              <td>Forward-forward F</td>
              <td className="font-mono text-xs">
                [(1+r₂t₂)/(1+r₁t₁) − 1] / t_F
              </td>
            </tr>
            <tr>
              <td>Interest difference</td>
              <td className="font-mono text-xs">N(L − K)t</td>
            </tr>
            <tr>
              <td>FRA settlement (buyer)</td>
              <td className="font-mono text-xs">N(L − K)t / (1 + L t)</td>
            </tr>
            <tr>
              <td>Value ≈ settlement at F</td>
              <td className="font-mono text-xs">N(F − K)t / (1 + F t)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}

import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InterestCalculator } from "@/components/chapter1/InterestCalculator";
import { TvmCalculator } from "@/components/chapter1/TvmCalculator";
import { DiscountFactorCalculator } from "@/components/chapter1/DiscountFactorCalculator";
import { CashflowCalculator } from "@/components/chapter1/CashflowCalculator";
import { Chapter1Exercises } from "@/components/chapter1/Chapter1Exercises";

export function Chapter1Page() {
  return (
    <article className="prose-textbook">
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Chapter 1</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">
          Financial Arithmetic Basics
        </h1>
        <p className="mt-2 max-w-3xl text-ink-700">
          Interest, the time value of money, discount factors, and cashflow analysis form the
          toolkit for every later market instrument. Work the formulas carefully; the calculators
          use the same pure functions as the unit tests.
        </p>
        <nav className="chapter-toc mt-4 text-sm" aria-label="Chapter sections">
          <ol className="flex flex-wrap gap-x-4 gap-y-1 list-none pl-0">
            <li>
              <a href="#interest">1.1 Interest</a>
            </li>
            <li>
              <a href="#tvm">1.2 Time value of money</a>
            </li>
            <li>
              <a href="#discount">1.3 Discount factors</a>
            </li>
            <li>
              <a href="#cashflows">1.4 Cashflow analysis</a>
            </li>
            <li>
              <a href="#exercises">1.5 Exercises</a>
            </li>
          </ol>
        </nav>
      </header>

      <section id="interest">
        <SectionHeading number="1.1">Simple and compound interest</SectionHeading>
        <p>
          <strong>Simple interest</strong> accrues only on the original principal. Over time{" "}
          <em>t</em> years at annual rate <em>r</em>, interest is proportional to principal and
          time. Simple interest is common for short money-market periods when quoted that way; for
          multi-period investments, compounding is the usual market convention.
        </p>
        <FormulaBlock
          title="Simple interest"
          formula={`I  = P × r × t
FV = P × (1 + r × t)
PV = FV / (1 + r × t)`}
          notes={[
            "P = principal, r = annual rate (decimal), t = time in years",
            "I = interest amount; FV = future value; PV = present value",
          ]}
        />
        <p>
          <strong>Compound interest</strong> reinvests interest so that each period earns on an
          increasing balance. With <em>m</em> compounding periods per year and nominal rate{" "}
          <em>r</em>:
        </p>
        <FormulaBlock
          title="Compound interest"
          formula={`FV = P × (1 + r/m)^(m × t)
PV = FV / (1 + r/m)^(m × t)
I  = FV − P`}
          notes={[
            "m = 1 annual, 2 semi-annual, 4 quarterly, 12 monthly",
            "Continuous limit: FV = P × e^(r t)",
          ]}
        />
        <InterestCalculator />
      </section>

      <section id="tvm">
        <SectionHeading number="1.2">Time value of money</SectionHeading>
        <p>
          A unit of currency today is not the same as a unit received later: money can be invested
          at a positive rate of interest. Moving cash <em>forward</em> uses accumulation (future
          value); moving cash <em>back</em> to today uses discounting (present value). The same
          rate must be used consistently with the compounding convention.
        </p>
        <FormulaBlock
          title="PV / FV relationships"
          formula={`FV(P) = P × (1 + r/m)^(m t)
PV(FV) = FV × (1 + r/m)^(-(m t))
Continuous: FV = P e^(r t),  PV = FV e^(-r t)`}
        />
        <TvmCalculator />
      </section>

      <section id="discount">
        <SectionHeading number="1.3">Discount factors</SectionHeading>
        <p>
          The <strong>discount factor</strong> DF(<em>t</em>) is the present value of one unit of
          currency paid at time <em>t</em>. All linear cashflow valuations are weighted sums of
          cash amounts times the appropriate discount factors. Markets often quote rates; pricing
          engines work in discount factors.
        </p>
        <FormulaBlock
          title="Discount factors"
          formula={`DF(t) = 1 / (1 + r/m)^(m t)
DF_cont(t) = e^(-r t)
PV of amount A at t:  A × DF(t)`}
          notes={[
            "Effective annual rate from nominal r with m compounds: EAR = (1 + r/m)^m − 1",
          ]}
        />
        <DiscountFactorCalculator />
      </section>

      <section id="cashflows">
        <SectionHeading number="1.4">Cashflow analysis (NPV and IRR)</SectionHeading>
        <p>
          A project or instrument is a stream of signed cashflows. The{" "}
          <strong>net present value</strong> (NPV) discounts each cashflow to today and sums them.
          A positive NPV at the required rate of return indicates value creation relative to that
          hurdle rate.
        </p>
        <FormulaBlock
          title="Net present value"
          formula={`NPV(r) = Σ_i  CF_i × DF(t_i)
       = Σ_i  CF_i / (1 + r)^(t_i)   (annual compounding)`}
        />
        <p>
          The <strong>internal rate of return</strong> (IRR) is the rate <em>r*</em> that sets
          NPV(<em>r*</em>) = 0. IRR is useful for comparing projects when cashflow signs change
          once (typical investment then receipts); multiple sign changes can yield multiple roots.
        </p>
        <FormulaBlock
          title="Internal rate of return"
          formula={`Find r* such that NPV(r*) = 0
Solved numerically (Newton–Raphson on Σ CF_i (1+r)^(-t_i) = 0)`}
        />
        <CashflowCalculator />
      </section>

      <section id="exercises">
        <SectionHeading number="1.5">Practice exercises</SectionHeading>
        <p>
          Work these without a calculator first if you can, then verify. Answers are checked
          against the same library functions used above.
        </p>
        <Chapter1Exercises />
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
              <td>Simple FV</td>
              <td className="font-mono text-xs">P(1 + r t)</td>
            </tr>
            <tr>
              <td>Compound FV</td>
              <td className="font-mono text-xs">P(1 + r/m)^(m t)</td>
            </tr>
            <tr>
              <td>Discount factor</td>
              <td className="font-mono text-xs">1 / (1 + r/m)^(m t)</td>
            </tr>
            <tr>
              <td>NPV</td>
              <td className="font-mono text-xs">Σ CF_t · DF(t)</td>
            </tr>
            <tr>
              <td>IRR</td>
              <td className="font-mono text-xs">r* s.t. NPV(r*) = 0</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}

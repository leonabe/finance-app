import { FormulaBlock } from "@/components/ui/FormulaBlock";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DayCountCalculator } from "@/components/chapter2/DayCountCalculator";
import { DiscountInstrumentCalculator } from "@/components/chapter2/DiscountInstrumentCalculator";
import { YieldConversionCalculator } from "@/components/chapter2/YieldConversionCalculator";
import { DepositCalculator } from "@/components/chapter2/DepositCalculator";
import { Chapter2Exercises } from "@/components/chapter2/Chapter2Exercises";

export function Chapter2Page() {
  return (
    <article className="prose-textbook">
      <header className="mb-8 border-b border-ink-200 pb-4">
        <p className="font-mono text-sm text-ink-500">Chapter 2</p>
        <h1 className="text-3xl font-semibold tracking-tight text-ink-900">The Money Market</h1>
        <p className="mt-2 max-w-3xl text-ink-700">
          Short-term instruments, day-count conventions, and the distinction between bank discount
          rates and true (simple) yields. Calculators use the same pure functions as the unit tests.
        </p>
        <nav className="chapter-toc mt-4 text-sm" aria-label="Chapter sections">
          <ol className="flex flex-wrap gap-x-4 gap-y-1 list-none pl-0">
            <li>
              <a href="#instruments">2.1 Instruments</a>
            </li>
            <li>
              <a href="#daycount">2.2 Day-count conventions</a>
            </li>
            <li>
              <a href="#discount">2.3 Discount instruments</a>
            </li>
            <li>
              <a href="#yields">2.4 Yields and conversions</a>
            </li>
            <li>
              <a href="#deposits">2.5 Deposits</a>
            </li>
            <li>
              <a href="#exercises">2.6 Exercises</a>
            </li>
          </ol>
        </nav>
      </header>

      <section id="instruments">
        <SectionHeading number="2.1">Money-market instruments</SectionHeading>
        <p>
          The <strong>money market</strong> is the market for short-term, high-quality debt —
          typically under one year. Instruments differ in quotation convention (discount vs
          add-on/yield) and day-count basis, but all are essentially pure discount or simple-interest
          claims.
        </p>
        <ul>
          <li>
            <strong>Treasury bills</strong> — sold at a discount to face; quoted on a bank discount
            basis (often ACT/360 in USD markets).
          </li>
          <li>
            <strong>Commercial paper / bankers&apos; acceptances</strong> — similar discount structure
            for corporate or bank credit.
          </li>
          <li>
            <strong>Certificates of deposit and deposits</strong> — quoted as simple (add-on)
            interest rates; interest is paid on the principal over the tenor.
          </li>
          <li>
            <strong>Repo and short-term loans</strong> — collateralised or unsecured simple-interest
            financing between market participants.
          </li>
        </ul>
        <p>
          Pricing always reduces to: choose a day-count year fraction <em>t</em>, apply either a
          discount formula or a simple-interest formula consistently with how the instrument is
          quoted.
        </p>
      </section>

      <section id="daycount">
        <SectionHeading number="2.2">Day-count conventions</SectionHeading>
        <p>
          Money-market rates are annualised. The same number of calendar days produces different{" "}
          <strong>year fractions</strong> under different conventions. Always match the convention
          to the market quotation.
        </p>
        <FormulaBlock
          title="Year fraction t"
          formula={`ACT/360:   t = (actual days) / 360
ACT/365:   t = (actual days) / 365
30/360:    t = (30/360 days) / 360
ACT/ACT:   t = sum of (days in year i) / (days in calendar year i)`}
          notes={[
            "USD money markets often use ACT/360; sterling historically ACT/365",
            "30/360 is more common on bonds but appears in some short-term contracts",
          ]}
        />
        <DayCountCalculator />
      </section>

      <section id="discount">
        <SectionHeading number="2.3">Discount instruments</SectionHeading>
        <p>
          A classic T-bill pays face value <em>F</em> at maturity and is purchased today for
          proceeds <em>P</em> &lt; <em>F</em>. Markets often quote a <strong>bank discount rate</strong>{" "}
          <em>d</em> applied to face, not to the amount invested:
        </p>
        <FormulaBlock
          title="Bank discount pricing"
          formula={`P = F × (1 − d × t)
Discount amount = F − P = F × d × t
d = (F − P) / (F × t)`}
          notes={[
            "t = days / year basis (e.g. 90/360)",
            "d understates the true return on capital because the base is F, not P",
          ]}
        />
        <DiscountInstrumentCalculator />
      </section>

      <section id="yields">
        <SectionHeading number="2.4">Simple yield and rate conversion</SectionHeading>
        <p>
          The <strong>simple money-market yield</strong> (true / investment rate) measures return on
          the cash actually invested:
        </p>
        <FormulaBlock
          title="Simple yield"
          formula={`y = (F − P) / (P × t)

From discount rate:
y = d / (1 − d × t)

From simple yield back to discount:
d = y / (1 + y × t)`}
          notes={[
            "For the same instrument and tenor, y > d when d > 0",
            "Always convert rates to a common day-count before comparing instruments",
          ]}
        />
        <YieldConversionCalculator />
      </section>

      <section id="deposits">
        <SectionHeading number="2.5">Deposits and certificates of deposit</SectionHeading>
        <p>
          Deposits and many CDs are quoted as <strong>add-on</strong> (simple interest) rates. Interest
          accrues on principal; maturity value is principal plus interest.
        </p>
        <FormulaBlock
          title="Simple money-market deposit"
          formula={`Interest = P × r × t
FV      = P × (1 + r × t)
r      = (FV − P) / (P × t)`}
        />
        <DepositCalculator />
      </section>

      <section id="exercises">
        <SectionHeading number="2.6">Practice exercises</SectionHeading>
        <p>
          Work these with the formulas first, then verify. Answers are checked against the same
          library functions used in the calculators.
        </p>
        <Chapter2Exercises />
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
              <td>ACT/360 year fraction</td>
              <td className="font-mono text-xs">days / 360</td>
            </tr>
            <tr>
              <td>Discount proceeds</td>
              <td className="font-mono text-xs">F (1 − d t)</td>
            </tr>
            <tr>
              <td>Simple yield</td>
              <td className="font-mono text-xs">(F − P) / (P t)</td>
            </tr>
            <tr>
              <td>d → y</td>
              <td className="font-mono text-xs">d / (1 − d t)</td>
            </tr>
            <tr>
              <td>Deposit FV</td>
              <td className="font-mono text-xs">P (1 + r t)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  );
}

/**
 * Canonical chapter map for the Steiner companion app.
 * Only chapters listed in the product objective are first-class sections.
 */
export type ChapterMeta = {
  number: 1 | 2 | 3 | 4 | 8 | 9;
  slug: string;
  title: string;
  shortTitle: string;
  topics: string[];
  status: "ready" | "placeholder";
};

export const CHAPTERS: ChapterMeta[] = [
  {
    number: 1,
    slug: "1",
    title: "Financial Arithmetic Basics",
    shortTitle: "Ch1 · Arithmetic",
    topics: [
      "Simple and compound interest",
      "Time value of money (PV / FV)",
      "Discount factors",
      "Cashflow analysis (NPV / IRR)",
    ],
    status: "ready",
  },
  {
    number: 2,
    slug: "2",
    title: "The Money Market",
    shortTitle: "Ch2 · Money Market",
    topics: [
      "Money-market instruments",
      "Day-count conventions",
      "Discount instruments and yields",
    ],
    status: "ready",
  },
  {
    number: 3,
    slug: "3",
    title: "Forward-Forwards and FRAs",
    shortTitle: "Ch3 · FRAs",
    topics: [
      "Forward-forward rates",
      "Forward rate agreements",
      "Settlement and hedging uses",
    ],
    status: "ready",
  },
  {
    number: 4,
    slug: "4",
    title: "Interest Rate Futures",
    shortTitle: "Ch4 · IR Futures",
    topics: [
      "Short-term interest rate futures",
      "Pricing and basis",
      "Hedge ratios",
    ],
    status: "ready",
  },
  {
    number: 8,
    slug: "8",
    title: "Interest Rate and Currency Swaps",
    shortTitle: "Ch8 · Swaps",
    topics: [
      "Interest rate swaps",
      "Currency swaps",
      "Valuation and comparative advantage",
    ],
    status: "placeholder",
  },
  {
    number: 9,
    slug: "9",
    title: "Options",
    shortTitle: "Ch9 · Options",
    topics: [
      "Option payoffs and terminology",
      "Pricing foundations",
      "Interest rate and FX options overview",
    ],
    status: "placeholder",
  },
];

export function getChapter(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function chapterHref(slug: string): string {
  return `/chapters/${slug}`;
}

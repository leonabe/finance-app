import { describe, it, expect } from "vitest";
import { GRAPHS_COMING_SOON_MESSAGE } from "./graphs-copy";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Graphs coming-soon copy", () => {
  it("exports the required phrase used by the /graphs page", () => {
    expect(GRAPHS_COMING_SOON_MESSAGE).toBe(
      "Advanced visualizations and charts coming soon"
    );
  });

  it("is wired into the shipped graphs page source", () => {
    const pageSrc = readFileSync(
      join(process.cwd(), "src/app/graphs/page.tsx"),
      "utf8"
    );
    expect(pageSrc).toContain("GRAPHS_COMING_SOON_MESSAGE");
    expect(pageSrc).toContain("@/lib/graphs-copy");
  });

  it("home page advertises Graphs & Visualizations Coming soon and links /graphs", () => {
    const homeSrc = readFileSync(join(process.cwd(), "src/app/page.tsx"), "utf8");
    expect(homeSrc).toContain("Graphs &amp; Visualizations");
    expect(homeSrc).toContain("Coming soon");
    expect(homeSrc).toContain('href="/graphs"');
  });
});

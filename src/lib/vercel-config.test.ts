import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

describe("Vercel deploy config for Next.js App Router", () => {
  const root = process.cwd();

  it("vercel.json targets nextjs without SPA rewrites or static outputDirectory", () => {
    const path = join(root, "vercel.json");
    expect(existsSync(path)).toBe(true);
    const config = JSON.parse(readFileSync(path, "utf8")) as {
      framework?: string;
      rewrites?: Array<{ source: string; destination: string }>;
      buildCommand?: string;
      outputDirectory?: string;
      routes?: unknown[];
    };

    expect(config.framework).toBe("nextjs");
    expect(config.buildCommand).toMatch(/build/);
    // Static export / wrong output dir are common all-route 404 causes on Vercel
    expect(config.outputDirectory).toBeUndefined();

    const rewrites = config.rewrites ?? [];
    expect(rewrites.length).toBe(0);
    for (const r of rewrites) {
      expect(r.destination).not.toMatch(/index\.html/);
      expect(r.source).not.toBe("/(.*)");
    }
  });

  it("package.json build/start use standard Next production commands", () => {
    const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
      engines?: { node?: string };
    };
    expect(pkg.scripts.build).toMatch(/^next build\b/);
    expect(pkg.scripts.start).toMatch(/^next start\b/);
    expect(pkg.engines?.node).toMatch(/18|20|22/);
  });

  it("next.config does not enable static export", () => {
    const cfg = readFileSync(join(root, "next.config.ts"), "utf8");
    // Only flag real config assignments, not comments
    const withoutComments = cfg
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*$/gm, "");
    expect(withoutComments).not.toMatch(/output\s*:\s*['"]export['"]/);
    expect(withoutComments).not.toMatch(/distDir\s*:/);
  });

  it("App Router root and key routes exist", () => {
    const mustExist = [
      "src/app/page.tsx",
      "src/app/layout.tsx",
      "src/app/graphs/page.tsx",
      "src/app/chapters/[slug]/page.tsx",
      "src/middleware.ts",
    ];
    for (const rel of mustExist) {
      expect(existsSync(join(root, rel))).toBe(true);
    }
    const page = readFileSync(join(root, "src/app/page.tsx"), "utf8");
    expect(page).toMatch(/Mastering Financial Calculations|CHAPTERS/);
  });
});

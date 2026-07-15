import { describe, it, expect } from "vitest";
import { RECHARTS_READY, ResponsiveContainer } from "./recharts-ready";

describe("recharts package resolves from app code", () => {
  it("exports ready flag and ResponsiveContainer from recharts", () => {
    expect(RECHARTS_READY).toBe(true);
    // recharts may export components as function or object (forwardRef)
    expect(ResponsiveContainer).toBeTruthy();
    expect(["function", "object"]).toContain(typeof ResponsiveContainer);
  });
});

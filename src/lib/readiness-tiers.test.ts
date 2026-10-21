import { describe, expect, it } from "vitest";
import { countValidInWindow, readinessTier } from "./readiness-tiers";

describe("readiness tiers", () => {
  it("0–4 valid completions is Assessment Starter", () => {
    expect(readinessTier(4).current.name).toBe("Assessment Starter");
  });
  it("5 is Bronze, 10 Silver, 25 Gold, 50 Platinum, 100 Regional", () => {
    expect(readinessTier(5).current.badge).toBe("Bronze");
    expect(readinessTier(10).current.badge).toBe("Silver");
    expect(readinessTier(25).current.badge).toBe("Gold");
    expect(readinessTier(50).current.badge).toBe("Platinum");
    expect(readinessTier(100).current.badge).toBe("Regional");
  });
  it("only valid completions within 90 days count", () => {
    const now = new Date("2026-10-21T00:00:00Z");
    const rows = [
      { status: "valid", completed_at: "2026-10-01T00:00:00Z" },
      { status: "submitted", completed_at: "2026-10-01T00:00:00Z" },
      { status: "duplicate", completed_at: "2026-10-01T00:00:00Z" },
      { status: "valid", completed_at: "2026-07-01T00:00:00Z" },
    ];
    expect(countValidInWindow(rows, now)).toBe(1);
  });
});

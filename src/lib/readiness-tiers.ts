// Assessment-impact tiers (proposed pilot settings), computed from valid unique
// readiness completions in a rolling 90-day window — never an editable field.
export const TIER_WINDOW_DAYS = 90;

export const READINESS_TIERS = [
  { min: 0, name: "Assessment Starter", badge: "Base", perk: "Starter dashboard, training and resources" },
  { min: 5, name: "Community Contributor", badge: "Bronze", perk: "Bronze badge; certificate eligibility if approved" },
  { min: 10, name: "Assessment Ambassador", badge: "Silver", perk: "Silver badge; advanced training and campaign opportunities" },
  { min: 25, name: "Readiness Champion", badge: "Gold", perk: "Gold badge; consideration for approved campaigns" },
  { min: 50, name: "City Catalyst", badge: "Platinum", perk: "Platinum badge; eligible to apply for city coordination roles" },
  { min: 100, name: "Regional Catalyst", badge: "Regional", perk: "Recognition and consideration for regional opportunities — never automatic appointment" },
] as const;

export function readinessTier(validCompletions: number) {
  let idx = 0;
  READINESS_TIERS.forEach((t, i) => {
    if (validCompletions >= t.min) idx = i;
  });
  const current = READINESS_TIERS[idx]!;
  const next = READINESS_TIERS[idx + 1] ?? null;
  return { current, next };
}

/** Counts only valid completions inside the rolling window. */
export function countValidInWindow(
  rows: { status: string; completed_at: string }[],
  now = new Date(),
) {
  const cutoff = now.getTime() - TIER_WINDOW_DAYS * 86_400_000;
  return rows.filter(
    (r) => r.status === "valid" && new Date(r.completed_at).getTime() >= cutoff,
  ).length;
}

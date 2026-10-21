import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

// ---------- Points rules (v2.2 framework) ----------

export const POINT_VALUES = {
  referral_activated: 20,
  assessment_completion: 10,
  event_support: 20,
  event_led_small: 60,
  event_led_large: 100,
  outreach_log: 1,
  training_complete: 5,
  paid_conversion: 5,
} as const;

export const MONTHLY_CAP = 400;

export const ACTIVITY_LABELS: Record<string, string> = {
  referral_activated: "Referred volunteer activated (Network recognition)",
  assessment_completion: "Valid unique readiness assessment completion (Track A)",
  event_support: "Event support assignment (Track B)",
  event_led_small: "Led an approved event session (Track B)",
  event_led_large: "Led a major event / closeout verified (Track B)",
  outreach_log: "Daily outreach log verified (Track A)",
  training_complete: "Onboarding & ethics training completed",
  paid_conversion: "Verified paid assessment conversion (Track A)",
  adjustment: "Adjustment by the programme team",
};

// Reward milestones — published only when confirmed on the promises ledger.
export const REWARD_MILESTONES = [
  { points: 50, reward: "Digital badge", funding: "No cost" },
  { points: 150, reward: "Workshop entry", funding: "Acxelerate programme seats" },
  { points: 300, reward: "Priority consideration plus a learning session", funding: "Acxelerate" },
  { points: 500, reward: "Annual event ticket", funding: "Sponsor-funded seats only" },
  { points: 750, reward: "Leadership review", funding: "No cost" },
];

async function isStaff(context: Ctx) {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const list = (roles ?? []).map((r: { role: string }) => r.role);
  return list.some((r: string) => ["admin", "organizer", "reviewer"].includes(r));
}

async function pointsThisMonth(supabase: any, userId: string) {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const { data } = await supabase
    .from("points_ledger")
    .select("points")
    .eq("user_id", userId)
    .in("status", ["pending", "approved"])
    .gte("created_at", start.toISOString());
  return (data ?? []).reduce((s: number, r: any) => s + (r.points || 0), 0);
}

// Award points with the monthly cap. Called from other server modules
// (e.g. shift verification) — not an RPC endpoint itself.
export async function awardPoints(
  supabase: any,
  opts: {
    userId: string;
    activity: keyof typeof POINT_VALUES;
    status?: "pending" | "approved";
    evidence?: string;
    reviewerId?: string;
  },
) {
  const used = await pointsThisMonth(supabase, opts.userId);
  const value = POINT_VALUES[opts.activity];
  if (used >= MONTHLY_CAP) return { awarded: 0, capped: true };
  const points = Math.min(value, MONTHLY_CAP - used);
  const { error } = await supabase.from("points_ledger").insert({
    user_id: opts.userId,
    activity: opts.activity,
    points,
    status: opts.status ?? "pending",
    evidence: opts.evidence ?? null,
    reviewer_id: opts.reviewerId ?? null,
    reviewed_at: opts.status === "approved" ? new Date().toISOString() : null,
  });
  if (error) return { awarded: 0, capped: false };
  return { awarded: points, capped: points < value };
}

// ---------- Volunteer: my points ----------

export const getMyPoints = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: entries } = await supabase
      .from("points_ledger")
      .select("id, activity, points, status, reason, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    const list = entries ?? [];
    const approved = list.filter((e: any) => e.status === "approved");
    const lifetime = approved.reduce((s: number, e: any) => s + e.points, 0);
    const pending = list
      .filter((e: any) => e.status === "pending")
      .reduce((s: number, e: any) => s + e.points, 0);
    const nextReward =
      REWARD_MILESTONES.find((m) => m.points > lifetime) ?? null;
    return {
      entries: list.map((e: any) => ({
        ...e,
        label: ACTIVITY_LABELS[e.activity] ?? e.activity,
      })),
      lifetime,
      pending,
      monthlyCap: MONTHLY_CAP,
      usedThisMonth: await pointsThisMonth(supabase, userId),
      nextReward,
      rewards: REWARD_MILESTONES,
    };
  });

// ---------- Staff: points review queue ----------

export const getPointsReviewQueue = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!(await isStaff(context))) throw new Error("You don't have permission to do that.");
    const { supabase } = context;
    const { data: entries } = await supabase
      .from("points_ledger")
      .select("id, user_id, activity, points, status, evidence, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    const ids = [...new Set((entries ?? []).map((e: any) => e.user_id))];
    const { data: profiles } = ids.length
      ? await supabase.from("profiles").select("id, full_name, city").in("id", ids)
      : { data: [] };
    const nameMap = Object.fromEntries(
      (profiles ?? []).map((p: any) => [p.id, p.full_name ?? "Volunteer"]),
    );
    return {
      entries: (entries ?? []).map((e: any) => ({
        ...e,
        label: ACTIVITY_LABELS[e.activity] ?? e.activity,
        volunteerName: nameMap[e.user_id] ?? "Volunteer",
      })),
    };
  });

const reviewPointsSchema = z.object({
  id: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  reason: z.string().trim().max(500).optional().or(z.literal("")),
});

export const reviewPoints = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => reviewPointsSchema.parse(data))
  .handler(async ({ context, data }) => {
    if (!(await isStaff(context))) throw new Error("You don't have permission to do that.");
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("points_ledger")
      .update({
        status: data.decision,
        reason: data.reason || null,
        reviewer_id: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id)
      .eq("status", "pending");
    if (error) throw new Error("Couldn't save the decision. Please try again.");
    return { ok: true as const };
  });

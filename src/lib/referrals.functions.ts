import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { awardPoints } from "@/lib/points.functions";
import { countValidInWindow, readinessTier } from "@/lib/readiness-tiers";

type Ctx = { supabase: any; userId: string };

async function isStaff(context: Ctx) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  return (data ?? []).some((r: { role: string }) =>
    ["admin", "reviewer"].includes(r.role),
  );
}

export const getMyReferrals = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: code, error } = await context.supabase.rpc(
      "ensure_my_referral_code",
    );
    if (error) throw new Error("Could not load your referral code.");
    const { data: rows } = await context.supabase
      .from("readiness_completions")
      .select("id,status,paid_verified,completed_at")
      .eq("volunteer_id", context.userId)
      .order("completed_at", { ascending: false });
    const list = (rows ?? []) as {
      id: string;
      status: string;
      paid_verified: boolean;
      completed_at: string;
    }[];
    const valid90 = countValidInWindow(list);
    const funnel = {
      submitted: list.length,
      valid: list.filter((r) => r.status === "valid").length,
      pending: list.filter((r) =>
        ["submitted", "pending_attribution"].includes(r.status),
      ).length,
      invalid: list.filter((r) => ["duplicate", "invalid"].includes(r.status))
        .length,
      paid: list.filter((r) => r.paid_verified).length,
    };
    const networkSummary = {
      pendingReview: 1,
      onboarded: 1,
      qualifyingVerified: 1,
      networkPointsEarned: 3,
    };

    return {
      code: code as string,
      funnel,
      networkSummary,
      valid90,
      tier: readinessTier(valid90),
      recent: list.slice(0, 10),
      isStaff: await isStaff(context),
    };
  });

export const recordCompletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        externalId: z.string().trim().min(3).max(120),
        referralCode: z.string().trim().max(40).optional(),
        status: z.enum(["submitted", "valid", "duplicate", "invalid"]),
        note: z.string().trim().max(500).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    if (!(await isStaff(context)))
      throw new Error("Only the programme team can record completions.");
    let volunteerId: string | null = null;
    const code = data.referralCode?.toUpperCase();
    if (code) {
      const { data: rc } = await context.supabase
        .from("referral_codes")
        .select("user_id")
        .eq("code", code)
        .maybeSingle();
      if (!rc) throw new Error("No volunteer has that referral code.");
      volunteerId = rc.user_id;
      if (volunteerId === context.userId)
        throw new Error("You can't record a completion for yourself.");
    }
    const status = volunteerId ? data.status : "pending_attribution";
    const { error } = await context.supabase.from("readiness_completions").insert({
      external_id: data.externalId,
      volunteer_id: volunteerId,
      referral_code: code ?? null,
      status,
      note: data.note ?? null,
      recorded_by: context.userId,
    });
    if (error) {
      if (error.code === "23505")
        throw new Error("That form submission ID is already recorded — counted once only.");
      throw new Error("Could not record the completion.");
    }
    let points = 0;
    if (volunteerId && status === "valid") {
      const r = await awardPoints(context.supabase, {
        userId: volunteerId,
        activity: "assessment_completion",
        status: "approved",
        reviewerId: context.userId,
        evidence: `Readiness submission ${data.externalId}`,
      });
      points = r.awarded;
    }
    return { ok: true, status, points };
  });

export const logOutreachActivity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        activityDate: z.string().min(4),
        channel: z.enum([
          "1_on_1_briefing",
          "campus_club_discussion",
          "founder_meetup",
          "industry_msme_network",
          "online_community",
          "social_direct_message",
        ]),
        approxReached: z.number().int().min(1).max(500),
        notes: z.string().trim().min(3).max(500),
        truthfulAttestation: z.literal(true),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("points_ledger").insert({
      user_id: userId,
      activity: "outreach_log",
      points: 1,
      status: "pending",
      evidence: `Date: ${data.activityDate} · Channel: ${data.channel.replace(/_/g, " ")} · Reached: ~${data.approxReached} · Note: ${data.notes}`,
    });
    if (error) {
      console.error("Outreach log insert failed:", error);
      throw new Error("Could not record your outreach log. Please try again.");
    }
    return { ok: true as const };
  });

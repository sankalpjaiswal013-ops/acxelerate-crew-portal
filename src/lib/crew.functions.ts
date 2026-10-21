import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { awardPoints } from "@/lib/points.functions";

type Ctx = { supabase: any; userId: string };

const STAFF = ["admin", "organizer", "reviewer"];

async function isStaff(context: Ctx) {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const list = (roles ?? []).map((r: { role: string }) => r.role);
  return list.some((r: string) => STAFF.includes(r));
}

async function requireStaff(context: Ctx) {
  if (!(await isStaff(context))) {
    throw new Error("You don't have permission to do that.");
  }
}

// ---------- Tier + milestone logic (from the programme guide) ----------

export const MILESTONES = [
  { hours: 0, label: "First verified shift", reward: "Crew tier, Passport, a buddy, the free readiness snapshot" },
  { hours: 5, label: "5 hours", reward: "Participation certificate and first skill confirmed at level E2" },
  { hours: 10, label: "10 hours", reward: "A choice of preferred role types" },
  { hours: 20, label: "20 hours", reward: "Recorded founder talks and group webinars" },
  { hours: 30, label: "30 hours + Lead criteria", reward: "Lead tier, free full assessment, recommendation letter" },
  { hours: 50, label: "50 hours", reward: "Coaching from the coordinator; co-signed certificate where a university agrees" },
  { hours: 75, label: "75 hours", reward: "Eligibility to apply for Fellow" },
];

export function computeTier(stats: {
  hours: number;
  events: number;
  roleTypes: number;
  ledCrew: boolean;
}) {
  if (
    stats.hours >= 30 &&
    stats.events >= 3 &&
    stats.roleTypes >= 2 &&
    stats.ledCrew
  )
    return "Lead";
  if (stats.events >= 1) return "Crew";
  return "Applicant";
}

async function getVerifiedStats(supabase: any, volunteerId: string) {
  const { data: rows } = await supabase
    .from("shift_signups")
    .select("event_id, role_type, hours, rating, led_crew_size, status")
    .eq("volunteer_id", volunteerId)
    .eq("status", "completed");
  const list = rows ?? [];
  return {
    hours: list.reduce((s: number, r: any) => s + (Number(r.hours) || 0), 0),
    events: new Set(list.map((r: any) => r.event_id)).size,
    roleTypes: new Set(list.map((r: any) => r.role_type)).size,
    ledCrew: list.some(
      (r: any) => (r.led_crew_size ?? 0) >= 4 && (r.rating ?? 0) >= 3,
    ),
    shifts: list.length,
  };
}

// ---------- Volunteer: shift board ----------

export const listShifts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: events, error } = await supabase
      .from("events")
      .select("*")
      .neq("status", "cancelled")
      .order("starts_at", { ascending: true });
    if (error) throw new Error("Couldn't load the shift board.");
    const { data: mine } = await supabase
      .from("shift_signups")
      .select("event_id, status")
      .eq("volunteer_id", userId);
    const myMap = Object.fromEntries(
      (mine ?? []).map((s: any) => [s.event_id, s.status]),
    );
    return {
      events: (events ?? []).map((e: any) => ({
        ...e,
        myStatus: myMap[e.id] ?? null,
      })),
    };
  });

export const signupForShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z
      .object({ eventId: z.string().uuid(), roleType: z.string().trim().min(2).max(60) })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("shift_signups").insert({
      event_id: data.eventId,
      volunteer_id: userId,
      role_type: data.roleType,
      status: "signed_up",
    });
    if (error) {
      if (error.code === "23505") throw new Error("You've already signed up for this shift.");
      throw new Error("Couldn't sign you up. Please try again.");
    }
    return { ok: true as const };
  });

export const cancelShiftSignup = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ eventId: z.string().uuid() }).parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("shift_signups")
      .update({ status: "cancelled" })
      .eq("event_id", data.eventId)
      .eq("volunteer_id", userId)
      .eq("status", "signed_up");
    if (error) throw new Error("Couldn't cancel the signup.");
    return { ok: true as const };
  });

// ---------- Volunteer: passport ----------

export const getMyPassport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: badges }, { data: endorsements }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase
          .from("badges")
          .select("code, label, awarded_at")
          .eq("volunteer_id", userId)
          .order("awarded_at", { ascending: false }),
        supabase
          .from("endorsements")
          .select("author_name, author_role, body, evidence_level, created_at")
          .eq("volunteer_id", userId)
          .order("created_at", { ascending: false }),
      ]);
    const stats = await getVerifiedStats(supabase, userId);
    const tier = computeTier(stats);
    const nextMilestone = MILESTONES.find((m) => m.hours > stats.hours) ?? null;
    return {
      profile: profile ?? null,
      stats,
      tier,
      nextMilestone,
      milestones: MILESTONES,
      badges: badges ?? [],
      endorsements: endorsements ?? [],
    };
  });

// ---------- Staff: events + verification ----------

const eventSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  city: z.string().trim().min(2).max(100),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  startsAt: z.string().min(4),
  endsAt: z.string().optional().or(z.literal("")),
  capacity: z.number().int().positive().max(10000).optional(),
});

export const createEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => eventSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireStaff(context);
    const { error } = await context.supabase.from("events").insert({
      title: data.title,
      description: data.description || null,
      city: data.city,
      location: data.location || null,
      starts_at: new Date(data.startsAt).toISOString(),
      ends_at: data.endsAt ? new Date(data.endsAt).toISOString() : null,
      capacity: data.capacity ?? null,
      created_by: context.userId,
    });
    if (error) throw new Error("Couldn't create the event.");
    return { ok: true as const };
  });

const proposeSchema = z.object({
  title: z.string().trim().min(3).max(150),
  topicFamily: z.enum(["T1", "T2", "T3", "T4", "T5"]),
  subtopic: z.string().trim().max(200),
  objective: z.string().trim().min(5).max(500),
  audience: z.string().trim().max(200),
  format: z.enum(["on-site", "online", "hybrid"]),
  city: z.string().trim().min(2).max(100),
  location: z.string().trim().max(200).optional().or(z.literal("")),
  startsAt: z.string().min(4),
  endsAt: z.string().optional().or(z.literal("")),
  capacity: z.number().int().positive().max(10000).optional(),
  budgetNeeded: z.boolean().default(false),
});

export const proposeVolunteerEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => proposeSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const desc = `[${data.topicFamily}: ${data.subtopic}] ${data.objective} | Audience: ${data.audience} | Format: ${data.format}${data.budgetNeeded ? " | [Budget Requested]" : ""}`;
    const { error } = await supabase.from("events").insert({
      title: data.title,
      description: desc,
      city: data.city,
      location: data.location || (data.format === "online" ? "Online Session" : null),
      starts_at: new Date(data.startsAt).toISOString(),
      ends_at: data.endsAt ? new Date(data.endsAt).toISOString() : null,
      capacity: data.capacity ?? 30,
      created_by: userId,
      status: "proposed",
    });
    if (error) {
      console.error("Propose event failed:", error);
      throw new Error("Could not submit your event proposal. Please try again.");
    }
    return { ok: true as const };
  });

const budgetSchema = z.object({
  eventId: z.string().uuid(),
  amountInr: z.number().int().positive().max(100000),
  breakdown: z.string().trim().min(5).max(1000),
  vendorQuotes: z.string().trim().max(500).optional(),
  declarationAccepted: z.literal(true),
});

export const requestEventBudget = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => budgetSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("points_ledger").insert({
      user_id: userId,
      activity: "adjustment",
      points: 0,
      status: "pending",
      reason: `Budget Request for Event ${data.eventId}: ₹${data.amountInr}. Breakdown: ${data.breakdown}. Awaiting Finance review.`,
    });
    if (error) {
      console.error("Budget request failed:", error);
      throw new Error("Could not record budget request.");
    }
    return { ok: true as const };
  });

const closeoutSchema = z.object({
  eventId: z.string().uuid(),
  attendanceCount: z.number().int().min(1).max(5000),
  outcomesReport: z.string().trim().min(10).max(1500),
  evidenceLinks: z.string().trim().max(500).optional(),
});

export const submitEventCloseout = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => closeoutSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("points_ledger").insert({
      user_id: userId,
      activity: "adjustment",
      points: 3,
      status: "pending",
      reason: `Closeout Report for Event ${data.eventId}: Attendance: ${data.attendanceCount}. Outcomes: ${data.outcomesReport}. Evidence: ${data.evidenceLinks || "N/A"}`,
    });
    if (error) {
      console.error("Closeout submit failed:", error);
      throw new Error("Could not submit closeout report.");
    }
    return { ok: true as const };
  });

export const listEventSignups = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireStaff(context);
    const { supabase } = context;
    const { data: events } = await supabase
      .from("events")
      .select("id, title, city, starts_at, status")
      .order("starts_at", { ascending: false });
    const { data: signups } = await supabase
      .from("shift_signups")
      .select("id, event_id, volunteer_id, role_type, status, hours, rating, led_crew_size, created_at")
      .neq("status", "cancelled")
      .order("created_at", { ascending: false });
    const volunteerIds = [...new Set((signups ?? []).map((s: any) => s.volunteer_id))];
    const { data: profiles } = volunteerIds.length
      ? await supabase.from("profiles").select("id, full_name, city").in("id", volunteerIds)
      : { data: [] };
    const nameMap = Object.fromEntries(
      (profiles ?? []).map((p: any) => [p.id, p.full_name ?? "Volunteer"]),
    );
    return {
      events: events ?? [],
      signups: (signups ?? []).map((s: any) => ({
        ...s,
        volunteerName: nameMap[s.volunteer_id] ?? "Volunteer",
      })),
    };
  });

const verifySchema = z.object({
  signupId: z.string().uuid(),
  hours: z.number().positive().max(10, "No more than 10 hours a day count"),
  rating: z.number().int().min(1).max(4),
  ledCrewSize: z.number().int().min(0).max(500).optional(),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const verifyShift = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => verifySchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireStaff(context);
    const { supabase, userId } = context;
    const { data: signup, error: findError } = await supabase
      .from("shift_signups")
      .select("id, volunteer_id, status")
      .eq("id", data.signupId)
      .single();
    if (findError || !signup) throw new Error("Signup not found.");
    const { error } = await supabase
      .from("shift_signups")
      .update({
        status: "completed",
        hours: data.hours,
        rating: data.rating,
        led_crew_size: data.ledCrewSize ?? null,
        reviewer_note: data.note || null,
        verified_by: userId,
        verified_at: new Date().toISOString(),
      })
      .eq("id", data.signupId);
    if (error) throw new Error("Couldn't verify the shift.");

    // Award the Crew badge on the first verified shift.
    const stats = await getVerifiedStats(supabase, signup.volunteer_id);
    if (stats.events >= 1) {
      await supabase.from("badges").upsert(
        { volunteer_id: signup.volunteer_id, code: "crew", label: "Crew — first verified shift" },
        { onConflict: "volunteer_id,code" },
      );
    }
    if (computeTier(stats) === "Lead") {
      await supabase.from("badges").upsert(
        { volunteer_id: signup.volunteer_id, code: "lead", label: "Lead — 30 verified hours" },
        { onConflict: "volunteer_id,code" },
      );
    }

    // Award framework points: leading a crew of 4+ counts as leading a small
    // event (60), otherwise event support (20). Staff-verified, so approved
    // immediately; the monthly cap is enforced inside awardPoints.
    await awardPoints(supabase, {
      userId: signup.volunteer_id,
      activity: (data.ledCrewSize ?? 0) >= 4 ? "event_led_small" : "event_support",
      status: "approved",
      evidence: `Verified shift ${signup.id}`,
      reviewerId: userId,
    });
    return { ok: true as const };
  });

export const getMyCrewSummary = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const stats = await getVerifiedStats(context.supabase, context.userId);
    return {
      stats,
      tier: computeTier(stats),
      nextMilestone: MILESTONES.find((m) => m.hours > stats.hours) ?? null,
    };
  });

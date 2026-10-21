import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyDashboard = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [{ data: profile }, { data: roles }, { data: user }] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
        supabase.auth.getUser(),
      ]);

    const email = (user as { user: { email?: string } | null }).user?.email ?? "";
    const { data: application } = email
      ? await supabase
          .from("ambassador_applications")
          .select("reference_id, status, reviewer_note, created_at")
          .or(`user_id.eq.${userId},email.eq.${email}`)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : { data: null };

    return {
      profile: profile ?? null,
      roles: (roles ?? []).map((r) => r.role),
      email,
      application: application ?? null,
    };
  });

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  skills: z.string().trim().max(500).optional().or(z.literal("")),
  interests: z.string().trim().max(500).optional().or(z.literal("")),
  availability: z.string().trim().max(200).optional().or(z.literal("")),
  preferredFormat: z
    .enum(["remote", "on-site", "hybrid", "flexible"])
    .optional(),
  languages: z.string().trim().max(200).optional().or(z.literal("")),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => profileSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      full_name: data.fullName,
      city: data.city,
      phone: data.phone || null,
      skills: data.skills || null,
      interests: data.interests || null,
      availability: data.availability || null,
      preferred_format: data.preferredFormat ?? null,
      languages: data.languages || null,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });
    if (error) {
      console.error("Profile update failed:", error.message);
      throw new Error("We couldn't save your profile. Please try again.");
    }
    return { ok: true as const };
  });

// ---------- Onboarding journey (v2.2 framework) ----------

export const completeOrientation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ orientation_completed_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) throw new Error("Couldn't save. Please try again.");
    return { ok: true as const };
  });

export const acceptVolunteerAgreement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) =>
    z.object({ accepted: z.literal(true) }).parse(data),
  )
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ agreement_accepted_at: new Date().toISOString() })
      .eq("id", userId);
    if (error) throw new Error("Couldn't save. Please try again.");
    return { ok: true as const };
  });

async function requireReviewer(context: {
  supabase: any;
  userId: string;
}) {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const list = (roles ?? []).map((r: { role: string }) => r.role);
  if (!list.includes("reviewer") && !list.includes("admin")) {
    throw new Error("You don't have permission to review applications.");
  }
}

export const getApplicationsForReview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireReviewer(context);
    const { data, error } = await context.supabase
      .from("ambassador_applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error("Couldn't load applications.");
    return { applications: data ?? [] };
  });

const reviewSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["under_review", "needs_information", "approved", "rejected"]),
  note: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const reviewApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => reviewSchema.parse(data))
  .handler(async ({ context, data }) => {
    await requireReviewer(context);
    const { error } = await context.supabase
      .from("ambassador_applications")
      .update({
        status: data.status,
        reviewer_note: data.note || null,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) {
      console.error("Review update failed:", error.message);
      throw new Error("Couldn't save the decision. Please try again.");
    }
    return { ok: true as const };
  });

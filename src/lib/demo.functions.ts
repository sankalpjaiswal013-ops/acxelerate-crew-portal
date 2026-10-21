import { createServerFn } from "@tanstack/react-start";

const DEMO_EMAIL = "demo.volunteer@acxelerate.in";
const DEMO_PASSWORD = "CrewDemo2026!";

/**
 * Public demo entry point: ensures a demo volunteer account exists with
 * sample Crew data (verified hours, badges, endorsements, an upcoming
 * shift), then returns the demo credentials so the browser can sign in
 * with the normal password flow. Demo-only, safe to call repeatedly.
 */
export const demoVolunteerLogin = createServerFn({ method: "POST" }).handler(
  async () => {
    // If running locally without service role key, return pre-seeded credentials directly
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    // 1. Get or create the demo auth user.
    let userId: string | null = null;
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    const existing = (list?.users ?? []).find(
      (u: { email?: string }) => u.email === DEMO_EMAIL,
    );
    if (existing) {
      userId = existing.id;
      // Keep the password known in case it was changed.
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: DEMO_PASSWORD,
        email_confirm: true,
      });
    } else {
      const { data: created, error } =
        await supabaseAdmin.auth.admin.createUser({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: "Demo Volunteer" },
        });
      if (error || !created.user) {
        throw new Error("Couldn't prepare the demo account. Please try again.");
      }
      userId = created.user.id;
    }

    // 2. Upsert the demo profile.
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      full_name: "Demo Volunteer",
      city: "Bengaluru",
      phone: "+91 90000 00000",
      skills: "Hosting, registration desk, social media",
      interests: "Startup ecosystems, student outreach, events",
      availability: "Weekends",
      preferred_format: "on-site",
      languages: "English, Hindi, Kannada",
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    // 3. Seed sample Crew data once (skip if shifts already exist).
    const { data: existingShifts } = await supabaseAdmin
      .from("shift_signups")
      .select("id")
      .eq("volunteer_id", userId)
      .limit(1);

    if (!existingShifts || existingShifts.length === 0) {
      const now = Date.now();
      const day = 24 * 60 * 60 * 1000;
      const { data: events, error: evErr } = await supabaseAdmin
        .from("events")
        .insert([
          {
            title: "Startup Showcase Bengaluru",
            description:
              "Flagship demo day — founders pitch to mentors and investors.",
            city: "Bengaluru",
            location: "Innovation Hub, Koramangala",
            starts_at: new Date(now - 21 * day).toISOString(),
            ends_at: new Date(now - 21 * day + 6 * 3600e3).toISOString(),
            capacity: 30,
            status: "completed",
          },
          {
            title: "Campus Outreach Drive",
            description:
              "Meet student clubs and introduce the Crew programme on campus.",
            city: "Bengaluru",
            location: "Christ University, Hosur Road",
            starts_at: new Date(now - 7 * day).toISOString(),
            ends_at: new Date(now - 7 * day + 5 * 3600e3).toISOString(),
            capacity: 20,
            status: "completed",
          },
          {
            title: "MSME Growth Workshop",
            description:
              "Half-day workshop helping local businesses with digital growth.",
            city: "Bengaluru",
            location: "To be announced",
            starts_at: new Date(now + 10 * day).toISOString(),
            ends_at: new Date(now + 10 * day + 4 * 3600e3).toISOString(),
            capacity: 25,
            status: "upcoming",
          },
        ])
        .select("id, title");
      if (evErr || !events || events.length < 3) {
        throw new Error("Couldn't prepare the demo data. Please try again.");
      }
      const showcase = events[0]!;
      const outreach = events[1]!;
      const workshop = events[2]!;

      await supabaseAdmin.from("shift_signups").insert([
        {
          event_id: showcase.id,
          volunteer_id: userId,
          role_type: "registration",
          status: "completed",
          hours: 6,
          rating: 4,
          reviewer_note: "Ran the check-in desk smoothly for 200+ guests.",
          verified_at: new Date(now - 20 * day).toISOString(),
        },
        {
          event_id: outreach.id,
          volunteer_id: userId,
          role_type: "outreach",
          status: "completed",
          hours: 12,
          rating: 3,
          reviewer_note: "Great energy with student clubs across two days.",
          verified_at: new Date(now - 6 * day).toISOString(),
        },
        {
          event_id: workshop.id,
          volunteer_id: userId,
          role_type: "hosting",
          status: "signed_up",
        },
      ]);

      await supabaseAdmin.from("badges").insert([
        {
          volunteer_id: userId,
          code: "first_shift",
          label: "First verified shift",
        },
        { volunteer_id: userId, code: "crew", label: "Crew tier unlocked" },
      ]);

      await supabaseAdmin.from("endorsements").insert([
        {
          volunteer_id: userId,
          author_name: "Priya Nair",
          author_role: "City Coordinator, Bengaluru",
          body: "Reliable, punctual, and great with guests — exactly the Crew standard.",
          evidence_level: "E2",
        },
        {
          volunteer_id: userId,
          author_name: "Rahul Menon",
          author_role: "Event Lead, Startup Showcase",
          body: "Handled a busy registration desk without a single queue issue.",
          evidence_level: "E2",
        },
      ]);
    }

    return { email: DEMO_EMAIL, password: DEMO_PASSWORD };
  },
);

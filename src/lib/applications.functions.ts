import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

const applicationSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d][\d\s()-]*$/, "Please enter a valid phone number"),
  city: z.string().trim().min(2, "Please enter your city").max(100),
  applicantType: z.enum([
    "student",
    "young-professional",
    "startup-founder",
    "msme-industry",
    "university-community",
    "other",
  ]),
  interest: z.enum([
    "campus-outreach",
    "startup-ecosystem",
    "msme-outreach",
    "events-workshops",
    "research-content",
    "networking-partnerships",
    "city-leadership",
  ]),
  timeCommitment: z
    .enum(["2-3-hours", "4-5-hours", "6-plus-hours", "flexible"])
    .optional(),
  linkedinUrl: z
    .string()
    .trim()
    .url("Please enter a valid URL")
    .max(300)
    .optional()
    .or(z.literal("")),
  motivation: z.string().trim().max(2000).optional(),
  privacyAcknowledged: z.literal(true, {
    message: "Please accept the privacy acknowledgement to submit",
  }),
  socialMediaConsent: z.boolean().optional(),
});

export type ApplicationInput = z.input<typeof applicationSchema>;

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((data) => applicationSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
            h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const referenceId = `ACX-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    const { error } = await supabase.from("ambassador_applications").insert({
      reference_id: referenceId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      applicant_type: data.applicantType,
      interest: data.interest,
      time_commitment: data.timeCommitment ?? null,
      linkedin_url: data.linkedinUrl || null,
      motivation: data.motivation || null,
      privacy_acknowledged: data.privacyAcknowledged,
      social_media_consent: data.socialMediaConsent ?? false,
    });

    if (error) {
      console.error("Application insert failed:", error.message);
      throw new Error(
        "We couldn't save your application right now. Please try again in a moment.",
      );
    }

    return { ok: true as const, referenceId };
  });

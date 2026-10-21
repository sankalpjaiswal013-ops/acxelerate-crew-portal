import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

// Public read-only list of upcoming events for the /events page.
// Uses the publishable key with a narrow anon SELECT policy.
export const listPublicEvents = createServerFn({ method: "GET" }).handler(
  async () => {
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
    const { data, error } = await supabase
      .from("events")
      .select("id, title, description, city, location, starts_at, ends_at")
      .neq("status", "cancelled")
      .gte("starts_at", new Date(Date.now() - 24 * 3600 * 1000).toISOString())
      .order("starts_at", { ascending: true })
      .limit(12);
    if (error) return { events: [] };
    return { events: data ?? [] };
  },
);

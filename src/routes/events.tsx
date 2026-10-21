import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { listPublicEvents } from "@/lib/events.functions";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Upcoming Acxelerate India events open to volunteers. Booking opens in the volunteer app — apply to join and be the first to know.",
      },
      { property: "og:title", content: "Acxelerate Crew events" },
      {
        property: "og:description",
        content:
          "See upcoming events and book a volunteer role once you're approved.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Events,
});

const TOPIC_FAMILIES = [
  { code: "ALL", label: "All Topics" },
  { code: "T1", label: "T1: Readiness Gap Mapping" },
  { code: "T2", label: "T2: Country Fitment" },
  { code: "T3", label: "T3: Go-to-Market Strategy" },
  { code: "T4", label: "T4: Cross-Border & Regulation" },
  { code: "T5", label: "T5: Global Partnerships" },
];

function getTopicCode(title: string, desc?: string | null): string {
  const text = `${title} ${desc ?? ""}`.toLowerCase();
  if (text.includes("fitment") || text.includes("market selection") || text.includes("country")) return "T2";
  if (text.includes("gtm") || text.includes("go-to-market") || text.includes("expansion")) return "T3";
  if (text.includes("regulatory") || text.includes("cross-border") || text.includes("regulation") || text.includes("culture")) return "T4";
  if (text.includes("partnership") || text.includes("ecosystem") || text.includes("incubator")) return "T5";
  return "T1";
}

function Events() {
  const { data } = useQuery({
    queryKey: ["public-events"],
    queryFn: () => listPublicEvents(),
  });
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const allEvents = data?.events ?? [];

  const filtered = allEvents.filter((e) => {
    if (selectedTopic === "ALL") return true;
    return getTopicCode(e.title, e.description) === selectedTopic;
  });

  return (
    <div className="min-h-screen glass-shell">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">Track B — Events & Promotion</p>
          <h1 className="mt-2 text-4xl font-bold">Approved City & Campus Events</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Official Acxelerate events operate under five approved globalisation topic families.
            Volunteers book event roles like picking a seat — choose a role, get a confirmation, check in on the day,
            and earn verified service hours and Passport badges.
          </p>
        </div>

        {/* Topic Filters */}
        <div className="mt-8 flex flex-wrap gap-2">
          {TOPIC_FAMILIES.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedTopic(t.code)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                selectedTopic === t.code
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border glass-panel p-8 text-center">
            <p className="text-lg font-semibold">
              No events found for this topic family yet.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              New approved sessions are posted weekly across active city chapters.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setSelectedTopic("ALL")}>
                View all topics
              </Button>
              <Button asChild size="sm">
                <a href="/#apply">Apply to volunteer</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => {
              const topic = getTopicCode(e.title, e.description);
              return (
                <article
                  key={e.id}
                  className="rounded-2xl glass-panel p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {topic} · Approved Topic
                      </span>
                      <span className="text-xs text-muted-foreground">{e.city}</span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold">{e.title}</h2>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-primary shrink-0" />
                        {new Date(e.starts_at).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 text-primary shrink-0" />
                        {e.city}
                        {e.location ? ` — ${e.location}` : ""}
                      </p>
                    </div>
                    {e.description && (
                      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                        {e.description}
                      </p>
                    )}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-5 w-full">
                    <a href="/auth">Sign in to book a role</a>
                  </Button>
                </article>
              );
            })}
          </div>
        )}

        {/* Governance & Cap Disclosure */}
        <div className="mt-12 rounded-2xl border border-border glass-panel p-6 text-sm leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">City Targets & Democratic Event Guidelines</p>
          <p className="mt-1">
            Official Acxelerate-branded events are capped at <strong>10 events per city per calendar month</strong> to
            ensure high quality and safety. Volunteers never collect money at events. Any event involving ticketing or payments
            is managed by Acxelerate India core staff, with volunteers serving in support or lead coordination roles.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

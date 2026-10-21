import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { BadgeCheck, Award, Landmark, Users, BookOpenCheck, MapPinned } from "lucide-react";

export const Route = createFileRoute("/positions")({
  head: () => ({
    meta: [
      { title: "Positions and Growth | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Two ways to grow in Acxelerate Crew: recognition tiers earned through verified hours (Crew, Lead, Fellow) and responsibility positions reviewed by people (Community Ambassador, Readiness Ambassador, Campus or Community Lead).",
      },
      { property: "og:title", content: "Positions and growth in Acxelerate Crew" },
      {
        property: "og:description",
        content:
          "Tiers are earned through verified service; positions are reviewed by people. Nothing is for sale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Positions,
});

const tiers = [
  {
    icon: BadgeCheck,
    name: "Crew",
    how: "Complete your first verified shift",
    gets: "Your Passport, a badge, a buddy, the free readiness snapshot, and access to event roles.",
  },
  {
    icon: Award,
    name: "Lead",
    how: "30 verified hours, three events, two role types, and a crew of four or more led once with a good rating",
    gets: "The Lead title, a free full readiness assessment, small-group founder briefings, first access to new roles, and recommendation letters.",
  },
  {
    icon: Landmark,
    name: "Fellow",
    how: "Selective — 20 to 30 seats a year, by criteria and panel",
    gets: "Founder or mentor hours, partner interviews, the advisory council, and priority for delegations.",
  },
];

const positions = [
  {
    icon: Users,
    name: "Community Ambassador",
    level: "Level 1",
    does: "Invites people, welcomes new volunteers, supports local sessions.",
    entry: "Complete onboarding and the 30-day starter contribution.",
  },
  {
    icon: BookOpenCheck,
    name: "Readiness Ambassador",
    level: "Level 2",
    does: "Explains the Readiness Assessment accurately, helps people finish it, supports events.",
    entry: "30 active days, 5 verified completions of the free entry step, orientation done, conduct clean.",
  },
  {
    icon: MapPinned,
    name: "Campus or Community Lead",
    level: "Level 3",
    does: "Proposes approved events and coordinates 5 to 10 volunteers.",
    entry: "60 active days, 10 verified completions, 3 activated referrals, 1 event support, Lead training, Coordinator approval. First term: 3 months.",
  },
];

function Positions() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold">Positions and Growth</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            There are two ways to grow, and both are earned. Recognition tiers
            come from verified hours. Responsibility positions come from a
            review by a person. Nothing here is for sale.
          </p>
        </div>

        <section className="mt-12">
          <h2 className="text-2xl font-bold">Recognition tiers — earned by verified hours</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {tiers.map((t, i) => (
              <div
                key={t.name}
                className={`rounded-2xl border p-6 shadow-sm ${
                  i === 1
                    ? "border-primary bg-card ring-1 ring-primary"
                    : "border-border bg-card"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold">{t.name}</h3>
                  <t.icon className="size-6 text-primary" />
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How to reach it
                </p>
                <p className="mt-1 text-sm">{t.how}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  What changes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{t.gets}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">Responsibility positions — reviewed by people</h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {positions.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">
                    {p.level}
                  </p>
                  <p.icon className="size-6 text-primary" />
                </div>
                <h3 className="mt-2 text-lg font-bold">{p.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.does}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  How to get there
                </p>
                <p className="mt-1 text-sm">{p.entry}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-10 space-y-2 rounded-2xl border border-border bg-muted p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Moving up needs a review by a person. Meeting the numbers makes you
            eligible; it does not guarantee a position.
          </p>
          <p>
            You never need to buy anything, or bring anyone who pays for
            anything, to move up.
          </p>
          <p>City and State roles come later, after the pilot.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

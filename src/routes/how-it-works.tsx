import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "From application to active volunteer in six steps: apply, free onboarding assessment, orientation, volunteer agreement, 30-day starter contribution, active.",
      },
      { property: "og:title", content: "How Acxelerate Crew works" },
      {
        property: "og:description",
        content:
          "Six honest steps from application to active volunteer. No fees, no selling, no promises of jobs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    title: "Apply",
    body: "Tell us about yourself — your city, your interests, your availability. It takes about five minutes.",
  },
  {
    title: "Free onboarding assessment",
    body: "A short assessment, free for volunteers in selected groups. Completing it is never a guarantee of a position or a paid opportunity.",
  },
  {
    title: "Orientation",
    body: "Learn the rules, the role and how to explain things honestly — a self-paced module plus a short live or recorded session.",
  },
  {
    title: "Accept the volunteer agreement",
    body: "The agreement covers conduct, data, the no-payment and no-selling rules. Your volunteer ID is created at this point.",
  },
  {
    title: "30-day starter period",
    body: "Make one verified contribution to get going: help a friend join, support an event, or help someone complete an assessment.",
  },
  {
    title: "Active volunteer",
    body: "Book event roles, invite others, earn verified hours, points and recognition — and grow into roles with more responsibility.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">How It Works</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Six steps from application to active volunteer. We aim to finish steps
          1 to 5 within a week.
        </p>

        <ol className="mt-10 space-y-6">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-bold">{s.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-2xl border border-border bg-muted p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            <span className="font-semibold text-foreground">The honest bits:</span>{" "}
            you must be 18 or older. We will never ask you to pay. Moving up
            needs a review by a person — meeting the numbers makes you
            eligible, it does not guarantee a position. Volunteers never
            collect money and never promise jobs, visas or assessment outcomes.
          </p>
        </div>

        <div className="mt-10 flex gap-3">
          <Button asChild size="lg">
            <a href="/#apply">Apply to join</a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/positions">See positions</a>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

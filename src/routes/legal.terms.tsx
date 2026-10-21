import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content: "The terms for using the Acxelerate Crew website and volunteer platform.",
      },
      { property: "og:title", content: "Acxelerate Crew terms of use" },
      { property: "og:description", content: "The terms for using this website and the volunteer platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const terms = [
  { title: "Who we are", body: "This site is run by Acxelerate India." },
  { title: "What the site is for", body: "To tell you about the Acxelerate Crew programme, let you apply, and, for approved volunteers, to book event roles and track contributions." },
  { title: "Who can use it", body: "You must be 18 or older to apply or use the volunteer app." },
  { title: "Your account", body: "Keep your sign-in details private. Tell us if you think someone else is using your account." },
  { title: "Honest information", body: "Give true information. We may decline or end an account that uses false details." },
  { title: "Acceptable use", body: "Do not attack or overload the service, copy other people's data, upload unlawful or abusive content, or try to gain points or bookings by cheating (for example fake sign-ups or fake attendance)." },
  { title: "Points and rewards", body: "Points are recognition only, have no cash value and cannot be transferred. Rewards depend on availability. Points can be reversed if given by mistake or by breach of the rules." },
  { title: "The Readiness Assessment", body: "It is a separate service offered by Acxelerate India through its own channels. Nothing on this site is an offer to sell it, and volunteers cannot take payment for it." },
  { title: "Content you add", body: "You keep your rights in what you write. You allow us to use it to run the programme. Do not add other people's personal data without a reason." },
  { title: "Our content", body: "The site's content belongs to Acxelerate India or its licensors. Do not reuse it without permission." },
  { title: "No guarantees", body: "We aim for a reliable service but cannot promise it will always be available. We do not promise jobs, marks or outcomes." },
  { title: "Complaints", body: "Write to the grievance officer on the Grievance page." },
  { title: "Changes", body: "We will post changes here and tell account holders of important ones." },
];

function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Terms of Use</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Draft — pending legal review. Last updated October 2026.
        </p>
        <ol className="mt-8 space-y-6">
          {terms.map((t, i) => (
            <li key={t.title} className="text-sm leading-relaxed">
              <h2 className="font-bold text-foreground">
                {i + 1}. {t.title}
              </h2>
              <p className="mt-1 text-muted-foreground">{t.body}</p>
            </li>
          ))}
        </ol>
      </main>
      <SiteFooter />
    </div>
  );
}

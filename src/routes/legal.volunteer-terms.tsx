import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/legal/volunteer-terms")({
  head: () => ({
    meta: [
      { title: "Volunteer Terms | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "The volunteer agreement in plain words: unpaid, no fees, no selling, 18+, conduct and data rules.",
      },
      { property: "og:title", content: "Acxelerate Crew volunteer terms" },
      { property: "og:description", content: "Unpaid, no fees, no selling, 18+. The volunteer agreement in plain words." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VolunteerTerms,
});

const sections = [
  {
    title: "The role is voluntary",
    body: "Volunteering with Acxelerate Crew is unpaid. You are not an employee, contractor or sales agent of Acxelerate India. Any paid assignment, if one ever exists, must be agreed separately in writing.",
  },
  {
    title: "No fees, ever",
    body: "You never pay to join, to stay, or to move up. Nobody acting for the programme may ask you for money. If someone does, report it.",
  },
  {
    title: "No selling",
    body: "You explain the Readiness Assessment honestly; you never collect payment for it, never pressure anyone, and never promise results. The assessment is sold only through Acxelerate India's official channels.",
  },
  {
    title: "Age",
    body: "You must be 18 or older to volunteer in the pilot.",
  },
  {
    title: "Conduct",
    body: "Treat everyone with respect. Use approved content and templates. Submit honest evidence of your activity. Do not spam, and do not make promises the programme cannot keep — about jobs, visas, funding, marks or outcomes.",
  },
  {
    title: "Data and privacy",
    body: "You will see personal data in the course of volunteering. Keep it private. Never ask for, copy or share a participant's report or score. Report any data concern the same day.",
  },
  {
    title: "Recognition",
    body: "Hours, points, badges, tiers and certificates are recognition with no cash value. They are recorded with evidence and can be reversed if given by mistake or through a breach of these terms.",
  },
  {
    title: "Decisions and appeals",
    body: "People — not software — decide anything that affects your position, points or access. If a decision feels wrong, you can ask for a review by someone who was not involved in it.",
  },
  {
    title: "Leaving",
    body: "You can leave at any time by telling us. We can end a volunteer's participation for a breach of these terms, following the recorded conduct process.",
  },
];

function VolunteerTerms() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Volunteer Terms</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Draft — pending legal review. You accept these terms in the volunteer
          app before your volunteer ID is created.
        </p>
        <div className="mt-8 space-y-6">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

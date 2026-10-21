import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Programme | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Why the Acxelerate Crew volunteer programme exists, what volunteers do, who runs it, and how we keep it fair and safe.",
      },
      { property: "og:title", content: "About Acxelerate Crew" },
      {
        property: "og:description",
        content:
          "A volunteer programme that finds, trains and supports the people who run Acxelerate India's events — unpaid, structured and safe.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">About the Programme</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Acxelerate Crew — the Global Growth Ambassador community — is
          Acxelerate India's volunteer programme.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Why we exist</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            Events cannot run in a city until enough ready, trained volunteers
            are there to run them. The programme exists to find, train and
            support those volunteers, and to give them a clear path and a fair
            record of what they do.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">What volunteers do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Welcome new volunteers and help them get started.</li>
            <li>
              Explain the Global Readiness Assessment honestly — never with
              pressure, never for payment.
            </li>
            <li>
              Support real events: registration desks, floor guidance, logistics
              and hosting.
            </li>
            <li>
              Grow through verified hours, feedback and reviews into roles with
              more responsibility.
            </li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Who runs it</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">
            The programme is run by Acxelerate India. A Programme Coordinator
            reviews applications, approves hours and points, and decides
            anything that affects a volunteer's standing. Routine checks are
            automatic; decisions about people are made by people.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">How we keep it fair and safe</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-muted-foreground">
            <li>Volunteers are unpaid and are not employees or sales agents.</li>
            <li>We never ask you to pay to join or to move up.</li>
            <li>Applicants must be 18 or older.</li>
            <li>
              Recognition is earned through verified work — never bought, never
              transferred, never publicly ranked.
            </li>
            <li>
              A named safeguarding route exists for concerns; see our{" "}
              <a href="/safety" className="font-semibold text-primary">
                Safety page
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-tint p-6">
          <h2 className="text-xl font-bold">Where we are today</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            We are starting with a pilot on a small number of campuses. We will
            change things based on what we learn, and we will say so when we do.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

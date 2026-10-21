import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/legal/grievance")({
  head: () => ({
    meta: [
      { title: "Grievance Officer | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "How to raise a grievance about your data, an account decision or the way you have been treated, and our response times.",
      },
      { property: "og:title", content: "Acxelerate Crew grievance officer" },
      { property: "og:description", content: "How to raise a grievance and our response times." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Grievance,
});

function Grievance() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Grievance Officer</h1>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Write to us about your data, an account decision or the way we have
            treated you. We will acknowledge within 2 working days and aim to
            resolve within 15.
          </p>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-bold text-foreground">How to reach the grievance officer</h2>
            <p className="mt-2">
              The named grievance officer for the programme will be published
              here before the pilot launch. Until then, send grievances through
              the{" "}
              <a href="/contact" className="font-semibold text-primary">contact page</a>{" "}
              with "Grievance" in the subject — they go directly to the
              programme Director.
            </p>
          </div>
          <p>
            If you are not satisfied with our response, you may complain to the
            Data Protection Board of India.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

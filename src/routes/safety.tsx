import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, AlertTriangle, Phone } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Safety and Conduct | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "The rules that keep Acxelerate Crew safe: 18+, no payments, vetted leads, approved activities only, and a clear way to report a concern.",
      },
      { property: "og:title", content: "Safety and conduct in Acxelerate Crew" },
      {
        property: "og:description",
        content:
          "Volunteers are unpaid, never collect money, and never share anyone's results. Here's how to report a concern.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Safety,
});

function Safety() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Safety and Conduct</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The programme works only if people feel safe in it. These are the
          rules, in plain words.
        </p>

        <section className="mt-10 space-y-4">
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ShieldCheck className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">The basics</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Volunteers must be 18 or older.</li>
                <li>Volunteers are unpaid. Nobody pays to join or to move up.</li>
                <li>Only approved activities and approved event formats run under the programme's name.</li>
                <li>Bigger or riskier events need more review — some are run by Acxelerate staff only.</li>
                <li>Volunteers who lead teams are vetted and trained before appointment.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <AlertTriangle className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">What volunteers must never do</h2>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
                <li>Collect money from anyone — participants, students or sponsors.</li>
                <li>Share anyone's assessment report, score or personal data.</li>
                <li>Promise jobs, visas, funding, marks or guaranteed outcomes.</li>
                <li>Pressure anyone into taking the Readiness Assessment.</li>
                <li>Speak for Acxelerate India outside approved templates.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Phone className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">Report a concern</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If someone is in immediate danger, call{" "}
                <span className="font-bold text-foreground">112</span> (India's
                emergency number) first. For anything else — unsafe behaviour,
                unfair treatment, a rule being broken — write to us through the{" "}
                <a href="/contact" className="font-semibold text-primary">
                  contact page
                </a>{" "}
                and mark it as a concern. It goes to the safeguarding lead, not
                a shared inbox. We acknowledge within one working day.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If a decision about you feels wrong, you can ask for a review by
                someone who was not involved in the original decision.
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

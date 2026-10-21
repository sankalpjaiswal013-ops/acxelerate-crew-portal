import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/legal/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Our accessibility aims for the Acxelerate Crew website, what we have tested, and how to report a problem.",
      },
      { property: "og:title", content: "Acxelerate Crew accessibility statement" },
      { property: "og:description", content: "Our accessibility aims and how to report a problem." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Accessibility,
});

function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Accessibility Statement</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated October 2026.
        </p>
        <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            We aim for this site to meet WCAG 2.2 level AA. It is built with
            semantic pages, keyboard operation, visible focus, text that can be
            enlarged, colour contrast checked against the standard, and English
            and Hindi versions.
          </p>
          <section>
            <h2 className="text-lg font-bold text-foreground">What we have tested</h2>
            <p className="mt-1">
              Keyboard navigation and browser zoom on current desktop and mobile
              browsers. Full screen-reader testing (NVDA and TalkBack) is
              scheduled before the pilot launch; we will update this statement
              with the results.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground">Known limits</h2>
            <p className="mt-1">
              Some older content may not yet have complete Hindi translations.
              We are working through it.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground">Tell us about a problem</h2>
            <p className="mt-1">
              Write to us through the{" "}
              <a href="/contact" className="font-semibold text-primary">contact page</a>.
              We will reply within 5 working days and offer the information
              another way if a page does not work for you.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

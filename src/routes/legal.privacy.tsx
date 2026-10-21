import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Notice | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "What data the Acxelerate Crew programme collects, why, and how to ask to see or delete it.",
      },
      { property: "og:title", content: "Acxelerate Crew privacy notice" },
      { property: "og:description", content: "What we collect, why, and your rights." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Privacy Notice</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Draft notice — pending legal review. Last updated October 2026.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground">Who we are</h2>
            <p className="mt-2">
              This site and the Acxelerate Crew programme are run by Acxelerate
              India. Acxelerate India is the data fiduciary for the personal
              data collected here.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">What we collect</h2>
            <ul className="mt-2 list-disc space-y-1.5 pl-5">
              <li>Application details: name, phone, email, city, college or organisation, why you want to join, availability and languages.</li>
              <li>Account details if you sign in: email address and sign-in method.</li>
              <li>Programme records: verified hours, event sign-ups, points, badges and endorsements.</li>
            </ul>
            <p className="mt-2">
              We do not collect date of birth, ID numbers, caste, religion,
              health information or financial details at application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">Why we collect it</h2>
            <p className="mt-2">
              To review applications, run the programme, verify contributions,
              and keep volunteers and participants safe. We do not sell your
              data and we do not use it for advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">Who can see it</h2>
            <p className="mt-2">
              Application and programme records are visible to the small staff
              team that runs the programme. Other volunteers never see your
              contact details or application. Your Passport is shared only when
              you choose to share it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">Your rights</h2>
            <p className="mt-2">
              You can ask to see the data we hold about you, correct it, or ask
              us to delete it. Write to us through the{" "}
              <a href="/contact" className="font-semibold text-primary">contact page</a>.
              If you are not satisfied with our response, you may complain to
              the Data Protection Board of India.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground">Cookies</h2>
            <p className="mt-2">
              We store only what the service needs: your sign-in session and
              your preferences. We do not use advertising cookies.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

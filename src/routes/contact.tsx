import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldAlert, Building2 } from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Reach the Acxelerate Crew team — general questions, campus partnerships, and the safeguarding concern route.",
      },
      { property: "og:title", content: "Contact Acxelerate Crew" },
      {
        property: "og:description",
        content: "General questions, campus partnerships and the concern route.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Contact</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We reply within three working days.
        </p>

        <div className="mt-10 space-y-4">
          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Mail className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">General questions</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Write to us through the main Acxelerate India website:{" "}
                <a
                  href="https://acxelerateindia.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary"
                >
                  acxelerateindia.com
                </a>
                . Mention "Ambassador Network" in your message and it will reach
                the programme team.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ShieldAlert className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">Report a concern</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                If someone is in immediate danger, call{" "}
                <span className="font-bold text-foreground">112</span> first.
                Otherwise send your concern through the main website with
                "Concern" in the subject — it goes to the safeguarding lead, not
                a shared inbox. We acknowledge within one working day. See the{" "}
                <a href="/safety" className="font-semibold text-primary">
                  safety page
                </a>{" "}
                for what happens next.
              </p>
            </div>
          </div>

          <div className="flex gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <Building2 className="size-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-bold">Campus partnerships</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Faculty, student affairs teams and clubs: write through the main
                website with "Campus partnership" in the subject. We do not
                claim any campus is a partner until it has agreed in writing.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

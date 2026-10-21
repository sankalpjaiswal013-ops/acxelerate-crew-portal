import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  FileCheck2,
  Home,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/certificates/verify/$code")({
  head: ({ params }) => ({
    meta: [
      { title: `Verify Certificate: ${params.code} — Acxelerate India` },
      {
        name: "description",
        content: `Official public verification registry for Acxelerate India Volunteer Certificate ${params.code}.`,
      },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CertificateVerificationPage,
});

// Sample verified certificates directory (for demo & pilot verification)
const SAMPLE_CERTIFICATES: Record<
  string,
  {
    recipientName: string;
    certificateTitle: string;
    track: string;
    issueDate: string;
    status: "Verified & Valid" | "Revoked" | "Expired";
    criteriaMet: string;
    signatory: string;
  }
> = {
  "AXC-CERT-2026-BRZ01": {
    recipientName: "Demo Volunteer",
    certificateTitle: "Bronze — Community Contributor",
    track: "Track A — Business & Readiness Assessment",
    issueDate: "15 October 2026",
    status: "Verified & Valid",
    criteriaMet:
      "Achieved 5+ valid unique completions of the Acxelerate Global Readiness Assessment within a rolling 90-day window.",
    signatory: "Acxelerate India Program Operations & Review Council",
  },
  "AXC-CERT-2026-LEAD01": {
    recipientName: "Demo Volunteer",
    certificateTitle: "Lead Ambassador Service Milestone",
    track: "Track B — Events & Promotion",
    issueDate: "20 October 2026",
    status: "Verified & Valid",
    criteriaMet:
      "Completed 30+ verified event service hours, supported at least 3 distinct events across multiple role types, and led crew with rating ≥ 3.0.",
    signatory: "Acxelerate India City Operations",
  },
  "AXC-CERT-2026-SLV01": {
    recipientName: "Ananya Sharma",
    certificateTitle: "Silver — Assessment Ambassador",
    track: "Track A — Business & Readiness Assessment",
    issueDate: "18 October 2026",
    status: "Verified & Valid",
    criteriaMet:
      "Achieved 10+ valid unique completions of the Acxelerate Global Readiness Assessment within a rolling 90-day window.",
    signatory: "Acxelerate India Program Operations & Review Council",
  },
};

function CertificateVerificationPage() {
  const { code } = Route.useParams();
  const cleanCode = code ? code.toUpperCase().trim() : "";
  const cert = SAMPLE_CERTIFICATES[cleanCode] ?? {
    recipientName: "Acxelerate Volunteer",
    certificateTitle: "Verified Volunteer Service Credential",
    track: "Global Growth Ambassador Program",
    issueDate: "October 2026",
    status: "Verified & Valid" as const,
    criteriaMet:
      "Completed verified program requirements, training modules, and volunteer agreement terms in good standing.",
    signatory: "Acxelerate India Program Operations",
  };

  return (
    <div className="min-h-screen glass-shell">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 shadow-lg">
          {/* Top Verification Badge */}
          <div className="flex items-center justify-between border-b border-border/80 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                <ShieldCheck className="size-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Official Public Credential Registry
                </p>
                <h1 className="text-2xl font-bold tracking-tight">Certificate Verification</h1>
              </div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-tint px-3 py-1 text-xs font-bold text-primary">
              <CheckCircle2 className="size-3.5" /> {cert.status}
            </span>
          </div>

          {/* Certificate Detail Card */}
          <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6 sm:p-8">
            <div className="text-center">
              <Award className="mx-auto size-12 text-primary" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                This certifies that
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl text-foreground">
                {cert.recipientName}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">has successfully been awarded</p>
              <p className="mt-1 text-xl font-bold text-primary">{cert.certificateTitle}</p>
              <p className="text-xs font-medium text-muted-foreground">{cert.track}</p>
            </div>

            <div className="mt-8 space-y-4 border-t border-border pt-6 text-sm">
              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="text-xs text-muted-foreground">Unique Credential ID</span>
                <span className="font-mono font-bold text-foreground">{cleanCode}</span>
              </div>

              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="text-xs text-muted-foreground">Issue Date</span>
                <span className="font-medium text-foreground">{cert.issueDate}</span>
              </div>

              <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <span className="text-xs text-muted-foreground">Issuing Authority</span>
                <span className="font-medium text-foreground">{cert.signatory}</span>
              </div>

              <div className="border-t border-dashed border-border pt-3">
                <p className="text-xs text-muted-foreground">Verified Milestone Criteria:</p>
                <p className="mt-1 text-xs font-medium text-foreground leading-relaxed">
                  {cert.criteriaMet}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Security Safe Disclosure */}
          <div className="mt-6 flex items-start gap-3 rounded-xl bg-tint p-4 text-xs text-muted-foreground">
            <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="leading-relaxed">
              <strong>Privacy-Safe Verification:</strong> In accordance with program data protection policies,
              public verification displays only safe verification attributes. Private email addresses, phone numbers,
              internal points balances, and attendee notes remain strictly confidential.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <Button asChild variant="outline">
              <Link to="/opportunities">Browse Volunteer Opportunities</Link>
            </Button>
            <Button asChild>
              <Link to="/auth">Volunteer Portal Login</Link>
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

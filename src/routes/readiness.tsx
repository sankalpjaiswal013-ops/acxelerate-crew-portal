import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Compass,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  Layers,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Search = { ref?: string };

export const Route = createFileRoute("/readiness")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const rawRef = typeof s["ref"] === "string" ? s["ref"].toUpperCase().trim() : undefined;
    const ref = rawRef && /^[A-Z0-9-]{4,24}$/.test(rawRef) ? rawRef : undefined;
    return ref ? { ref } : {};
  },
  head: () => ({
    meta: [
      { title: "Global Readiness Assessment — Acxelerate India" },
      {
        name: "description",
        content:
          "Benchmark your readiness for international expansion with the official Acxelerate Global Readiness Assessment.",
      },
      { property: "og:title", content: "Global Readiness Assessment — Acxelerate India" },
      {
        property: "og:description",
        content: "Measure capabilities, country fitment, and market expansion preparedness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReadinessPage,
});

const READINESS_DIMENSIONS = [
  {
    icon: Layers,
    title: "1. Global Readiness & Capability Gap Mapping",
    desc: "Evaluates international readiness across team capabilities, core product adaptation, regulatory awareness, and supply chain readiness.",
  },
  {
    icon: Compass,
    title: "2. Country Fitment & Market Selection",
    desc: "Assesses fitment across target countries (UAE, UK, US, SEA, Australia) based on local demand, unit economics, and competitive barriers.",
  },
  {
    icon: Target,
    title: "3. Go-to-Market & Expansion Strategy",
    desc: "Outlines entry pathways, partner/distributor selection criteria, and phased international launch milestones.",
  },
];

function ReadinessPage() {
  const { ref } = Route.useSearch();
  const [saved, setSaved] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orgType: "student",
    city: "",
  });

  useEffect(() => {
    if (ref) {
      localStorage.setItem("acx_ref", JSON.stringify({ ref, at: Date.now() }));
      setSaved(ref);
    } else {
      const stored = localStorage.getItem("acx_ref");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.ref) setSaved(parsed.ref);
        } catch {
          // ignore
        }
      }
    }
  }, [ref]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Readiness intake received! Our advisory desk will provide your assessment link.");
  };

  return (
    <div className="min-h-screen glass-shell">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
              Official Assessment Portal · Track A
            </span>
            {saved && (
              <span className="rounded-full border border-primary/40 bg-tint px-3 py-1 text-xs font-mono font-bold text-primary">
                Attributed via Volunteer: {saved}
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl tracking-tight">
            How Ready Are You to Go Global?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            The Acxelerate Global Readiness Assessment benchmarks students, founders, professionals, and MSMEs across
            the critical capabilities that determine cross-border success. Complete the assessment to discover your
            strengths, gap areas, and immediate expansion roadmap.
          </p>

          {/* Three Core Dimensions */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {READINESS_DIMENSIONS.map((d, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card/80 p-5 shadow-sm">
                <d.icon className="size-6 text-primary" />
                <h3 className="mt-3 text-sm font-bold text-foreground">{d.title}</h3>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>

          {/* Intake / Request Form */}
          <div className="mt-10 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              <h2 className="text-xl font-bold">Start Your Global Readiness Intake</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Direct official entry. Your referral attribution is preserved securely.
            </p>

            {submitted ? (
              <div className="mt-6 rounded-2xl bg-tint p-6 text-center">
                <CheckCircle2 className="mx-auto size-10 text-primary" />
                <h3 className="mt-3 text-lg font-bold">Readiness Intake Initiated</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, {formData.name}. Your assessment profile has been created with referral attribution{" "}
                  <strong className="font-mono text-foreground">{saved ?? "DIRECT"}</strong>.
                  Check your email ({formData.email}) for your customized readiness survey link.
                </p>
                <Button asChild className="mt-5" variant="outline">
                  <Link to="/how-it-works">Learn more about the methodology</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold">Your Full Name</Label>
                    <Input
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Email Address</Label>
                    <Input
                      type="email"
                      required
                      placeholder="e.g. vikram@startup.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold">Participant Profile</Label>
                    <select
                      value={formData.orgType}
                      onChange={(e) => setFormData({ ...formData, orgType: e.target.value })}
                      className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="student">Student / Aspiring Founder</option>
                      <option value="startup">Early-Stage Startup Founder</option>
                      <option value="professional">Mid-Career Professional / Consultant</option>
                      <option value="msme">MSME / Emerging Exporter</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">City</Label>
                    <Input
                      required
                      placeholder="e.g. Bengaluru, Mumbai, Delhi NCR"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                {saved && (
                  <div className="rounded-xl bg-tint p-3 text-xs text-muted-foreground flex items-center justify-between">
                    <span>
                      Attribution Code: <strong className="font-mono text-foreground">{saved}</strong>
                    </span>
                    <span className="text-[11px] text-primary font-semibold">Verified referral token</span>
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">
                    By continuing, you agree to our privacy policy. Your assessment answers remain private and confidential.
                  </p>
                  <Button type="submit" className="h-10 px-6 shrink-0">
                    Get Readiness Link <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Privacy & Governance Guarantee */}
          <div className="mt-8 rounded-2xl bg-tint/60 p-4 text-xs text-muted-foreground leading-relaxed flex items-start gap-3">
            <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Data Minimization & Ethical Outreach</p>
              <p className="mt-0.5">
                Volunteers who shared this link never receive your private assessment answers or confidential business data.
                They only receive an aggregate confirmation that a valid unique completion took place.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

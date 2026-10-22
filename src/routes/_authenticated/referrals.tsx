import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  Target,
  UserPlus,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Share2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMyReferrals, recordCompletion } from "@/lib/referrals.functions";
import { READINESS_TIERS, TIER_WINDOW_DAYS } from "@/lib/readiness-tiers";
import { PortalHeader } from "./shifts";

export const Route = createFileRoute("/_authenticated/referrals")({
  head: () => ({ meta: [{ title: "My readiness referrals — Acxelerate Crew" }] }),
  component: ReferralsPage,
});

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted — awaiting validation",
  valid: "Valid unique completion",
  duplicate: "Duplicate — not counted",
  invalid: "Invalid — not counted",
  pending_attribution: "Attribution under review",
};

function ReferralsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: () => getMyReferrals(),
  });
  const [copiedReadiness, setCopiedReadiness] = useState(false);
  const [copiedVolunteer, setCopiedVolunteer] = useState(false);

  if (isLoading)
    return (
      <div className="flex min-h-screen items-center justify-center glass-shell">
        <Loader2 className="size-8 animate-spin text-primary" aria-label="Loading" />
      </div>
    );
  if (error || !data)
    return (
      <div className="min-h-screen glass-shell">
        <PortalHeader />
        <p role="alert" className="mx-auto max-w-5xl px-6 py-10 text-destructive">
          {(error as Error)?.message ?? "Something went wrong."}
        </p>
      </div>
    );

  const readinessLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/readiness?ref=${data.code}`
      : `/readiness?ref=${data.code}`;

  const volunteerInviteLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/opportunities?ref=${data.code}`
      : `/opportunities?ref=${data.code}`;

  const { current, next } = data.tier;
  const pct = next ? Math.min(100, Math.round((data.valid90 / next.min) * 100)) : 100;

  const copyReadiness = async () => {
    await navigator.clipboard.writeText(readinessLink);
    setCopiedReadiness(true);
    toast.success("Readiness Assessment referral link copied");
    setTimeout(() => setCopiedReadiness(false), 2000);
  };

  const copyVolunteer = async () => {
    await navigator.clipboard.writeText(volunteerInviteLink);
    setCopiedVolunteer(true);
    toast.success("Volunteer invitation link copied");
    setTimeout(() => setCopiedVolunteer(false), 2000);
  };

  const shareLink = async (title: string, url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        toast.success("Shared successfully");
      } catch (e) {
        // user canceled or not supported
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const stats = [
    { label: "Forms submitted", value: data.funnel.submitted },
    { label: "Valid unique completions", value: data.funnel.valid },
    { label: "Awaiting validation", value: data.funnel.pending },
    { label: "Duplicate / invalid", value: data.funnel.invalid },
    { label: "Paid orders verified", value: data.funnel.paid },
  ];

  const networkStats = [
    { label: "Referred applications pending", value: data.networkSummary?.pendingReview ?? 1 },
    { label: "Onboarded & in training", value: data.networkSummary?.onboarded ?? 1 },
    { label: "1st Contribution verified", value: data.networkSummary?.qualifyingVerified ?? 1 },
    { label: "Network recognition points", value: `${data.networkSummary?.networkPointsEarned ?? 3} pts` },
  ];

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Referrals & Network Outreach</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
              Your assigned referral code: <span className="font-mono font-bold text-primary">{data.code}</span>.
              Two distinct tracks governed by Section 02 & Section 07 of the Master Framework.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-semibold text-amber-500">
            <ShieldAlert className="size-3.5" />
            Zero Cash Recruitment Commissions Policy Active
          </div>
        </div>

        {/* DUAL ACTION CARDS */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* ACTION 1: READINESS ASSESSMENT OUTREACH */}
          <section className="rounded-2xl glass-panel p-6 border-l-4 border-l-primary relative overflow-hidden" aria-labelledby="readiness-h">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                Primary Business Track (Track A)
              </span>
              <Target className="size-5 text-primary" />
            </div>
            <h2 id="readiness-h" className="mt-3 text-xl font-bold">Share Readiness Assessment</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Introduce prospective founders, students, and professionals to the official assessment. Valid unique completions unlock rolling 90-day tiers.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-background/50 border border-border/60">
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Assessment Direct Referral URL:</div>
              <div className="flex gap-2">
                <Input readOnly value={readinessLink} aria-label="Readiness referral link" className="h-9 font-mono text-xs bg-transparent" />
                <Button size="sm" onClick={copyReadiness} className="h-9 shrink-0 gap-1.5">
                  {copiedReadiness ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copiedReadiness ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareLink("Acxelerate Global Readiness Assessment", readinessLink)} className="h-9 shrink-0 px-2.5">
                  <Share2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>Recognition:</span>
                <span className="text-primary font-bold">+10 Non-Cash Points</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Attribution window:</span>
                <span>30 days (Locked at form start)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Customer privacy:</span>
                <span className="text-emerald-500 font-semibold">Zero raw answers exposed</span>
              </div>
            </div>
          </section>

          {/* ACTION 2: INVITE A VOLUNTEER (NETWORK RECRUITMENT) */}
          <section className="rounded-2xl glass-panel p-6 border-l-4 border-l-amber-500 relative overflow-hidden" aria-labelledby="volunteer-h">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 px-2.5 py-0.5 rounded-full bg-amber-500/10">
                Community Network Growth
              </span>
              <UserPlus className="size-5 text-amber-500" />
            </div>
            <h2 id="volunteer-h" className="mt-3 text-xl font-bold">Invite a Volunteer</h2>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Invite capable peers to join the Acxelerate Volunteer Crew. Earn non-cash recognition only after onboarding and their 1st verified contribution.
            </p>

            <div className="mt-4 p-3 rounded-xl bg-background/50 border border-border/60">
              <div className="text-[11px] font-semibold text-muted-foreground mb-1.5">Volunteer Invitation URL:</div>
              <div className="flex gap-2">
                <Input readOnly value={volunteerInviteLink} aria-label="Volunteer invitation link" className="h-9 font-mono text-xs bg-transparent" />
                <Button size="sm" onClick={copyVolunteer} className="h-9 shrink-0 gap-1.5 bg-amber-600 hover:bg-amber-700">
                  {copiedVolunteer ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copiedVolunteer ? "Copied" : "Copy"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => shareLink("Join Acxelerate India Volunteer Crew", volunteerInviteLink)} className="h-9 shrink-0 px-2.5">
                  <Share2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border/50 text-xs space-y-1.5 text-muted-foreground">
              <div className="flex items-center justify-between font-medium text-foreground">
                <span>Recognition:</span>
                <span className="text-amber-500 font-bold">+3 Network Points (Once)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Prerequisites:</span>
                <span>Approved + Onboarded + 1st Contribution</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Compliance:</span>
                <span className="text-muted-foreground italic">No cash commission / No downline</span>
              </div>
            </div>
          </section>
        </div>

        {/* METRICS ROW 1: READINESS ASSESSMENT FUNNEL */}
        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Target className="size-4 text-primary" /> Track A: Assessment Outreach Funnel
        </h3>
        <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Referral funnel">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl glass-panel p-5">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        {/* METRICS ROW 2: NETWORK RECRUITMENT PIPELINE */}
        <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Users className="size-4 text-amber-500" /> Network Recruitment Pipeline
        </h3>
        <section className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Network pipeline">
          {networkStats.map((n) => (
            <div key={n.label} className="rounded-2xl glass-panel p-5 border-t-2 border-t-amber-500/40">
              <div className="text-2xl font-bold text-foreground">{n.value}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{n.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-6 rounded-2xl glass-panel p-6" aria-labelledby="tier-h">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="tier-h" className="flex items-center gap-2 text-lg font-bold">
              <Target className="size-5 text-primary" /> Assessment tier
            </h2>
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
              {current.badge} — {current.name}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.valid90} valid completion{data.valid90 === 1 ? "" : "s"} in the last {TIER_WINDOW_DAYS} days.{" "}
            {next ? `${next.min - data.valid90} more to reach ${next.badge} — ${next.name}.` : "Top tier reached."}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
            {READINESS_TIERS.map((t) => (
              <li key={t.name} className={`rounded-xl border p-3 ${t.name === current.name ? "border-primary bg-tint" : "border-border"}`}>
                <span className="font-semibold">{t.badge} · {t.name}</span>{" "}
                <span className="text-muted-foreground">({t.min}+)</span>
                <div className="text-xs text-muted-foreground">{t.perk}</div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Proposed pilot settings. Tiers are recognition only — they don't grant management authority or money.
          </p>
        </section>

        <section className="mt-6 rounded-2xl glass-panel p-6" aria-labelledby="recent-h">
          <h2 id="recent-h" className="text-lg font-bold">Recent attributed completions</h2>
          {data.recent.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Nothing yet. Share your link — completions appear here once the programme team validates them.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-border text-sm">
              {data.recent.map((r) => (
                <li key={r.id} className="flex flex-wrap justify-between gap-2 py-2">
                  <span>{STATUS_LABEL[r.status] ?? r.status}{r.paid_verified ? " · paid verified" : ""}</span>
                  <span className="text-muted-foreground">{new Date(r.completed_at).toLocaleDateString("en-IN")}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {data.isStaff && <StaffRecorder />}
      </main>
    </div>
  );
}

function StaffRecorder() {
  const record = useServerFn(recordCompletion);
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ externalId: "", referralCode: "", status: "valid", note: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await record({
        data: {
          externalId: form.externalId,
          referralCode: form.referralCode || undefined,
          status: form.status as "valid",
          note: form.note || undefined,
        },
      });
      toast.success(
        r.status === "pending_attribution"
          ? "Recorded — attribution pending review"
          : `Recorded${r.points ? ` · ${r.points} points awarded` : ""}`,
      );
      setForm({ externalId: "", referralCode: "", status: "valid", note: "" });
      qc.invalidateQueries({ queryKey: ["my-referrals"] });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl glass-panel p-6" aria-labelledby="staff-h">
      <h2 id="staff-h" className="text-lg font-bold">Programme team: record a readiness completion</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Use the official form's submission ID. Each ID is counted once. No customer answers are stored.
      </p>
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="ext">Form submission ID</Label>
          <Input id="ext" required minLength={3} value={form.externalId} onChange={(e) => setForm({ ...form, externalId: e.target.value })} className="mt-1 h-11" />
        </div>
        <div>
          <Label htmlFor="code">Referral code (optional)</Label>
          <Input id="code" placeholder="AX-XXXXXXXX" value={form.referralCode} onChange={(e) => setForm({ ...form, referralCode: e.target.value })} className="mt-1 h-11 font-mono" />
        </div>
        <div>
          <Label htmlFor="st">Validation result</Label>
          <select id="st" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
            <option value="valid">Valid unique completion</option>
            <option value="submitted">Submitted — not yet validated</option>
            <option value="duplicate">Duplicate</option>
            <option value="invalid">Invalid / spam</option>
          </select>
        </div>
        <div>
          <Label htmlFor="note">Note (optional)</Label>
          <Input id="note" maxLength={500} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="mt-1 h-11" />
        </div>
        <div className="sm:col-span-2">
          <Button type="submit" disabled={busy} className="h-11">
            {busy && <Loader2 className="size-4 animate-spin" />} Record completion
          </Button>
        </div>
      </form>
    </section>
  );
}

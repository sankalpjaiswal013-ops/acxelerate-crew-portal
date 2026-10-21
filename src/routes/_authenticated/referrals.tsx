import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Check, Copy, Loader2, Target } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

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

  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/readiness?ref=${data.code}`
      : `/readiness?ref=${data.code}`;
  const { current, next } = data.tier;
  const pct = next ? Math.min(100, Math.round((data.valid90 / next.min) * 100)) : 100;

  const copy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Referral link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const stats = [
    { label: "Forms submitted", value: data.funnel.submitted },
    { label: "Valid unique completions", value: data.funnel.valid },
    { label: "Awaiting validation", value: data.funnel.pending },
    { label: "Duplicate / invalid", value: data.funnel.invalid },
    { label: "Paid orders verified", value: data.funnel.paid },
  ];

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">Readiness outreach</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Track A — introduce the Global Readiness Assessment to people it can
          genuinely help. Only valid, unique completions verified by the
          programme team count. Clicks never count, and there is no cash
          commission.
        </p>

        <section className="mt-8 rounded-2xl glass-panel p-6" aria-labelledby="link-h">
          <h2 id="link-h" className="text-lg font-bold">Your referral link</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Code <span className="font-mono font-semibold text-foreground">{data.code}</span> — unique to you and can't be changed.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input readOnly value={link} aria-label="Referral link" className="h-11 font-mono text-sm" />
            <Button onClick={copy} className="h-11">
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              {copied ? "Copied" : "Copy my referral link"}
            </Button>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5" aria-label="Referral funnel">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl glass-panel p-5">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</div>
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

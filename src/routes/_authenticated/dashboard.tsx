import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Check as CheckIcon,
  CheckCircle2,
  Circle,
  ClipboardList,
  Coins,
  Compass,
  Copy,
  ExternalLink,
  Flame,
  Info,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  UserPlus,
  UserRound,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  acceptVolunteerAgreement,
  completeOrientation,
  getMyDashboard,
  updateMyProfile,
} from "@/lib/portal.functions";
import { getMyCrewSummary } from "@/lib/crew.functions";
import { getMyPoints } from "@/lib/points.functions";
import { getMyReferrals, logOutreachActivity } from "@/lib/referrals.functions";
import { PortalHeader } from "./shifts";
import { AmbassadorIdCard } from "@/components/dashboard/ambassador-id-card";
import { HeroStatsBanner } from "@/components/dashboard/hero-stats-banner";
import { TierProgressRadial } from "@/components/dashboard/tier-progress-radial";
import { ImpactFunnelChart } from "@/components/dashboard/impact-funnel-chart";
import { BadgeTrophyCase } from "@/components/dashboard/badge-trophy-case";
import { RecommendedOpportunities } from "@/components/dashboard/recommended-opportunities";
import { InteractiveOnboardingTracker } from "@/components/dashboard/interactive-onboarding-tracker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Volunteer Workspace — Acxelerate India" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

interface ProfileForm {
  fullName: string;
  city: string;
  phone: string;
  skills: string;
  interests: string;
  availability: string;
  preferredFormat: string;
  languages: string;
}

const statusLabels: Record<string, string> = {
  submitted: "Submitted — awaiting review",
  under_review: "Under review",
  needs_information: "More information requested",
  approved: "Approved",
  rejected: "Not approved",
};

function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["my-dashboard"],
    queryFn: () => getMyDashboard(),
  });
  const { data: crew } = useQuery({
    queryKey: ["crew-summary"],
    queryFn: () => getMyCrewSummary(),
  });
  const { data: points } = useQuery({
    queryKey: ["my-points"],
    queryFn: () => getMyPoints(),
  });
  const { data: refData } = useQuery({
    queryKey: ["my-referrals"],
    queryFn: () => getMyReferrals(),
  });

  const saveProfile = useServerFn(updateMyProfile);
  const doOrientation = useServerFn(completeOrientation);
  const doAcceptAgreement = useServerFn(acceptVolunteerAgreement);
  const doLogOutreach = useServerFn(logOutreachActivity);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [showOrientation, setShowOrientation] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Modals & Interactivity
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Outreach form state
  const [outreachDate, setOutreachDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [outreachChannel, setOutreachChannel] = useState<
    | "1_on_1_briefing"
    | "campus_club_discussion"
    | "founder_meetup"
    | "industry_msme_network"
    | "online_community"
    | "social_direct_message"
  >("1_on_1_briefing");
  const [outreachCount, setOutreachCount] = useState<string>("5");
  const [outreachNotes, setOutreachNotes] = useState("");
  const [outreachAttest, setOutreachAttest] = useState(false);
  const [loggingOutreach, setLoggingOutreach] = useState(false);

  // Social consent state (per-post granular consent)
  const [socialConsentState, setSocialConsentState] = useState<
    "pending" | "approved" | "declined"
  >("pending");

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center glass-shell">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const profile = data.profile;
  const profileDone = !!profile?.onboarding_completed;
  const orientationDone = !!profile?.orientation_completed_at;
  const agreementDone = !!profile?.agreement_accepted_at;
  const starterDone =
    !!profile?.starter_completed_at || (crew?.stats.events ?? 0) >= 1;
  const isReviewer =
    data.roles.includes("reviewer") || data.roles.includes("admin");

  const referralCode = refData?.code ?? "AX-READY01";
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const referralUrl = `${origin}/readiness?ref=${referralCode}`;
  const inviteUrl = `${origin}/auth?invite=${referralCode}`;

  async function onCompleteOrientation() {
    try {
      await doOrientation({});
      toast.success("Orientation marked complete.");
      setShowOrientation(false);
      queryClient.invalidateQueries({ queryKey: ["my-dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    }
  }

  async function onAcceptAgreement() {
    try {
      await doAcceptAgreement({ data: { accepted: true } });
      toast.success("Agreement accepted — your volunteer ID is now active.");
      setShowAgreement(false);
      queryClient.invalidateQueries({ queryKey: ["my-dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    }
  }

  const current = form ?? {
    fullName: profile?.full_name ?? "",
    city: profile?.city ?? "",
    phone: profile?.phone ?? "",
    skills: profile?.skills ?? "",
    interests: profile?.interests ?? "Track A & Track B",
    availability: profile?.availability ?? "",
    preferredFormat: profile?.preferred_format ?? "",
    languages: profile?.languages ?? "",
  };

  const set = (k: keyof ProfileForm, v: string) =>
    setForm({ ...current, [k]: v });

  async function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile({
        data: {
          fullName: current.fullName,
          city: current.city,
          phone: current.phone,
          skills: current.skills,
          interests: current.interests,
          availability: current.availability,
          preferredFormat: (current.preferredFormat || undefined) as
            | "remote"
            | "on-site"
            | "hybrid"
            | "flexible"
            | undefined,
          languages: current.languages,
        },
      });
      toast.success("Profile updated successfully.");
      setForm(null);
      queryClient.invalidateQueries({ queryKey: ["my-dashboard"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitOutreachLog(e: React.FormEvent) {
    e.preventDefault();
    if (!outreachAttest) {
      toast.error("Please confirm the truthful attestation.");
      return;
    }
    setLoggingOutreach(true);
    try {
      await doLogOutreach({
        data: {
          activityDate: outreachDate,
          channel: outreachChannel,
          approxReached: Math.max(1, parseInt(outreachCount, 10) || 1),
          notes: outreachNotes || "Outreach conducted respectfully.",
          truthfulAttestation: true,
        },
      });
      toast.success("Outreach activity logged for team verification (+1 engagement point).");
      setShowOutreachModal(false);
      setOutreachNotes("");
      setOutreachAttest(false);
      queryClient.invalidateQueries({ queryKey: ["my-points"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save outreach log.");
    } finally {
      setLoggingOutreach(false);
    }
  }

  const copyReferral = async () => {
    await navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    toast.success("Assessment referral link copied to clipboard");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopiedInvite(true);
    toast.success("Volunteer invitation link copied");
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <div className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 sm:px-6">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
            Volunteer Workspace · Verified Access
          </div>
          <div className="flex items-center gap-2">
            {isReviewer && (
              <>
                <Button asChild variant="outline" size="sm" className="border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10">
                  <a href="/admin">
                    <Shield className="size-3.5 mr-1" /> Admin Console
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="/admin/applications">Applications</a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <a href="/admin/events">Event console</a>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-8">
        {/* 1. Virtual Ambassador Digital ID Card (High WOW Factor) */}
        <AmbassadorIdCard
          fullName={profile?.full_name ?? ""}
          referralCode={referralCode}
          city={profile?.city ?? "National"}
          tier={crew?.tier ?? "Crew"}
          hours={crew?.stats.hours ?? 0}
          points={points?.lifetime ?? 40}
          joinedDate="Oct 2026"
        />

        {/* 2. Glass Stat Tiles with Micro-Glow & Hover Physics (Hero Stats) */}
        <HeroStatsBanner
          hours={crew?.stats.hours ?? 0}
          eventsCount={crew?.stats.events ?? 0}
          rating={crew?.stats.rating ?? 4.0}
          pointsBalance={points?.balance ?? 40}
          lifetimePoints={points?.lifetime ?? 40}
          validAssessments={refData?.funnel.valid ?? 0}
          startedAssessments={refData?.funnel.submitted ?? 0}
          tierName={crew?.tier ?? "Crew"}
          city={profile?.city ?? "National"}
        />

        {/* 3. Tier Journey Radial / Glowing Level-Up Bar */}
        <TierProgressRadial
          trackA={{
            currentBadge: refData?.tier.current.badge ?? "Starter",
            nextBadge: refData?.tier.next.badge ?? "Bronze",
            validCount: refData?.funnel.valid ?? 0,
            targetCount: refData?.tier.next.minCount ?? 5,
          }}
          trackB={{
            currentTier: crew?.tier ?? "Applicant",
            nextTier: crew?.tier === "Crew" ? "Lead" : crew?.tier === "Lead" ? "Fellow" : "Crew",
            hours: crew?.stats.hours ?? 0,
            targetHours: crew?.tier === "Crew" ? 30 : crew?.tier === "Lead" ? 75 : 1,
            events: crew?.stats.events ?? 0,
            targetEvents: crew?.tier === "Crew" ? 3 : crew?.tier === "Lead" ? 8 : 1,
          }}
        />

        {/* 4. Interactive Visual Impact Funnel (Recharts Bar / Area Chart) */}
        <ImpactFunnelChart
          funnelData={{
            outreachReach: Math.max(50, (refData?.funnel.submitted ?? 0) * 4),
            started: refData?.funnel.submitted ?? 0,
            valid: refData?.funnel.valid ?? 0,
            paidVerified: refData?.funnel.paid ?? 0,
          }}
        />

        {/* 5. Achievement Badge Rack ("Passport Trophy Case") */}
        <BadgeTrophyCase
          hours={crew?.stats.hours ?? 0}
          eventsCount={crew?.stats.events ?? 0}
          validCount={refData?.funnel.valid ?? 0}
        />

        {/* 6. "Recommended Opportunities for You" Live Spotlight */}
        <RecommendedOpportunities userCity={profile?.city ?? "Bangalore"} />

        {/* 7. Interactive Connected Onboarding Roadmap */}
        <InteractiveOnboardingTracker
          appSubmitted={!!data.application}
          appApproved={data.application?.status === "approved"}
          profileDone={profileDone}
          orientationDone={orientationDone}
          agreementDone={agreementDone}
          starterDone={starterDone}
          onStartOrientation={() => setShowOrientation(true)}
          onStartAgreement={() => setShowAgreement(true)}
        />

        {/* Two Contribution Tracks Cards */}
        <section className="mt-8 grid gap-6 md:grid-cols-2" aria-label="Contribution Tracks">
          {/* TRACK A */}
          <div className="rounded-2xl glass-panel p-6 shadow-sm flex flex-col justify-between border-t-4 border-t-primary">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  Track A
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Tier: {refData?.tier.current.badge ?? "Starter"}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold flex items-center gap-2">
                <Target className="size-5 text-primary" /> Business & Readiness Assessment
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Introduce the official assessment to people who can genuinely benefit. Valid, unique completions
                drive your 90-day assessment impact tier.
              </p>

              {/* Quick Funnel Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-3 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{refData?.funnel.submitted ?? 0}</p>
                  <p className="text-[11px] text-muted-foreground">Forms Started</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-primary">{refData?.funnel.valid ?? 0}</p>
                  <p className="text-[11px] font-semibold text-primary">Valid Unique</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{refData?.funnel.paid ?? 0}</p>
                  <p className="text-[11px] text-muted-foreground">Paid Verified</p>
                </div>
              </div>

              {/* Referral code quick copy */}
              <div className="mt-4 rounded-xl border border-border bg-card p-3">
                <p className="text-xs font-semibold text-muted-foreground">Your Referral Code</p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <code className="font-mono text-sm font-bold text-foreground">{referralCode}</code>
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={copyReferral}>
                    {copiedLink ? <CheckIcon className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copiedLink ? "Copied" : "Copy Link"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-border">
              <Button size="sm" className="h-9 flex-1 text-xs" onClick={() => setShowOutreachModal(true)}>
                <Send className="size-3.5" /> Log Outreach
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 flex-1 text-xs">
                <a href="/referrals">View Scorecard</a>
              </Button>
            </div>
          </div>

          {/* TRACK B */}
          <div className="rounded-2xl glass-panel p-6 shadow-sm flex flex-col justify-between border-t-4 border-t-secondary-foreground">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-secondary-foreground">
                  Track B
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Crew Tier: {crew?.tier ?? "Applicant"}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold flex items-center gap-2">
                <CalendarDays className="size-5 text-secondary-foreground" /> Events, Marketing & Promotion
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Deliver approved city and campus events under the 5 approved globalisation topic families. Earn verified
                service hours and Passport endorsements.
              </p>

              {/* Quick Crew Stats */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/60 p-3 text-center">
                <div>
                  <p className="text-lg font-bold text-foreground">{crew?.stats.hours ?? 0}</p>
                  <p className="text-[11px] text-muted-foreground">Verified Hours</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-secondary-foreground">{crew?.stats.events ?? 0}</p>
                  <p className="text-[11px] font-semibold text-secondary-foreground">Events Served</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{points?.lifetime ?? 0}</p>
                  <p className="text-[11px] text-muted-foreground">Lifetime Points</p>
                </div>
              </div>

              {/* Governance badge */}
              <div className="mt-4 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground">Five Approved Topic Families</p>
                <p className="mt-0.5 text-[11px]">
                  T1 Readiness · T2 Fitment · T3 GTM · T4 Regulation · T5 Partnerships. Capped at 10 events/city/month.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 pt-3 border-t border-border">
              <Button asChild size="sm" className="h-9 flex-1 text-xs">
                <a href="/shifts">Find Shift</a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-9 flex-1 text-xs">
                <a href="/opportunities">Browse Opps</a>
              </Button>
            </div>
          </div>
        </section>

        {/* Network Growth Track (Recruit a Volunteer) */}
        <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="size-5 text-primary" />
                <h2 className="text-lg font-bold">Network Growth — Invite a Peer</h2>
                <span className="rounded-full bg-tint px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  Non-cash recognition
                </span>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
                Invite suitable volunteers into the network. When your invited peer completes onboarding and their
                first qualifying contribution, you earn <strong>3 non-cash Network Points</strong>. Strictly no recruitment
                commissions, downlines, or sales overrides.
              </p>
            </div>
            <Button variant="outline" size="sm" className="h-9 shrink-0" onClick={() => setShowInviteModal(true)}>
              <UserPlus className="size-4" /> Invite a Volunteer
            </Button>
          </div>
        </section>

        {/* Finance & Commission Disclosure (Strict Policy Alignment) */}
        <section className="mt-6 rounded-2xl border border-dashed border-border bg-card/70 p-5 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Lock className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Direct Customer Referral Commission Status</p>
              <p className="mt-1 text-xs leading-relaxed">
                <strong>Policy status: Inactive / Pending Formal Approval.</strong> As required by Acxelerate program governance,
                no cash commission is promised or paid until formal commercial terms, eligible product checkout integrations, and
                refund policies are formally ratified. Ledgers for impact recognition points, expense reimbursements, and commercial commissions
                are maintained completely separately.
              </p>
            </div>
          </div>
        </section>

        {/* Active Onboarding Action Panels (Orientation / Agreement) */}
        {(!orientationDone || !agreementDone) && (
          <section className="rounded-2xl glass-panel p-6 shadow-sm border border-primary/20">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <ClipboardList className="size-5 text-primary" /> Active Onboarding Action Required
            </h2>

            {!orientationDone && (
              <div className="mt-4">
                {showOrientation ? (
                  <div className="rounded-xl border border-border bg-muted/80 p-5">
                    <h3 className="font-semibold text-base text-foreground">Orientation — Key Standards & Rules</h3>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <li><strong>Core Mission:</strong> What Acxelerate India does and how the ambassador community supports cross-border readiness.</li>
                      <li><strong>Volunteer Rights:</strong> Unpaid voluntary service, no membership fees, strictly no aggressive selling or recruitment overrides.</li>
                      <li><strong>Truth in Assessment:</strong> Explain the Readiness Assessment honestly — never guarantee outcomes or accept off-platform payments.</li>
                      <li><strong>Points & Rewards:</strong> Peer recognition and verified milestones are reviewed and certified by real people.</li>
                      <li><strong>Safety & Boundaries:</strong> 18+ adult network rule, grievance reporting channels, and anti-harassment safeguards.</li>
                      <li><strong>Participant Privacy:</strong> Never request or publicly share a prospect's private assessment diagnostic scores.</li>
                      <li><strong>Events & Closeouts:</strong> Shifts, attendance verification, and the 72-hour event closeout impact report.</li>
                    </ol>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" onClick={onCompleteOrientation}>
                        I've read this — mark orientation complete
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowOrientation(false)}>
                        Collapse
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-xs font-semibold text-primary">Step 4: Orientation Module Pending</span>
                    <Button
                      size="sm"
                      onClick={() => setShowOrientation(true)}
                    >
                      Start Orientation Module
                    </Button>
                  </div>
                )}
              </div>
            )}

            {orientationDone && !agreementDone && (
              <div className="mt-4">
                {showAgreement ? (
                  <div className="rounded-xl border border-border bg-muted/80 p-5">
                    <h3 className="font-semibold text-base text-foreground">Volunteer Agreement — Core Commitments</h3>
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      <li>The role is voluntary and unpaid; you are not an employee, commercial contractor, or sales agent.</li>
                      <li>You never pay to join, move up, or book shifts, and you never collect cash from participants.</li>
                      <li>You explain the Readiness Assessment honestly and never promise visas, funding, or guaranteed outcomes.</li>
                      <li>You strictly safeguard participant privacy and adhere to the Acxelerate Volunteer Code of Conduct.</li>
                      <li>Human reviewers — not automated algorithms — evaluate contributions, points, and certificates.</li>
                    </ul>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Full legal document:{" "}
                      <a href="/legal/volunteer-terms" className="font-semibold text-primary hover:underline">
                        Volunteer Terms of Service
                      </a>
                    </p>
                    <label className="mt-4 flex items-start gap-2.5 text-xs font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-0.5 rounded"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                      />
                      <span>I have read, understood, and accept the Acxelerate volunteer terms and integrity guidelines.</span>
                    </label>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        disabled={!agreed}
                        onClick={onAcceptAgreement}
                      >
                        Accept the Agreement & Generate Volunteer ID
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setShowAgreement(false)}>
                        Collapse
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <span className="text-xs font-semibold text-primary">Step 5: Volunteer Agreement Signature Pending</span>
                    <Button
                      size="sm"
                      onClick={() => setShowAgreement(true)}
                    >
                      Review & Accept Agreement
                    </Button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Verified Certificates & Public Credentials */}
        <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <Award className="size-5 text-primary" /> Verified Certificates & Credentials
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Official certificates issued upon verified milestone completion. Each carries an immutable verification ID.
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/certificates/verify/$code" params={{ code: "AXC-CERT-2026-BRZ01" }}>
                Verify Registry
              </Link>
            </Button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                  Track A Credential
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">AXC-CERT-2026-BRZ01</span>
              </div>
              <h3 className="mt-2 font-bold text-foreground">Bronze — Community Contributor</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Awarded for 5+ verified unique completions of the Global Readiness Assessment.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-muted-foreground">Issued: Oct 2026</span>
                <Link
                  to="/certificates/verify/$code"
                  params={{ code: "AXC-CERT-2026-BRZ01" }}
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  View Public Seal <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-secondary-foreground">
                  Track B Credential
                </span>
                <span className="text-[11px] font-mono text-muted-foreground">AXC-CERT-2026-LEAD01</span>
              </div>
              <h3 className="mt-2 font-bold text-foreground">Lead Ambassador Service Milestone</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Awarded for 30+ verified event service hours and leadership across 3 distinct events.
              </p>
              <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-border">
                <span className="text-muted-foreground">Issued: Oct 2026</span>
                <Link
                  to="/certificates/verify/$code"
                  params={{ code: "AXC-CERT-2026-LEAD01" }}
                  className="font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                  View Public Seal <ExternalLink className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Per-Post Social Recognition Consent Panel */}
        <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="size-5 text-primary" />
                <h2 className="text-lg font-bold">Public Achievement Recognition Consent</h2>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Under Acxelerate privacy rules, public recognition on LinkedIn or X requires your explicit consent for
                each specific post draft. Declining publicity will <strong>never</strong> revoke your points or certificates.
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                socialConsentState === "approved"
                  ? "bg-emerald-500/20 text-emerald-600"
                  : socialConsentState === "declined"
                  ? "bg-muted text-muted-foreground"
                  : "bg-amber-500/20 text-amber-600"
              }`}
            >
              {socialConsentState === "approved"
                ? "Consent Approved"
                : socialConsentState === "declined"
                ? "Declined (Private)"
                : "Consent Pending"}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-border bg-muted/60 p-4 text-xs">
            <p className="font-semibold text-foreground">Draft Post Preview for LinkedIn / Social:</p>
            <blockquote className="mt-1.5 italic text-muted-foreground border-l-2 border-primary pl-3">
              “Congratulations to {profile?.full_name ?? "our volunteer"} on achieving the Bronze Community Contributor
              milestone in the Acxelerate India Global Growth Ambassador program! Thank you for helping emerging founders and
              students assess global readiness.”
            </blockquote>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="text-xs"
              variant={socialConsentState === "approved" ? "secondary" : "default"}
              onClick={() => {
                setSocialConsentState("approved");
                toast.success("Consent granted for this specific achievement post.");
              }}
            >
              Approve This Post
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => {
                setSocialConsentState("declined");
                toast.info("Public posting declined. Your recognition remains private.");
              }}
            >
              Keep Recognition Private
            </Button>
          </div>
        </section>

        {/* Profile */}
        <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <UserRound className="size-5 text-primary" /> Your profile & track preference
          </h2>
          <form onSubmit={onSaveProfile} className="mt-4 grid gap-4 sm:grid-cols-2">
            <F label="Full name" required>
              <Input
                value={current.fullName}
                onChange={(e) => set("fullName", e.target.value)}
                required
              />
            </F>
            <F label="City" required>
              <Input
                value={current.city}
                onChange={(e) => set("city", e.target.value)}
                required
              />
            </F>
            <F label="Phone">
              <Input
                value={current.phone}
                onChange={(e) => set("phone", e.target.value)}
              />
            </F>
            <F label="Contribution Track Preference">
              <Select
                value={current.interests || "Track A & Track B"}
                onValueChange={(v) => set("interests", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Track A — Readiness Outreach">Track A: Readiness Outreach</SelectItem>
                  <SelectItem value="Track B — Events & Promotion">Track B: Events & Promotion</SelectItem>
                  <SelectItem value="Track A & Track B">Both Tracks (Track A & Track B)</SelectItem>
                </SelectContent>
              </Select>
            </F>
            <F label="Languages">
              <Input
                value={current.languages}
                onChange={(e) => set("languages", e.target.value)}
                placeholder="e.g. English, Hindi"
              />
            </F>
            <F label="Skills">
              <Input
                value={current.skills}
                onChange={(e) => set("skills", e.target.value)}
                placeholder="e.g. events, research, MSME outreach"
              />
            </F>
            <F label="Availability">
              <Input
                value={current.availability}
                onChange={(e) => set("availability", e.target.value)}
                placeholder="e.g. weekends, 4 hrs/week"
              />
            </F>
            <F label="Preferred format">
              <Select
                value={current.preferredFormat || "flexible"}
                onValueChange={(v) => set("preferredFormat", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </F>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="size-4 animate-spin" />}
                Save profile
              </Button>
            </div>
          </form>
        </section>

        {/* Outreach Activity Log Modal */}
        {showOutreachModal && (
          <Dialog open={showOutreachModal} onOpenChange={setShowOutreachModal}>
            <DialogContent className="max-w-lg glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Send className="size-5 text-primary" /> Log Outreach Activity (Track A)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Record daily outreach engagement. Eligible for 1 engagement point per verified day (max 5/week).
                  Do not collect or record prospects' private assessment answers.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmitOutreachLog} className="space-y-4 mt-2 text-sm">
                <div>
                  <Label className="text-xs font-semibold">Date of Activity</Label>
                  <Input
                    type="date"
                    value={outreachDate}
                    onChange={(e) => setOutreachDate(e.target.value)}
                    required
                    className="mt-1 h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Outreach Channel</Label>
                  <select
                    value={outreachChannel}
                    onChange={(e) => setOutreachChannel(e.target.value as any)}
                    className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="1_on_1_briefing">1-on-1 Briefing / Discussion</option>
                    <option value="campus_club_discussion">Campus / Student Club Discussion</option>
                    <option value="founder_meetup">Founder Meetup / Incubator</option>
                    <option value="industry_msme_network">Industry / MSME Network</option>
                    <option value="online_community">Online Community / Webinar</option>
                    <option value="social_direct_message">Professional Social / Direct Message</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold">Approximate Prospects Reached</Label>
                  <Input
                    type="number"
                    min="1"
                    max="500"
                    value={outreachCount}
                    onChange={(e) => setOutreachCount(e.target.value)}
                    required
                    className="mt-1 h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Brief Summary Note</Label>
                  <Textarea
                    placeholder="e.g. Shared assessment overview with 4 startup founders at university e-cell."
                    value={outreachNotes}
                    onChange={(e) => setOutreachNotes(e.target.value)}
                    required
                    className="mt-1 text-sm resize-none"
                    rows={3}
                  />
                </div>

                <div className="rounded-xl bg-tint p-3 text-xs text-muted-foreground">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={outreachAttest}
                      onChange={(e) => setOutreachAttest(e.target.checked)}
                      required
                    />
                    <span>
                      I attest that this outreach was conducted truthfully in compliance with Acxelerate anti-spam and privacy guidelines.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" onClick={() => setShowOutreachModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loggingOutreach}>
                    {loggingOutreach && <Loader2 className="size-4 animate-spin" />}
                    Submit Log
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Invite Volunteer Modal */}
        {showInviteModal && (
          <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
            <DialogContent className="max-w-md glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <UserPlus className="size-5 text-primary" /> Invite a Volunteer
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Share your personal invitation link. Help expand the Acxelerate global growth network.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="rounded-xl border border-border bg-card p-3">
                  <Label className="text-xs font-semibold text-muted-foreground">Your Volunteer Invite Link</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Input readOnly value={inviteUrl} className="font-mono text-xs h-9" />
                    <Button size="sm" onClick={copyInvite} className="h-9 shrink-0">
                      {copiedInvite ? <CheckIcon className="size-3.5" /> : <Copy className="size-3.5" />}
                      {copiedInvite ? "Copied" : "Copy"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl bg-tint p-3.5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                  <p className="font-bold text-foreground">Transparent Network Rule:</p>
                  <p>
                    • Invited volunteers must apply and be approved by the operations team.
                  </p>
                  <p>
                    • You earn <strong>3 non-cash Network Points</strong> after your invited peer completes onboarding and their first qualifying contribution.
                  </p>
                  <p>
                    • <strong>Strictly no cash commission, downlines, or sales overrides</strong> on recruited members.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <Button variant="outline" size="sm" onClick={() => setShowInviteModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}

function CheckStep({ done, label }: { done: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 className="size-4 shrink-0 text-primary" />
      ) : (
        <Circle className="size-4 shrink-0 text-muted-foreground" />
      )}
      <span className={done ? "" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}

function F({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

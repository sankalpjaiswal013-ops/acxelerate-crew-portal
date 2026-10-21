import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  GraduationCap,
  Info,
  MapPin,
  Search,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Board | Acxelerate India Volunteers" },
      {
        name: "description",
        content:
          "Browse central volunteer opportunities across Track A (Readiness Outreach) and Track B (Events & Promotion). Clear terms, verified recognition, fair access.",
      },
      { property: "og:title", content: "Acxelerate Volunteer Opportunities" },
      {
        property: "og:description",
        content:
          "Discover verified volunteer roles, outreach campaigns, and event co-hosting opportunities across India.",
      },
    ],
  }),
  component: OpportunitiesPage,
});

export interface Opportunity {
  id: string;
  title: string;
  track: "Track A — Readiness Outreach" | "Track B — Events & Promotion" | "Cross-Track & Operations";
  trackCode: "track-a" | "track-b" | "cross";
  topicFamily?: string;
  topicCode?: "T1" | "T2" | "T3" | "T4" | "T5";
  city: string;
  format: "Remote" | "On-Site" | "Hybrid";
  timeCommitment: string;
  benefitType:
    | "Non-cash Recognition & Points"
    | "Verified Service Hours & Badges"
    | "Learning & Community Access"
    | "Expense Reimbursed (Pre-approved)"
    | "Commission-eligible (under published terms)";
  benefitCategory: "points" | "hours" | "learning" | "reimbursed" | "commission";
  openings: number;
  deadline: string;
  summary: string;
  deliverables: string[];
  eligibility: string[];
}

export const OPPORTUNITIES_DATA: Opportunity[] = [
  {
    id: "opp-01",
    title: "Global Readiness Campus Ambassador",
    track: "Track A — Readiness Outreach",
    trackCode: "track-a",
    topicFamily: "T1: Global Readiness & Capability Gap Mapping",
    topicCode: "T1",
    city: "All Major Cities / Remote",
    format: "Hybrid",
    timeCommitment: "3–5 hours / week (Flexible)",
    benefitType: "Non-cash Recognition & Points",
    benefitCategory: "points",
    openings: 25,
    deadline: "Rolling intake",
    summary:
      "Introduce the official Acxelerate Global Readiness Assessment to college students, aspiring founders, and university clubs. Help peers evaluate international readiness with truthful, transparent guidance.",
    deliverables: [
      "Share your unique referral link (?ref=CODE) with suitable students and student startup clubs.",
      "Conduct 1-on-1 and small group briefings explaining the purpose of readiness gap mapping.",
      "Log truthful weekly outreach activity reports without collecting prospect assessment answers.",
      "Maintain respectful, spam-free communication aligned with the program Code of Conduct.",
    ],
    eligibility: [
      "Approved volunteer application and completed orientation.",
      "Enrolled student or recent graduate with active campus/alumni connections.",
      "Committed to honest, non-misleading representation of Acxelerate tools.",
    ],
  },
  {
    id: "opp-02",
    title: "Market Fitment Workshop Co-Host",
    track: "Track B — Events & Promotion",
    trackCode: "track-b",
    topicFamily: "T2: Country Fitment & Market Selection",
    topicCode: "T2",
    city: "Bengaluru",
    format: "On-Site",
    timeCommitment: "6 hours on event day + 2 hours prep",
    benefitType: "Verified Service Hours & Badges",
    benefitCategory: "hours",
    openings: 4,
    deadline: "10 Nov 2026",
    summary:
      "Support the delivery of a flagship workshop helping early-stage founders evaluate country demand, target competition, and market prioritization factors before expanding globally.",
    deliverables: [
      "Manage guest registration desk and verification check-in smoothly.",
      "Facilitate workshop interactive breakout tables during country evaluation exercises.",
      "Help the Event Lead collect attendance counts and submit post-event closeout documentation within 72 hours.",
    ],
    eligibility: [
      "Completed orientation and accepted volunteer agreement.",
      "Prior attendance or volunteering at at least 1 Acxelerate city event preferred.",
      "Good interpersonal and team coordination skills.",
    ],
  },
  {
    id: "opp-03",
    title: "Global Go-to-Market Case Study Researcher",
    track: "Track B — Events & Promotion",
    trackCode: "track-b",
    topicFamily: "T3: Global Go-to-Market & Expansion Strategy",
    topicCode: "T3",
    city: "Remote",
    format: "Remote",
    timeCommitment: "4 hours / week",
    benefitType: "Learning & Community Access",
    benefitCategory: "learning",
    openings: 6,
    deadline: "15 Nov 2026",
    summary:
      "Assist with gathering public market research, international entry models, and distributor case studies for approved Acxelerate knowledge briefs and volunteer session decks.",
    deliverables: [
      "Synthesise approved open-source market entry case studies (India to UAE, UK, US, SEA).",
      "Draft concise summaries of regulatory and channel partner considerations.",
      "Present key learnings during the monthly regional volunteer roundtable.",
    ],
    eligibility: [
      "Active volunteer with strong secondary research and analytical writing skills.",
      "Interest in cross-border trade, economics, or international business.",
    ],
  },
  {
    id: "opp-04",
    title: "Cross-Border Trade & Regulatory Outreach Facilitator",
    track: "Track B — Events & Promotion",
    trackCode: "track-b",
    topicFamily: "T4: Cross-Border Operations, Regulation, Culture & Localisation",
    topicCode: "T4",
    city: "Mumbai",
    format: "Hybrid",
    timeCommitment: "5 hours / week",
    benefitType: "Verified Service Hours & Badges",
    benefitCategory: "hours",
    openings: 3,
    deadline: "18 Nov 2026",
    summary:
      "Facilitate knowledge exchange sessions focused on cultural adaptation, regulatory awareness, and export compliance for MSMEs and emerging exporters.",
    deliverables: [
      "Coordinate venue logistics and speaker briefing in accordance with the 5 approved topic guidelines.",
      "Ensure all session posters carry required brand disclaimers (information only; not legal/tax advice).",
      "Record attendee feedback and file complete closeout report within 72 hours.",
    ],
    eligibility: [
      "Must have completed Orientation and Volunteer Terms acceptance.",
      "Background in commerce, law, business administration, or logistics is a plus.",
    ],
  },
  {
    id: "opp-05",
    title: "MSME Readiness Outreach Specialist",
    track: "Track A — Readiness Outreach",
    trackCode: "track-a",
    topicFamily: "T1: Global Readiness & Capability Gap Mapping",
    topicCode: "T1",
    city: "Delhi NCR / Pune / Remote",
    format: "Hybrid",
    timeCommitment: "4–6 hours / week",
    benefitType: "Commission-eligible (under published terms)",
    benefitCategory: "commission",
    openings: 10,
    deadline: "Rolling intake",
    summary:
      "Connect manufacturing and service MSMEs with the official Acxelerate Readiness Assessment. Help business owners benchmark international gaps and connect to expansion roadmaps.",
    deliverables: [
      "Engage local industry associations, industrial estates, and trade networks respectfully.",
      "Guide business owners to take the online assessment using your unique attribution link.",
      "Follow up with consent-based guidance. Strictly no aggressive selling or unauthorized fee collection.",
    ],
    eligibility: [
      "Minimum 30 days active volunteer status or proven professional outreach experience.",
      "Must review and sign the separate Assessment Referral Policy addendum.",
      "Zero tolerance for misleading claims or unauthorized outcome guarantees.",
    ],
  },
  {
    id: "opp-06",
    title: "City Chapter Listing Coordinator",
    track: "Cross-Track & Operations",
    trackCode: "cross",
    city: "Hyderabad / Chennai / Ahmedabad",
    format: "Hybrid",
    timeCommitment: "4 hours / week",
    benefitType: "Non-cash Recognition & Points",
    benefitCategory: "points",
    openings: 3,
    deadline: "25 Nov 2026",
    summary:
      "Support the City Chapter Coordinator in drafting event listings, checking duplicate topics (ensuring compliance with the 10-events/month city cap), and managing volunteer task rotations.",
    deliverables: [
      "Review incoming event proposals against the 5 approved topic families.",
      "Perform candidate duplicate check for events within the previous 30 days.",
      "Ensure fair rotation of event lead and co-host assignments among new volunteers.",
    ],
    eligibility: [
      "Active volunteer for at least 60 days with verified Track A or Track B contributions.",
      "Nominated or approved by Program Operations.",
      "Demonstrated impartiality and commitment to non-hierarchical community governance.",
    ],
  },
];

function OpportunitiesPage() {
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState<string>("all");
  const [formatFilter, setFormatFilter] = useState<string>("all");
  const [benefitFilter, setBenefitFilter] = useState<string>("all");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [appliedOpps, setAppliedOpps] = useState<Record<string, boolean>>({});

  const filtered = OPPORTUNITIES_DATA.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.summary.toLowerCase().includes(search.toLowerCase());
    const matchesTrack =
      trackFilter === "all" ||
      (trackFilter === "track-a" && o.trackCode === "track-a") ||
      (trackFilter === "track-b" && o.trackCode === "track-b") ||
      (trackFilter === "cross" && o.trackCode === "cross");
    const matchesFormat =
      formatFilter === "all" || o.format.toLowerCase() === formatFilter.toLowerCase();
    const matchesBenefit =
      benefitFilter === "all" || o.benefitCategory === benefitFilter;

    return matchesSearch && matchesTrack && matchesFormat && matchesBenefit;
  });

  const handleApply = (opp: Opportunity) => {
    setAppliedOpps((prev) => ({ ...prev, [opp.id]: true }));
    toast.success(`Interest registered for "${opp.title}". The operations team will review your profile.`);
    setSelectedOpp(null);
  };

  return (
    <div className="min-h-screen glass-shell">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-28 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl">
          <Badge variant="outline" className="border-primary/40 bg-tint px-3 py-1 text-xs font-semibold text-primary">
            Central Opportunity Board
          </Badge>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Volunteer Opportunities & Callouts
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            One central opportunity board with clear terms and verified recognition.
            Browse opportunities across <strong>Track A (Readiness Outreach)</strong> and{" "}
            <strong>Track B (Events & Promotion)</strong>. Every role clearly discloses its
            commitment and benefit type. No recruitment commissions, no downlines, and fair access
            for every volunteer.
          </p>
        </div>

        {/* Operating Principles Bar */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl glass-panel p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <CheckCircle2 className="size-4 text-primary" /> Transparent Benefit Types
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Clear disclosure whether a role is unpaid learning, verified service points, expense-reimbursed, or commission-eligible.
            </p>
          </div>
          <div className="rounded-2xl glass-panel p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Target className="size-4 text-primary" /> Two Distinct Tracks
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Track A drives official Readiness Assessment completions. Track B delivers approved globalisation events under 5 controlled themes.
            </p>
          </div>
          <div className="rounded-2xl glass-panel p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Users className="size-4 text-primary" /> Fair Democratic Access
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Centralised postings accessible by all approved volunteers, not restricted to any personal coordinator or local college circle.
            </p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-10 rounded-2xl glass-panel p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by role title, city, or keyword..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 pl-10 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-muted-foreground">
                <Filter className="size-3.5" /> Filters:
              </span>
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Tracks</option>
                <option value="track-a">Track A (Readiness)</option>
                <option value="track-b">Track B (Events)</option>
                <option value="cross">Cross-Track</option>
              </select>

              <select
                value={formatFilter}
                onChange={(e) => setFormatFilter(e.target.value)}
                className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Formats</option>
                <option value="remote">Remote</option>
                <option value="on-site">On-Site</option>
                <option value="hybrid">Hybrid</option>
              </select>

              <select
                value={benefitFilter}
                onChange={(e) => setBenefitFilter(e.target.value)}
                className="h-9 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Benefit Types</option>
                <option value="points">Non-cash Points</option>
                <option value="hours">Service Hours & Badges</option>
                <option value="learning">Learning & Access</option>
                <option value="reimbursed">Expense Reimbursed</option>
                <option value="commission">Commission-eligible (published terms)</option>
              </select>

              {(search || trackFilter !== "all" || formatFilter !== "all" || benefitFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 text-xs"
                  onClick={() => {
                    setSearch("");
                    setTrackFilter("all");
                    setFormatFilter("all");
                    setBenefitFilter("all");
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filtered.length} of {OPPORTUNITIES_DATA.length} opportunities</span>
            <span>Rolling application review</span>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl glass-panel p-12 text-center">
              <Briefcase className="mx-auto size-12 text-muted-foreground/60" />
              <h3 className="mt-4 text-lg font-bold">No matching opportunities found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Try loosening your search filters or check back as new campaigns and events are posted.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch("");
                  setTrackFilter("all");
                  setFormatFilter("all");
                  setBenefitFilter("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((opp) => {
                const isApplied = !!appliedOpps[opp.id];
                return (
                  <article
                    key={opp.id}
                    className="flex flex-col justify-between rounded-2xl glass-panel p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            opp.trackCode === "track-a"
                              ? "bg-primary/15 text-primary border border-primary/30"
                              : opp.trackCode === "track-b"
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {opp.trackCode === "track-a" ? "Track A" : opp.trackCode === "track-b" ? "Track B" : "Cross-Track"}
                        </span>
                        {opp.topicCode && (
                          <span className="rounded-full bg-tint px-2.5 py-0.5 text-xs font-semibold text-foreground">
                            {opp.topicCode}
                          </span>
                        )}
                        <span className="ml-auto rounded-full bg-muted/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                          {opp.format}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="mt-3 text-lg font-bold leading-snug">{opp.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                        {opp.summary}
                      </p>

                      {/* Metadata */}
                      <div className="mt-4 space-y-1.5 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <MapPin className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{opp.city}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <Clock className="size-3.5 text-primary shrink-0" />
                          <span>{opp.timeCommitment}</span>
                        </p>
                        <p className="flex items-center gap-2 font-medium text-foreground">
                          <Sparkles className="size-3.5 text-primary shrink-0" />
                          <span className="truncate">{opp.benefitType}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 flex-1 text-xs"
                        onClick={() => setSelectedOpp(opp)}
                      >
                        View Details
                      </Button>
                      <Button
                        size="sm"
                        className="h-9 flex-1 text-xs"
                        disabled={isApplied}
                        onClick={() => handleApply(opp)}
                      >
                        {isApplied ? "Applied ✓" : "Express Interest"}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Governance Disclosure */}
        <div className="mt-14 rounded-2xl border border-dashed border-border bg-card/60 p-6 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Democratic Governance & Equal Access</p>
              <p className="mt-1 text-xs leading-relaxed">
                All approved Acxelerate ambassadors have equal access to apply for opportunities regardless of which coordinator
                or city they joined through. Event volunteering is optional for base volunteers; doing no events does not erase
                valid Track A readiness points. Commissions, where applicable, require verified paid order confirmation and formal
                policy approval.
              </p>
            </div>
          </div>
        </div>

        {/* Opportunity Detail Modal */}
        {selectedOpp && (
          <Dialog open={!!selectedOpp} onOpenChange={(open) => !open && setSelectedOpp(null)}>
            <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto glass-panel">
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{selectedOpp.track}</Badge>
                  {selectedOpp.topicCode && <Badge>{selectedOpp.topicCode}</Badge>}
                  <Badge variant="secondary">{selectedOpp.format}</Badge>
                </div>
                <DialogTitle className="mt-2 text-2xl font-bold">{selectedOpp.title}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Location: {selectedOpp.city} · Time commitment: {selectedOpp.timeCommitment}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-foreground">Role Overview</h4>
                  <p className="mt-1 text-muted-foreground leading-relaxed">{selectedOpp.summary}</p>
                </div>

                {selectedOpp.topicFamily && (
                  <div className="rounded-xl bg-tint p-3 text-xs">
                    <span className="font-semibold text-foreground">Approved Globalisation Topic Family:</span>{" "}
                    <span className="text-muted-foreground">{selectedOpp.topicFamily}</span>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-foreground">Key Deliverables</h4>
                  <ul className="mt-2 space-y-1.5 list-disc pl-5 text-muted-foreground">
                    {selectedOpp.deliverables.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground">Eligibility & Prerequisites</h4>
                  <ul className="mt-2 space-y-1.5 list-disc pl-5 text-muted-foreground">
                    {selectedOpp.eligibility.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-muted/60 p-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" /> Transparent Benefit Terms
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    <strong>Benefit type:</strong> {selectedOpp.benefitType}.
                    <br />
                    Recognition, points, and service certificates are verified by the program team. There are strictly no
                    recruitment commissions, downlines, or unapproved promises.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button variant="ghost" onClick={() => setSelectedOpp(null)}>
                  Close
                </Button>
                <Button
                  disabled={!!appliedOpps[selectedOpp.id]}
                  onClick={() => handleApply(selectedOpp)}
                >
                  {appliedOpps[selectedOpp.id] ? "Already Applied ✓" : "Express Interest for Role"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

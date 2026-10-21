import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coins,
  FileCheck2,
  FileText,
  Info,
  Loader2,
  Lock,
  MapPin,
  Plus,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  cancelShiftSignup,
  listShifts,
  signupForShift,
  proposeVolunteerEvent,
  requestEventBudget,
  submitEventCloseout,
} from "@/lib/crew.functions";
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
import logo from "@/assets/acxelerate-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/shifts")({
  head: () => ({
    meta: [{ title: "Shift Board & Events — Acxelerate India" }],
  }),
  component: ShiftsPage,
});

const ROLE_TYPES = [
  "general",
  "hosting",
  "registration",
  "logistics",
  "content",
  "research",
  "outreach",
];

const TOPIC_FAMILIES = [
  { code: "ALL", label: "All Topics" },
  { code: "T1", label: "T1: Readiness Gap Mapping" },
  { code: "T2", label: "T2: Country Fitment" },
  { code: "T3", label: "T3: Go-to-Market Strategy" },
  { code: "T4", label: "T4: Cross-Border & Regulation" },
  { code: "T5", label: "T5: Global Partnerships" },
];

function getTopicCode(title: string, desc?: string | null): string {
  const text = `${title} ${desc ?? ""}`.toLowerCase();
  if (text.includes("fitment") || text.includes("market selection") || text.includes("country")) return "T2";
  if (text.includes("gtm") || text.includes("go-to-market") || text.includes("expansion")) return "T3";
  if (text.includes("regulatory") || text.includes("cross-border") || text.includes("regulation") || text.includes("culture")) return "T4";
  if (text.includes("partnership") || text.includes("ecosystem") || text.includes("incubator")) return "T5";
  return "T1";
}

function ShiftsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["shifts"],
    queryFn: () => listShifts(),
  });
  const signup = useServerFn(signupForShift);
  const cancel = useServerFn(cancelShiftSignup);
  const doPropose = useServerFn(proposeVolunteerEvent);
  const doBudget = useServerFn(requestEventBudget);
  const doCloseout = useServerFn(submitEventCloseout);

  const [role, setRole] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState("ALL");

  // Proposal Modal State
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [proposing, setProposing] = useState(false);
  const [propForm, setPropForm] = useState({
    title: "",
    topicFamily: "T1" as "T1" | "T2" | "T3" | "T4" | "T5",
    subtopic: "",
    objective: "",
    audience: "Students and early founders",
    format: "on-site" as "on-site" | "online" | "hybrid",
    city: "Bengaluru",
    location: "",
    startsAt: "",
    endsAt: "",
    capacity: "30",
    budgetNeeded: false,
  });

  // Budget Modal State
  const [showBudgetModal, setShowBudgetModal] = useState<string | null>(null);
  const [budgetAmount, setBudgetAmount] = useState("5000");
  const [budgetBreakdown, setBudgetBreakdown] = useState("");
  const [budgetVendor, setBudgetVendor] = useState("");
  const [budgetAccepted, setBudgetAccepted] = useState(false);
  const [submittingBudget, setSubmittingBudget] = useState(false);

  // Closeout Modal State
  const [showCloseoutModal, setShowCloseoutModal] = useState<string | null>(null);
  const [closeoutAttendance, setCloseoutAttendance] = useState("25");
  const [closeoutReport, setCloseoutReport] = useState("");
  const [closeoutLinks, setCloseoutLinks] = useState("");
  const [submittingCloseout, setSubmittingCloseout] = useState(false);

  async function join(eventId: string) {
    setBusy(eventId);
    try {
      await signup({ data: { eventId, roleType: role[eventId] ?? "general" } });
      toast.success("You're signed up. The team will confirm details.");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't sign you up.");
    } finally {
      setBusy(null);
    }
  }

  async function leave(eventId: string) {
    setBusy(eventId);
    try {
      await cancel({ data: { eventId } });
      toast.success("Signup cancelled.");
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't cancel.");
    } finally {
      setBusy(null);
    }
  }

  // Duplicate Check logic for proposals
  const isDuplicateSuspected =
    data?.events?.some((e) => {
      const topicMatches = getTopicCode(e.title, e.description) === propForm.topicFamily;
      const cityMatches = e.city.toLowerCase().trim() === propForm.city.toLowerCase().trim();
      return topicMatches && cityMatches;
    }) ?? false;

  async function onSubmitProposal(e: React.FormEvent) {
    e.preventDefault();
    setProposing(true);
    try {
      await doPropose({
        data: {
          title: propForm.title,
          topicFamily: propForm.topicFamily,
          subtopic: propForm.subtopic || propForm.title,
          objective: propForm.objective || "Introduce attendees to global readiness concepts.",
          audience: propForm.audience,
          format: propForm.format,
          city: propForm.city,
          location: propForm.location,
          startsAt: propForm.startsAt || new Date(Date.now() + 7 * 86400e3).toISOString(),
          endsAt: propForm.endsAt || undefined,
          capacity: parseInt(propForm.capacity, 10) || 30,
          budgetNeeded: propForm.budgetNeeded,
        },
      });
      toast.success("Event proposal submitted for Program Operations review.");
      setShowProposeModal(false);
      setPropForm({
        title: "",
        topicFamily: "T1",
        subtopic: "",
        objective: "",
        audience: "Students and early founders",
        format: "on-site",
        city: "Bengaluru",
        location: "",
        startsAt: "",
        endsAt: "",
        capacity: "30",
        budgetNeeded: false,
      });
      queryClient.invalidateQueries({ queryKey: ["shifts"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit proposal.");
    } finally {
      setProposing(false);
    }
  }

  async function onSubmitBudget(e: React.FormEvent) {
    e.preventDefault();
    if (!showBudgetModal) return;
    if (!budgetAccepted) {
      toast.error("Please accept the budget declaration.");
      return;
    }
    setSubmittingBudget(true);
    try {
      await doBudget({
        data: {
          eventId: showBudgetModal,
          amountInr: parseInt(budgetAmount, 10) || 1000,
          breakdown: budgetBreakdown,
          vendorQuotes: budgetVendor || undefined,
          declarationAccepted: true,
        },
      });
      toast.success("Budget request submitted for Finance review. Spending is not authorized until written approval.");
      setShowBudgetModal(null);
      setBudgetBreakdown("");
      setBudgetVendor("");
      setBudgetAccepted(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit budget request.");
    } finally {
      setSubmittingBudget(false);
    }
  }

  async function onSubmitCloseout(e: React.FormEvent) {
    e.preventDefault();
    if (!showCloseoutModal) return;
    setSubmittingCloseout(true);
    try {
      await doCloseout({
        data: {
          eventId: showCloseoutModal,
          attendanceCount: parseInt(closeoutAttendance, 10) || 10,
          outcomesReport: closeoutReport,
          evidenceLinks: closeoutLinks || undefined,
        },
      });
      toast.success("Event closeout submitted (+3 timeliness points queued for review).");
      setShowCloseoutModal(null);
      setCloseoutReport("");
      setCloseoutLinks("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't submit closeout.");
    } finally {
      setSubmittingCloseout(false);
    }
  }

  const allEvents = data?.events ?? [];
  const filteredEvents = allEvents.filter((e) => {
    if (selectedTopic === "ALL") return true;
    return getTopicCode(e.title, e.description) === selectedTopic;
  });

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground">Track B — Events & Promotion</p>
            <h1 className="mt-1 text-3xl font-bold">Shift Board & Event Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign up for event shifts or propose approved sessions. Shifts verified within 7 days build your tier and Passport.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowProposeModal(true)} className="shrink-0">
            <Plus className="size-4" /> Propose an Event
          </Button>
        </div>

        {/* 5 Approved Topics Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {TOPIC_FAMILIES.map((t) => (
            <button
              key={t.code}
              onClick={() => setSelectedTopic(t.code)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                selectedTopic === t.code
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border border-border bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <Loader2 className="mt-10 size-8 animate-spin text-primary" />
        )}

        <div className="mt-6 space-y-4">
          {filteredEvents.map((e) => {
            const topic = getTopicCode(e.title, e.description);
            return (
              <div
                key={e.id}
                className="rounded-2xl glass-panel p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
                        {topic} · Approved Topic
                      </span>
                      <span className="text-xs text-muted-foreground">{e.city}</span>
                    </div>

                    <h2 className="mt-2 text-lg font-bold">{e.title}</h2>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-primary" />
                        {new Date(e.starts_at).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-primary" />
                        {e.city}
                        {e.location ? ` — ${e.location}` : ""}
                      </span>
                      {e.capacity && (
                        <span className="flex items-center gap-1.5">
                          <Users className="size-4 text-primary" /> {e.capacity} spots
                        </span>
                      )}
                    </div>
                    {e.description && (
                      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                        {e.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {e.myStatus && e.myStatus !== "cancelled" ? (
                      <>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                          {e.myStatus === "completed"
                            ? "Hours verified"
                            : "Signed up"}
                        </span>
                        {e.myStatus === "signed_up" && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={busy === e.id}
                              onClick={() => leave(e.id)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => setShowCloseoutModal(e.id)}
                            >
                              <FileCheck2 className="size-3.5" /> Closeout
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select
                          value={role[e.id] ?? "general"}
                          onValueChange={(v) => setRole((r) => ({ ...r, [e.id]: v }))}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_TYPES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          disabled={busy === e.id}
                          onClick={() => join(e.id)}
                        >
                          {busy === e.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            "Sign up"
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Quick Budget action */}
                    <button
                      onClick={() => setShowBudgetModal(e.id)}
                      className="mt-1 text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <Coins className="size-3" /> Apply for Budget
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {data && filteredEvents.length === 0 && (
            <p className="rounded-xl glass-panel p-6 text-sm text-muted-foreground text-center">
              No shifts match this topic filter. Propose an event or clear filters to view upcoming shifts.
            </p>
          )}
        </div>

        {/* Governance note */}
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/60 p-5 text-xs text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground">City Target & Quality Controls (Track B Governance)</p>
          <p className="mt-1">
            Official Acxelerate events are capped at <strong>10 events per city per month</strong> across central and
            volunteer-led sessions. Events must fall under one of the 5 approved globalisation topic families.
            Participation in events is voluntary for base volunteers and does not affect your Track A readiness points.
          </p>
        </div>

        {/* Propose Event Modal */}
        {showProposeModal && (
          <Dialog open={showProposeModal} onOpenChange={setShowProposeModal}>
            <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" /> Submit Event Proposal (Track B)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Propose an official Acxelerate event under one of the five approved globalisation topic families.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmitProposal} className="space-y-4 mt-2 text-sm">
                <div>
                  <Label className="text-xs font-semibold">Event Title</Label>
                  <Input
                    placeholder="e.g. Founder Readiness & Capability Gap Workshop"
                    value={propForm.title}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold">Approved Topic Family</Label>
                    <select
                      value={propForm.topicFamily}
                      onChange={(e) => setPropForm({ ...propForm, topicFamily: e.target.value as any })}
                      className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="T1">T1: Readiness & Capability Gaps</option>
                      <option value="T2">T2: Country Fitment & Selection</option>
                      <option value="T3">T3: Go-to-Market Strategy</option>
                      <option value="T4">T4: Cross-Border & Regulation</option>
                      <option value="T5">T5: Global Partnerships & Ecosystem</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">City Chapter</Label>
                    <Input
                      value={propForm.city}
                      onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                      required
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                {isDuplicateSuspected && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Candidate Duplicate Check Notice</p>
                      <p className="mt-0.5">
                        A similar topic event already exists in {propForm.city} for {propForm.topicFamily}.
                        Your proposal will require special approval by Program Operations.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-xs font-semibold">Learning Objective & Outcome</Label>
                  <Textarea
                    placeholder="What will attendees learn? e.g. Understanding readiness benchmarks before international expansion."
                    value={propForm.objective}
                    onChange={(e) => setPropForm({ ...propForm, objective: e.target.value })}
                    required
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold">Format</Label>
                    <select
                      value={propForm.format}
                      onChange={(e) => setPropForm({ ...propForm, format: e.target.value as any })}
                      className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="on-site">On-Site (In-person)</option>
                      <option value="online">Online / Webinar</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Target Audience</Label>
                    <Input
                      value={propForm.audience}
                      onChange={(e) => setPropForm({ ...propForm, audience: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-semibold">Proposed Date & Time</Label>
                    <Input
                      type="datetime-local"
                      value={propForm.startsAt}
                      onChange={(e) => setPropForm({ ...propForm, startsAt: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold">Venue / Campus or Online Link</Label>
                    <Input
                      placeholder="e.g. Innovation Hub / Google Meet"
                      value={propForm.location}
                      onChange={(e) => setPropForm({ ...propForm, location: e.target.value })}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-tint p-3 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-foreground">
                    <input
                      type="checkbox"
                      checked={propForm.budgetNeeded}
                      onChange={(e) => setPropForm({ ...propForm, budgetNeeded: e.target.checked })}
                    />
                    <span>Budget funding will be requested for this event</span>
                  </label>
                  <p className="mt-1 pl-5 text-[11px]">
                    Note: Concept approval does not guarantee funding. Budget requests are reviewed separately by Finance.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setShowProposeModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={proposing}>
                    {proposing && <Loader2 className="size-4 animate-spin" />}
                    Submit Proposal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Apply for Budget Modal */}
        {showBudgetModal && (
          <Dialog open={!!showBudgetModal} onOpenChange={(open) => !open && setShowBudgetModal(null)}>
            <DialogContent className="max-w-md glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <Coins className="size-5 text-primary" /> Apply for Event Budget
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Submit itemised expense estimates for Finance review.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmitBudget} className="space-y-4 mt-2 text-sm">
                <div>
                  <Label className="text-xs font-semibold">Total Amount Requested (INR)</Label>
                  <Input
                    type="number"
                    min="500"
                    max="100000"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                    className="mt-1 h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Itemised Breakdown & Purpose</Label>
                  <Textarea
                    placeholder="e.g. Venue booking: ₹3,000, A/V & projector: ₹1,500, Printing materials: ₹500"
                    value={budgetBreakdown}
                    onChange={(e) => setBudgetBreakdown(e.target.value)}
                    required
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Vendor / Venue Details</Label>
                  <Input
                    placeholder="Vendor quote reference or link"
                    value={budgetVendor}
                    onChange={(e) => setBudgetVendor(e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>

                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-foreground">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={budgetAccepted}
                      onChange={(e) => setBudgetAccepted(e.target.checked)}
                      required
                    />
                    <span>
                      <strong>Mandatory Financial Declaration:</strong> I understand that submitting this request is
                      NOT authorization to spend. Spending is not authorised until formal written approval is received
                      from Finance.
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setShowBudgetModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingBudget}>
                    {submittingBudget && <Loader2 className="size-4 animate-spin" />}
                    Submit Budget Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}

        {/* Submit Closeout Modal */}
        {showCloseoutModal && (
          <Dialog open={!!showCloseoutModal} onOpenChange={(open) => !open && setShowCloseoutModal(null)}>
            <DialogContent className="max-w-md glass-panel">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                  <FileCheck2 className="size-5 text-primary" /> Submit Event Closeout (72h Deadline)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  File actual attendance and brief outcomes report to verify event hours and earn timeliness points (+3 pts).
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={onSubmitCloseout} className="space-y-4 mt-2 text-sm">
                <div>
                  <Label className="text-xs font-semibold">Actual Attendee Count</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5000"
                    value={closeoutAttendance}
                    onChange={(e) => setCloseoutAttendance(e.target.value)}
                    required
                    className="mt-1 h-10"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Summary Outcomes & Learnings</Label>
                  <Textarea
                    placeholder="Brief report of how the session went, key discussion points, and Readiness Assessment CTA results."
                    value={closeoutReport}
                    onChange={(e) => setCloseoutReport(e.target.value)}
                    required
                    className="mt-1 resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold">Evidence / Photos Drive Link (Optional)</Label>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={closeoutLinks}
                    onChange={(e) => setCloseoutLinks(e.target.value)}
                    className="mt-1 h-10"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <Button type="button" variant="ghost" onClick={() => setShowCloseoutModal(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submittingCloseout}>
                    {submittingCloseout && <Loader2 className="size-4 animate-spin" />}
                    Submit Closeout Report
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
}

export function PortalHeader() {
  const [isDemo, setIsDemo] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email === "demo.volunteer@acxelerate.in") setIsDemo(true);
    });
  }, []);
  return (
    <header className="glass-nav sticky top-0 z-30">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <img src={logo.url} alt="Acxelerate India" className="h-9 w-auto" />
          {isDemo && (
            <span className="rounded-full border border-primary/40 bg-tint px-2.5 py-0.5 text-xs font-semibold text-primary">
              Demo account
            </span>
          )}
        </a>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Button asChild variant="ghost" size="sm">
            <a href="/dashboard">Dashboard</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/opportunities">Opportunities</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/shifts">Shifts</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/passport">Passport</a>
          </Button>
          <Button asChild variant="ghost" size="sm">
            <a href="/referrals">Referrals</a>
          </Button>
        </nav>
      </div>
    </header>
  );
}

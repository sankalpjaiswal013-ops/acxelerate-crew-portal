import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Activity,
  AlertCircle,
  Award,
  BadgeAlert,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Coins,
  Crown,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  History,
  IndianRupee,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getAdminOverviewStats, getAdminQueueData, executeAdminAction } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Operations Control Console — Acxelerate India" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminControlCenter,
});

type QueueTab =
  | "overview"
  | "applications"
  | "attributions"
  | "points"
  | "events"
  | "budgets"
  | "commissions"
  | "reimbursements"
  | "leadership"
  | "audit";

function AdminControlCenter() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => getAdminOverviewStats(),
  });

  const { data: queueData, isLoading: queueLoading } = useQuery({
    queryKey: ["admin-queue-data"],
    queryFn: () => getAdminQueueData(),
  });

  const doAction = useServerFn(executeAdminAction);

  // Active tab state
  const [activeTab, setActiveTab] = useState<QueueTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Inspection Drawer & Confirmation States
  const [selectedItem, setSelectedItem] = useState<{ type: string; data: any } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    actionType: string;
    targetId: string;
    actionName: string;
    needsNotes?: boolean;
    needsCode?: boolean;
    needsReasonCategory?: boolean;
  }>({
    open: false,
    title: "",
    description: "",
    actionType: "",
    targetId: "",
    actionName: "",
  });

  const [actionNotes, setActionNotes] = useState("");
  const [reassignCode, setReassignCode] = useState("");
  const [reasonCategory, setReasonCategory] = useState("unmet_eligibility");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Manual point adjustment modal state
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [adjVolunteerId, setAdjVolunteerId] = useState("");
  const [adjPoints, setAdjPoints] = useState("10");
  const [adjReason, setAdjReason] = useState("");

  async function handleConfirmAction() {
    setSubmittingAction(true);
    try {
      await doAction({
        data: {
          targetType: confirmDialog.actionType as any,
          targetId: confirmDialog.targetId,
          action: confirmDialog.actionName,
          notes: actionNotes,
          reassignedCode: reassignCode || undefined,
          reasonCategory: confirmDialog.needsReasonCategory ? reasonCategory : undefined,
        },
      });
      toast.success(`Action successfully executed: ${confirmDialog.actionName.toUpperCase()}`);
      setConfirmDialog({ ...confirmDialog, open: false });
      setSelectedItem(null);
      setActionNotes("");
      setReassignCode("");
      setReasonCategory("unmet_eligibility");
      queryClient.invalidateQueries({ queryKey: ["admin-queue-data"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed. Check staff authorization.");
    } finally {
      setSubmittingAction(false);
    }
  }

  async function handleManualAdjustment(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingAction(true);
    try {
      await doAction({
        data: {
          targetType: "adjustment",
          targetId: adjVolunteerId || "vol-demo",
          action: "manual_adjustment",
          pointsDelta: parseInt(adjPoints, 10) || 10,
          notes: adjReason,
        },
      });
      toast.success("Manual points adjustment recorded with audit log.");
      setShowAdjustmentModal(false);
      setAdjReason("");
      queryClient.invalidateQueries({ queryKey: ["admin-queue-data"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Adjustment failed.");
    } finally {
      setSubmittingAction(false);
    }
  }

  if (statsLoading || queueLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center glass-shell">
        <div className="text-center space-y-3">
          <Loader2 className="size-8 animate-spin text-primary mx-auto" />
          <p className="text-xs font-semibold text-muted-foreground">Authorizing staff credentials...</p>
        </div>
      </div>
    );
  }

  const applications = queueData?.applications ?? [];
  const attributions = queueData?.attributions ?? [];
  const points = queueData?.points ?? [];
  const events = queueData?.events ?? [];
  const budgets = queueData?.budgets ?? [];
  const reimbursements = queueData?.reimbursements ?? [];
  const leadershipNominations = queueData?.leadershipNominations ?? [];
  const commissions = queueData?.commissions ?? [];
  const auditLogs = queueData?.auditLogs ?? [];

  return (
    <div className="min-h-screen glass-shell">
      {/* Top Admin Header Bar */}
      <header className="glass-nav sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center">
              <img src="/acxelerate-logo.png" alt="Acxelerate India" className="h-9 w-auto object-contain" />
            </a>
            <div className="hidden sm:block h-5 w-px bg-border" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-500">
                Staff Admin Console
              </span>
              <span className="text-xs text-muted-foreground">Server-Authorized · RLS Guarded</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdjustmentModal(true)}
              className="text-xs h-8"
            >
              <Coins className="size-3.5" /> Adjust Points
            </Button>
            <Button asChild variant="outline" size="sm" className="text-xs h-8">
              <Link to="/dashboard">Volunteer View</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-8"
              onClick={() => navigate({ to: "/dashboard" })}
            >
              <LogOut className="size-3.5" /> Exit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Interactive KPI Metrics Banner (Clicking card switches to filtered queue!) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {/* Card 1: Applications */}
          <button
            onClick={() => {
              setActiveTab("applications");
              setStatusFilter("submitted");
            }}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "applications"
                ? "bg-primary/15 border-primary shadow-xs ring-1 ring-primary/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Apps Pending</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">{stats?.pendingApplications ?? 0}</span>
              <UserPlus className="size-4 text-primary" />
            </div>
          </button>

          {/* Card 2: Attributions */}
          <button
            onClick={() => {
              setActiveTab("attributions");
              setStatusFilter("pending_attribution");
            }}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "attributions"
                ? "bg-purple-500/15 border-purple-500 shadow-xs ring-1 ring-purple-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Attribution Discrepancies</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-purple-600">{stats?.unassignedAttributions ?? 0}</span>
              <Target className="size-4 text-purple-600" />
            </div>
          </button>

          {/* Card 3: Points Verification */}
          <button
            onClick={() => {
              setActiveTab("points");
              setStatusFilter("pending");
            }}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "points"
                ? "bg-amber-500/15 border-amber-500 shadow-xs ring-1 ring-amber-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Points Review</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-500">{stats?.pendingPoints ?? 0}</span>
              <Coins className="size-4 text-amber-500" />
            </div>
          </button>

          {/* Card 4: Events Cap */}
          <button
            onClick={() => setActiveTab("events")}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "events"
                ? "bg-blue-500/15 border-blue-500 shadow-xs ring-1 ring-blue-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Events</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-blue-600">{stats?.activeEvents ?? 0}</span>
              <Calendar className="size-4 text-blue-600" />
            </div>
          </button>

          {/* Card 5: Budgets */}
          <button
            onClick={() => {
              setActiveTab("budgets");
              setStatusFilter("pending");
            }}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "budgets"
                ? "bg-emerald-500/15 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Budget Req</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">{stats?.pendingBudgets ?? 0}</span>
              <IndianRupee className="size-4 text-emerald-600" />
            </div>
          </button>

          {/* Card 6: Reimbursements */}
          <button
            onClick={() => {
              setActiveTab("reimbursements");
              setStatusFilter("pending");
            }}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "reimbursements"
                ? "bg-amber-600/15 border-amber-600 shadow-xs ring-1 ring-amber-600/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Expense Claims</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{stats?.pendingReimbursements ?? 0}</span>
              <FileCheck2 className="size-4 text-amber-600" />
            </div>
          </button>

          {/* Card 7: Leadership */}
          <button
            onClick={() => setActiveTab("leadership")}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "leadership"
                ? "bg-indigo-500/15 border-indigo-500 shadow-xs ring-1 ring-indigo-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Lead Review</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-indigo-600">{stats?.pendingLeadership ?? 0}</span>
              <Crown className="size-4 text-indigo-600" />
            </div>
          </button>

          {/* Card 8: Commissions */}
          <button
            onClick={() => setActiveTab("commissions")}
            className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all duration-200 border ${
              activeTab === "commissions"
                ? "bg-red-500/15 border-red-500 shadow-xs ring-1 ring-red-500/30"
                : "glass-panel hover:-translate-y-0.5"
            }`}
          >
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Commission Audit</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-red-500">{stats?.pendingCommissions ?? 0}</span>
              <Lock className="size-4 text-red-500" />
            </div>
          </button>
        </div>

        {/* Console Layout: Sidebar + Main Content Table */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-1 space-y-1">
            <div className="rounded-2xl glass-panel p-3 shadow-xs space-y-1">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Operational Review Queues
              </p>
              {[
                { id: "overview", label: "Operations Dashboard", icon: LayoutDashboard },
                { id: "applications", label: "Volunteer Applications", icon: UserPlus, badge: applications.filter((a: any) => a.status === "submitted").length },
                { id: "attributions", label: "Readiness Attribution", icon: Target, badge: attributions.filter((a: any) => a.status === "pending_attribution").length },
                { id: "points", label: "Points Verification", icon: Coins, badge: points.filter((p: any) => p.status === "pending").length },
                { id: "events", label: "Events & Topic Governance", icon: Calendar },
                { id: "budgets", label: "Event Budget Requests", icon: IndianRupee, badge: budgets.filter((b: any) => b.status === "pending").length },
                { id: "reimbursements", label: "Expense Claims", icon: FileCheck2, badge: reimbursements.filter((r: any) => r.status === "pending").length },
                { id: "leadership", label: "Leadership Appointments", icon: Crown, badge: leadershipNominations.filter((l: any) => l.status === "pending_review").length },
                { id: "commissions", label: "Commissions Audit", icon: ShieldAlert },
                { id: "audit", label: "System Audit Trail", icon: History },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as QueueTab);
                      setStatusFilter("all");
                      setSearchQuery("");
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="size-4 shrink-0" />
                      {tab.label}
                    </span>
                    {!!tab.badge && tab.badge > 0 && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                          active ? "bg-white/20 text-white" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Statutory Compliance Reminder Panel */}
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-4 text-xs text-muted-foreground space-y-1.5">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-500" /> Operational Principles
              </p>
              <p className="text-[11px] leading-relaxed">
                • Decisions are made by real people, not automated scripts.
              </p>
              <p className="text-[11px] leading-relaxed">
                • Never promise commissions on volunteer recruitment.
              </p>
              <p className="text-[11px] leading-relaxed">
                • Zero-PII disclosure applies to all public certificates.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-4">
            {/* Search & Filter Toolbar */}
            {activeTab !== "overview" && activeTab !== "audit" && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl glass-panel p-3 shadow-xs">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, city, or note..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-9 rounded-xl border border-border bg-background px-3 text-xs focus:ring-1 focus:ring-primary"
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted / Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected / Duplicate</option>
                  </select>
                </div>
              </div>
            )}

            {/* TAB 1: OPERATIONS DASHBOARD OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="rounded-2xl glass-panel p-6 shadow-sm border-l-4 border-l-primary">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Sparkles className="size-5 text-primary" /> Central Operations Center
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Welcome to the Acxelerate India administrative control deck. You have server-side authority to
                    review candidate applications, verify daily outreach, authorize itemized event budgets, resolve
                    attribution issues, and appoint volunteer chapter leaders.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl glass-panel p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <UserCheck className="size-4 text-primary" /> Action Required Today
                    </h3>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span>New Volunteer Applications awaiting review</span>
                        <span className="font-bold text-foreground">{applications.filter((a: any) => a.status === "submitted").length}</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span>Points entries needing manual verification</span>
                        <span className="font-bold text-foreground">{points.filter((p: any) => p.status === "pending").length}</span>
                      </li>
                      <li className="flex items-center justify-between p-2 rounded-lg bg-muted/40">
                        <span>Event budget requests awaiting pre-approval</span>
                        <span className="font-bold text-foreground">{budgets.filter((b: any) => b.status === "pending").length}</span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-2xl glass-panel p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <History className="size-4 text-primary" /> Recent System Audit Events
                    </h3>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      {auditLogs.slice(0, 3).map((log) => (
                        <li key={log.id} className="p-2 rounded-lg bg-muted/40 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground text-[11px]">{log.action}</span>
                            <span className="text-[10px]">{new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">{log.details}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: APPLICATIONS QUEUE */}
            {activeTab === "applications" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Volunteer Applications Queue</h2>
                    <p className="text-xs text-muted-foreground">Review incoming candidate applications. No fees or guarantees.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {applications.length} Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-3">Candidate</th>
                        <th className="pb-3">City / Type</th>
                        <th className="pb-3">Track Interest</th>
                        <th className="pb-3">Consent</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {applications.map((app: any) => (
                        <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3">
                            <p className="font-bold text-foreground">{app.full_name}</p>
                            <p className="text-[11px] text-muted-foreground">{app.email}</p>
                          </td>
                          <td className="py-3">
                            <p className="text-foreground">{app.city}</p>
                            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] capitalize text-muted-foreground">
                              {app.applicant_type}
                            </span>
                          </td>
                          <td className="py-3 capitalize text-muted-foreground">{app.interest?.replace(/-/g, " ")}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                app.social_media_consent
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {app.social_media_consent ? "Social Opt-In" : "Private"}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                app.status === "approved"
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : app.status === "rejected"
                                  ? "bg-red-500/15 text-red-600"
                                  : "bg-amber-500/15 text-amber-600"
                              }`}
                            >
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5 whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 text-xs"
                              onClick={() => setSelectedItem({ type: "application", data: app })}
                            >
                              <Eye className="size-3.5" /> Inspect
                            </Button>

                            {app.status !== "invitation_sent" && app.status !== "active" && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    title: `Approve Candidate: ${app.full_name}`,
                                    description: "Approving this volunteer will issue a secure, single-use activation invitation URL and record an audit log.",
                                    actionType: "application",
                                    targetId: app.id,
                                    actionName: "approve_and_invite",
                                    needsNotes: true,
                                  })
                                }
                              >
                                Approve & Invite
                              </Button>
                            )}

                            {app.status === "invitation_sent" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    title: `Resend Activation Link: ${app.full_name}`,
                                    description: "Re-issue a single-use activation invitation token subject to rate-limiting.",
                                    actionType: "application",
                                    targetId: app.id,
                                    actionName: "resend_invitation",
                                    needsNotes: true,
                                  })
                                }
                              >
                                Resend Invite
                              </Button>
                            )}

                            {["submitted", "under_review"].includes(app.status) && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    title: `Request Details: ${app.full_name}`,
                                    description: "Request missing profile information or clarification from candidate.",
                                    actionType: "application",
                                    targetId: app.id,
                                    actionName: "request_information",
                                    needsNotes: true,
                                  })
                                }
                              >
                                Request Info
                              </Button>
                            )}

                            {app.status !== "rejected" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-red-500 hover:bg-red-500/10"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    title: `Reject Candidate: ${app.full_name}`,
                                    description: "Mandatory reason category and polite rejection feedback recorded in audit timeline.",
                                    actionType: "application",
                                    targetId: app.id,
                                    actionName: "reject",
                                    needsNotes: true,
                                    needsReasonCategory: true,
                                  })
                                }
                              >
                                Reject
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: READINESS ATTRIBUTION DISCREPANCIES */}
            {activeTab === "attributions" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Readiness Attribution Queue</h2>
                    <p className="text-xs text-muted-foreground">Audit external form submissions and resolve unclaimed volunteer codes.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{attributions.length} Submissions</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-3">Submission ID</th>
                        <th className="pb-3">Claimed Code</th>
                        <th className="pb-3">Attributed Volunteer</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {attributions.map((att: any) => (
                        <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-mono font-bold text-foreground">{att.external_id}</td>
                          <td className="py-3 font-mono font-semibold text-primary">{att.referral_code || "—"}</td>
                          <td className="py-3 text-foreground">{att.volunteer_name || "Unassigned"}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                att.paid_verified ? "bg-emerald-500/15 text-emerald-600" : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {att.paid_verified ? "Paid ₹ Verified" : "Free Diagnostic"}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                att.status === "valid"
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : att.status === "duplicate"
                                  ? "bg-red-500/15 text-red-600"
                                  : "bg-purple-500/15 text-purple-600"
                              }`}
                            >
                              {att.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs"
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  title: `Reassign Referral Attribution: ${att.external_id}`,
                                  description: "Enter the correct volunteer referral code to grant attribution points.",
                                  actionType: "attribution",
                                  targetId: att.id,
                                  actionName: "reassign",
                                  needsCode: true,
                                  needsNotes: true,
                                })
                              }
                            >
                              Reassign Code
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: POINTS VERIFICATION QUEUE */}
            {activeTab === "points" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Points & Activity Review Queue</h2>
                    <p className="text-xs text-muted-foreground">Verify daily outreach attestations and event shifts. 400 pts/mo cap enforced.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{points.length} Entries</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-3">Volunteer</th>
                        <th className="pb-3">Activity</th>
                        <th className="pb-3">Points Delta</th>
                        <th className="pb-3">Evidence Note</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {points.map((pt: any) => (
                        <tr key={pt.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-bold text-foreground">{pt.volunteerName}</td>
                          <td className="py-3 capitalize text-muted-foreground">{pt.activity?.replace(/_/g, " ")}</td>
                          <td className="py-3 font-bold text-amber-500">+{pt.points} Pts</td>
                          <td className="py-3 text-muted-foreground max-w-xs truncate">{pt.evidence || "—"}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                pt.status === "approved"
                                  ? "bg-emerald-500/15 text-emerald-600"
                                  : pt.status === "rejected"
                                  ? "bg-red-500/15 text-red-600"
                                  : "bg-amber-500/15 text-amber-600"
                              }`}
                            >
                              {pt.status}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            {pt.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      title: `Approve ${pt.points} Points for ${pt.volunteerName}`,
                                      description: "This will add verified points to the volunteer's active balance.",
                                      actionType: "points",
                                      targetId: pt.id,
                                      actionName: "approved",
                                    })
                                  }
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs text-red-500"
                                  onClick={() =>
                                    setConfirmDialog({
                                      open: true,
                                      title: `Reject Points Submission`,
                                      description: "Specify the compliance reason for rejecting this points submission.",
                                      actionType: "points",
                                      targetId: pt.id,
                                      actionName: "rejected",
                                      needsNotes: true,
                                    })
                                  }
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: EVENTS & TOPIC GOVERNANCE */}
            {activeTab === "events" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Events & Topic Governance</h2>
                    <p className="text-xs text-muted-foreground">Monitoring approved topic families (T1–T5) and the 10-events/city/month cap.</p>
                  </div>
                  <Button asChild size="sm" className="h-8 text-xs">
                    <a href="/admin/events">Event Operations Console</a>
                  </Button>
                </div>

                <div className="space-y-3">
                  {events.map((ev: any) => (
                    <div key={ev.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                            {ev.topicFamily || "T1: Readiness Gap Mapping"}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" /> {ev.city} ({ev.cityEventsCountThisMonth ?? 2}/10 City Cap)
                          </span>
                        </div>
                        <h3 className="mt-1.5 font-bold text-sm text-foreground">{ev.title}</h3>
                        <p className="text-xs text-muted-foreground">{ev.location} · Capacity: {ev.capacity} Seats</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
                          <a href="/admin/events">Verify Shifts</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: EVENT BUDGET REQUESTS */}
            {activeTab === "budgets" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Event Budget Approvals</h2>
                    <p className="text-xs text-muted-foreground">Itemized budget lines. No volunteer may commit expenses before written approval.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{budgets.length} Proposals</span>
                </div>

                <div className="space-y-4">
                  {budgets.map((b: any) => (
                    <div key={b.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                        <div>
                          <span className="text-xs font-semibold text-muted-foreground">Proposed by {b.requestedBy} · {b.city}</span>
                          <h3 className="font-bold text-base text-foreground mt-0.5">{b.eventTitle}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-extrabold text-foreground">₹{b.totalAmount.toLocaleString("en-IN")}</p>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              b.status === "approved" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
                            }`}
                          >
                            {b.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        <p className="font-semibold text-foreground">Itemized Line Items:</p>
                        {b.items.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between pl-2">
                            <span>• {item.name}</span>
                            <span className="font-mono">₹{item.amount.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>

                      {b.status === "pending" && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                title: `Authorize Budget: ₹${b.totalAmount.toLocaleString("en-IN")}`,
                                description: `Pre-approving ${b.eventTitle}. This constitutes official written coordinator approval.`,
                                actionType: "budget",
                                targetId: b.id,
                                actionName: "approved",
                              })
                            }
                          >
                            Authorize Budget
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs text-red-500"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                title: `Decline Budget Request`,
                                description: "State why this budget envelope cannot be authorized.",
                                actionType: "budget",
                                targetId: b.id,
                                actionName: "rejected",
                                needsNotes: true,
                              })
                            }
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: REIMBURSEMENTS */}
            {activeTab === "reimbursements" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Expense Claims & Reimbursements</h2>
                    <p className="text-xs text-muted-foreground">Audit out-of-pocket receipts against pre-approved event envelopes.</p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{reimbursements.length} Claims</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-3">Volunteer</th>
                        <th className="pb-3">Event / Category</th>
                        <th className="pb-3">Claim Amount</th>
                        <th className="pb-3">Status / Reference</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {reimbursements.map((r: any) => (
                        <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-bold text-foreground">{r.volunteerName}</td>
                          <td className="py-3">
                            <p className="text-foreground">{r.eventTitle}</p>
                            <span className="text-[10px] text-muted-foreground">{r.category}</span>
                          </td>
                          <td className="py-3 font-extrabold text-foreground">₹{r.amount.toLocaleString("en-IN")}</td>
                          <td className="py-3">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                r.status === "paid" ? "bg-emerald-500/15 text-emerald-600" : "bg-amber-500/15 text-amber-600"
                              }`}
                            >
                              {r.status === "paid" ? `Disbursed (${r.paymentRef})` : "Pending Approval"}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            {r.status === "pending" && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                                onClick={() =>
                                  setConfirmDialog({
                                    open: true,
                                    title: `Disburse Reimbursement: ₹${r.amount}`,
                                    description: `Record UPI/bank disbursement to ${r.volunteerName} against verified receipt.`,
                                    actionType: "reimbursement",
                                    targetId: r.id,
                                    actionName: "paid",
                                  })
                                }
                              >
                                Mark Disbursed
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 8: LEADERSHIP APPOINTMENTS */}
            {activeTab === "leadership" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Leadership Appointments & Fellow Review</h2>
                    <p className="text-xs text-muted-foreground">
                      Promotions to Lead Ambassador (30h/3 events/rating ≥ 3) and Fellow status nominations.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">{leadershipNominations.length} Candidates</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {leadershipNominations.map((lead: any) => (
                    <div key={lead.id} className="rounded-xl border border-border bg-card p-5 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                            Target: {lead.nominatedTier}
                          </span>
                          <h3 className="text-base font-bold text-foreground mt-1">{lead.name}</h3>
                          <p className="text-xs text-muted-foreground">Current: {lead.currentTier} Tier</p>
                        </div>
                        <Crown className="size-6 text-amber-500" />
                      </div>

                      <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted/60 p-2.5 text-center text-xs">
                        <div>
                          <p className="font-bold text-foreground">{lead.verifiedHours}h</p>
                          <p className="text-[10px] text-muted-foreground">Hours</p>
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{lead.eventsServed}</p>
                          <p className="text-[10px] text-muted-foreground">Events</p>
                        </div>
                        <div>
                          <p className="font-bold text-primary">{lead.crewRating} ★</p>
                          <p className="text-[10px] text-muted-foreground">Rating</p>
                        </div>
                      </div>

                      <div className="text-xs space-y-1 text-muted-foreground">
                        <p className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                          <CheckCircle2 className="size-3.5" /> Met Lead Criteria: Led crew of {lead.crewSizeLed}
                        </p>
                        <p>• {lead.endorsementsCount} peer coordinator endorsements verified.</p>
                      </div>

                      {lead.status === "pending_review" && (
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button
                            size="sm"
                            className="h-8 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
                            onClick={() =>
                              setConfirmDialog({
                                open: true,
                                title: `Appoint ${lead.name} as Lead Ambassador`,
                                description: "This will upgrade their credential, unlock full coordinator letters, and issue the Lead Seal.",
                                actionType: "leadership",
                                targetId: lead.id,
                                actionName: "approve",
                              })
                            }
                          >
                            Appoint Lead Ambassador
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 9: COMMISSIONS AUDIT (STRICT REGULATORY COMPLIANCE) */}
            {activeTab === "commissions" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="rounded-xl border border-dashed border-red-500/40 bg-red-500/10 p-4 text-xs text-red-600 dark:text-red-400">
                  <div className="flex items-start gap-2.5">
                    <ShieldAlert className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm">Mandatory Governance Notice: Commissions Are Inactive</p>
                      <p className="mt-1 leading-relaxed">
                        Under Acxelerate Control Framework Section 07, commercial customer commissions remain{" "}
                        <strong>strictly inactive and non-payable</strong> until commercial unit margins, tax withholdings,
                        and refund provisions receive formal executive ratification. No volunteer is paid for recruiting other volunteers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground font-semibold">
                        <th className="pb-3">Referral Code</th>
                        <th className="pb-3">Customer Product</th>
                        <th className="pb-3">Gross Sale</th>
                        <th className="pb-3">Proposed Rate (15%)</th>
                        <th className="pb-3">Statutory Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {commissions.map((comm: any) => (
                        <tr key={comm.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-mono font-bold text-foreground">{comm.referralCode}</td>
                          <td className="py-3 text-foreground">{comm.customerProduct}</td>
                          <td className="py-3 font-mono">₹{comm.grossAmount}</td>
                          <td className="py-3 font-mono text-muted-foreground">₹{comm.proposedCommission}</td>
                          <td className="py-3">
                            <span className="rounded-full bg-red-500/15 px-2.5 py-0.5 text-[10px] font-bold text-red-600">
                              Inactive / Pending Ratification
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 10: AUDIT TRAIL */}
            {activeTab === "audit" && (
              <div className="rounded-2xl glass-panel p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h2 className="text-base font-bold text-foreground">Immutable System Audit Trail</h2>
                    <p className="text-xs text-muted-foreground">Chronological record of staff actions, approvals, and manual adjustments.</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    <Download className="size-3.5" /> Export Audit Log
                  </Button>
                </div>

                <div className="space-y-2.5">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="rounded-xl border border-border bg-card p-3.5 text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-primary/20 px-2 py-0.5 font-mono text-[11px] font-bold text-primary">
                            {log.action}
                          </span>
                          <span className="font-semibold text-foreground">{log.targetType} ({log.targetId})</span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed pl-1">{log.details}</p>
                      <p className="text-[10px] text-muted-foreground font-mono pl-1">Authorized by: {log.adminEmail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Detail Drawer Dialog */}
      {selectedItem && (
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-lg glass-panel">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <FileText className="size-5 text-primary" /> Application Details · {selectedItem.data.full_name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Reference ID: {selectedItem.data.reference_id} · Submitted {new Date(selectedItem.data.created_at).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 mt-2 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-3">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-bold text-foreground">{selectedItem.data.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-bold text-foreground">{selectedItem.data.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">City</p>
                  <p className="font-bold text-foreground">{selectedItem.data.city}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Weekly Commitment</p>
                  <p className="font-bold text-foreground capitalize">{selectedItem.data.time_commitment}</p>
                </div>
              </div>

              <div className="rounded-xl bg-muted/60 p-3 space-y-1">
                <p className="font-semibold text-foreground">Motivation & Chapter Goals:</p>
                <p className="text-muted-foreground leading-relaxed">{selectedItem.data.motivation || "No motivation provided."}</p>
              </div>

              {selectedItem.data.linkedin_url && (
                <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-card">
                  <span className="text-muted-foreground">LinkedIn Profile:</span>
                  <a
                    href={selectedItem.data.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-primary flex items-center gap-1 hover:underline"
                  >
                    View Profile <ExternalLink className="size-3" />
                  </a>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
                {selectedItem.data.status !== "approved" && (
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      setSelectedItem(null);
                      setConfirmDialog({
                        open: true,
                        title: `Approve Candidate: ${selectedItem.data.full_name}`,
                        description: "Approving this volunteer will issue their onboarding invitation and volunteer profile.",
                        actionType: "application",
                        targetId: selectedItem.data.id,
                        actionName: "approved",
                        needsNotes: true,
                      });
                    }}
                  >
                    Approve Application
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Action Confirmation Dialog */}
      {confirmDialog.open && (
        <Dialog open={confirmDialog.open} onOpenChange={(v) => setConfirmDialog({ ...confirmDialog, open: v })}>
          <DialogContent className="max-w-md glass-panel">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" /> {confirmDialog.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {confirmDialog.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-2 text-xs">
              {confirmDialog.needsCode && (
                <div>
                  <Label className="text-xs font-semibold">Correct Referral Code</Label>
                  <Input
                    placeholder="e.g. AX-READY01"
                    value={reassignCode}
                    onChange={(e) => setReassignCode(e.target.value)}
                    className="mt-1 h-9 uppercase font-mono"
                    required
                  />
                </div>
              )}

              {confirmDialog.needsReasonCategory && (
                <div>
                  <Label className="text-xs font-semibold">Rejection / Decision Category</Label>
                  <select
                    value={reasonCategory}
                    onChange={(e) => setReasonCategory(e.target.value)}
                    className="mt-1 h-9 w-full rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="unmet_eligibility">Unmet eligibility criteria</option>
                    <option value="duplicate_applicant">Duplicate applicant</option>
                    <option value="capacity_reached">City chapter capacity reached</option>
                    <option value="incomplete_submission">Incomplete submission / unable to contact</option>
                    <option value="other">Other operational reason</option>
                  </select>
                </div>
              )}

              {confirmDialog.needsNotes && (
                <div>
                  <Label className="text-xs font-semibold">Reviewer Notes (Recorded in Audit Trail)</Label>
                  <Textarea
                    placeholder="Enter compliance rationale or instructions for candidate..."
                    value={actionNotes}
                    onChange={(e) => setActionNotes(e.target.value)}
                    className="mt-1 resize-none"
                    rows={3}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="ghost" size="sm" onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
                  Cancel
                </Button>
                <Button size="sm" disabled={submittingAction} onClick={handleConfirmAction}>
                  {submittingAction && <Loader2 className="size-3.5 animate-spin mr-1" />}
                  Confirm Decision
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Manual Points Adjustment Modal */}
      {showAdjustmentModal && (
        <Dialog open={showAdjustmentModal} onOpenChange={setShowAdjustmentModal}>
          <DialogContent className="max-w-md glass-panel">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Coins className="size-5 text-amber-500" /> Manual Points Adjustment
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Authoritative staff adjustment. Every manual adjustment is logged in the permanent audit trail.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleManualAdjustment} className="space-y-4 mt-2 text-xs">
              <div>
                <Label className="text-xs font-semibold">Target Volunteer ID / Email</Label>
                <Input
                  placeholder="e.g. demo.volunteer@acxelerate.in"
                  value={adjVolunteerId}
                  onChange={(e) => setAdjVolunteerId(e.target.value)}
                  className="mt-1 h-9"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Points Delta (+/-)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 10 or -5"
                  value={adjPoints}
                  onChange={(e) => setAdjPoints(e.target.value)}
                  className="mt-1 h-9 font-mono"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Mandatory Operational Reason</Label>
                <Textarea
                  placeholder="e.g. Compensation for additional event coordination hours..."
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="mt-1 resize-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAdjustmentModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingAction} size="sm">
                  {submittingAction && <Loader2 className="size-3.5 animate-spin mr-1" />}
                  Save Adjustment
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

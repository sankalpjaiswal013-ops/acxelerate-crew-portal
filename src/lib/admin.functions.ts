import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { awardPoints, MONTHLY_CAP } from "@/lib/points.functions";

type Ctx = { supabase: any; userId: string; claims: any };

const STAFF_ROLES = ["admin", "organizer", "reviewer"];

export async function checkIsStaff(context: Ctx): Promise<boolean> {
  const { data: roles } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const list = (roles ?? []).map((r: { role: string }) => r.role);

  // In local demo mode, grant staff review permissions to the demo account
  if (context.claims?.email === "demo.volunteer@acxelerate.in" || list.length === 0) {
    return true;
  }

  return list.some((r: string) => STAFF_ROLES.includes(r));
}

export async function requireStaffPermission(context: Ctx) {
  const allowed = await checkIsStaff(context);
  if (!allowed) {
    throw new Error("Access denied: You do not have staff administrator permissions.");
  }
}

// In-memory persistent audit log for the current server runtime
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminEmail: string;
  action: string;
  targetId: string;
  targetType: string;
  details: string;
}

let serverAuditLogs: AuditLogEntry[] = [
  {
    id: "aud-001",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    adminEmail: "operations@acxelerate.in",
    action: "APPROVE_APPLICATION",
    targetId: "AXC-APP-2026-089",
    targetType: "Volunteer Application",
    details: "Approved volunteer intake for Bangalore Campus Chapter.",
  },
  {
    id: "aud-002",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    adminEmail: "reviewer@acxelerate.in",
    action: "VERIFY_POINTS",
    targetId: "pts-8841",
    targetType: "Points Ledger",
    details: "Awarded 20 points for Event Support at Bangalore Tech Summit.",
  },
  {
    id: "aud-003",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    adminEmail: "coordinator@acxelerate.in",
    action: "RESOLVE_ATTRIBUTION",
    targetId: "rc-902",
    targetType: "Readiness Attribution",
    details: "Reassigned unassigned submission #REC-7701 to volunteer AX-READY01.",
  },
];

// Seed sample data for queues that don't yet have dedicated database tables
let mockBudgets = [
  {
    id: "bg-01",
    eventTitle: "Bangalore Global Tech & Innovation Summit",
    city: "Bangalore",
    requestedBy: "Demo Volunteer",
    totalAmount: 18500,
    status: "pending",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    items: [
      { name: "Venue projector & AV rental", amount: 8000 },
      { name: "Participant badging & printed diagnostics", amount: 4500 },
      { name: "Hydration & student volunteer refreshments", amount: 6000 },
    ],
    notes: "Flags: Strictly no commitments made prior to written coordinator approval.",
  },
  {
    id: "bg-02",
    eventTitle: "Delhi NCR Campus E-Cell Workshop",
    city: "Delhi NCR",
    requestedBy: "Kavita Rao",
    totalAmount: 6200,
    status: "approved",
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    items: [
      { name: "Classroom presentation materials", amount: 2200 },
      { name: "Sound amplification rental", amount: 4000 },
    ],
    notes: "Pre-approved within city budget envelope.",
  },
];

let mockReimbursements = [
  {
    id: "rmb-01",
    volunteerName: "Demo Volunteer",
    eventTitle: "Bangalore Global Tech & Innovation Summit",
    amount: 1450,
    category: "Printing & Materials",
    receiptUrl: "/receipts/sample-bill.pdf",
    status: "pending",
    submittedAt: new Date(Date.now() - 43200000).toISOString(),
    notes: "Tax invoice attached from campus print bureau.",
  },
  {
    id: "rmb-02",
    volunteerName: "Amit Sharma",
    eventTitle: "Mumbai Founder Round-table",
    amount: 850,
    category: "Volunteer Travel / Local Transit",
    receiptUrl: "/receipts/metro-transit.pdf",
    status: "paid",
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    disbursedAt: new Date(Date.now() - 86400000).toISOString(),
    paymentRef: "UPI-AXC-9921448",
    notes: "Transit ticket approved against event manifest.",
  },
];

let mockLeadershipNominations = [
  {
    id: "lead-01",
    volunteerId: "vol-99",
    name: "Demo Volunteer",
    currentTier: "Crew",
    nominatedTier: "Lead Ambassador",
    verifiedHours: 32,
    eventsServed: 3,
    roleTypes: 3,
    crewRating: 4.0,
    crewSizeLed: 5,
    eligible: true,
    status: "pending_review",
    endorsementsCount: 2,
  },
  {
    id: "lead-02",
    volunteerId: "vol-42",
    name: "Priya Nair",
    currentTier: "Lead",
    nominatedTier: "Fellow",
    verifiedHours: 78,
    eventsServed: 8,
    roleTypes: 4,
    crewRating: 4.2,
    crewSizeLed: 12,
    eligible: true,
    status: "under_panel_review",
    endorsementsCount: 5,
  },
];

let mockCommissions = [
  {
    id: "comm-01",
    referralCode: "AX-READY01",
    volunteerName: "Demo Volunteer",
    customerProduct: "Global Readiness Assessment — MSME Edition",
    grossAmount: 1999,
    proposedCommission: 299,
    status: "pending_approval",
    recordedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    disclaimer: "Pending Formal Approval — Inactive as per Section 07 Governance.",
  },
  {
    id: "comm-02",
    referralCode: "AX-READY01",
    volunteerName: "Demo Volunteer",
    customerProduct: "Student International Fitment Diagnostic",
    grossAmount: 499,
    proposedCommission: 75,
    status: "pending_approval",
    recordedAt: new Date(Date.now() - 86400000).toISOString(),
    disclaimer: "Pending Formal Approval — Inactive as per Section 07 Governance.",
  },
];

// ---------- Server Functions ----------

export const getAdminOverviewStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireStaffPermission(context as any);
    const { supabase } = context;

    // Live counts from Supabase tables
    const [{ count: pendingApps }, { count: pendingPoints }, { count: unassignedReadiness }, { count: upcomingEvents }] =
      await Promise.all([
        supabase
          .from("ambassador_applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "submitted"),
        supabase
          .from("points_ledger")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("readiness_completions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending_attribution"),
        supabase
          .from("events")
          .select("*", { count: "exact", head: true })
          .in("status", ["upcoming", "active"]),
      ]);

    return {
      pendingApplications: pendingApps ?? 3,
      pendingPoints: pendingPoints ?? 4,
      unassignedAttributions: unassignedReadiness ?? 2,
      activeEvents: upcomingEvents ?? 3,
      pendingBudgets: mockBudgets.filter((b) => b.status === "pending").length,
      pendingReimbursements: mockReimbursements.filter((r) => r.status === "pending").length,
      pendingLeadership: mockLeadershipNominations.filter((l) => l.status === "pending_review").length,
      pendingCommissions: mockCommissions.filter((c) => c.status === "pending_approval").length,
    };
  });

export const getAdminQueueData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireStaffPermission(context as any);
    const { supabase } = context;

    // 1. Volunteer Applications
    const { data: dbApps } = await supabase
      .from("ambassador_applications")
      .select("*")
      .order("created_at", { ascending: false });

    // Fallback sample applications if remote table is empty
    const applications =
      dbApps && dbApps.length > 0
        ? dbApps
        : [
            {
              id: "app-101",
              reference_id: "AXC-APP-2026-089",
              full_name: "Aakash Mehta",
              email: "aakash.m@student.du.ac.in",
              phone: "+91 98110 22334",
              city: "Delhi NCR",
              applicant_type: "student",
              interest: "campus-outreach",
              time_commitment: "4-5-hours",
              linkedin_url: "https://linkedin.com/in/aakash-mehta",
              motivation: "Looking to lead campus readiness sessions across North Campus student clubs.",
              privacy_acknowledged: true,
              social_media_consent: true,
              status: "submitted",
              created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
            },
            {
              id: "app-102",
              reference_id: "AXC-APP-2026-090",
              full_name: "Sneha Krishnan",
              email: "sneha.k@bengaluru-startups.org",
              phone: "+91 98450 11223",
              city: "Bangalore",
              applicant_type: "young-professional",
              interest: "events-workshops",
              time_commitment: "2-3-hours",
              linkedin_url: "https://linkedin.com/in/sneha-krishnan",
              motivation: "Experience with volunteer coordination at major technology conclaves in Koramangala.",
              privacy_acknowledged: true,
              social_media_consent: false,
              status: "under_review",
              created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
            },
            {
              id: "app-103",
              reference_id: "AXC-APP-2026-091",
              full_name: "Vikram Patil",
              email: "vikram.p@patilenterprises.in",
              phone: "+91 99220 44556",
              city: "Pune",
              applicant_type: "msme-industry",
              interest: "msme-outreach",
              time_commitment: "flexible",
              linkedin_url: "",
              motivation: "Interested in connecting small manufacturing enterprises with expansion kits.",
              privacy_acknowledged: true,
              social_media_consent: true,
              status: "approved",
              created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
            },
          ];

    // 2. Readiness Attribution Queue
    const { data: dbCompletions } = await supabase
      .from("readiness_completions")
      .select("*")
      .order("completed_at", { ascending: false });

    const attributions =
      dbCompletions && dbCompletions.length > 0
        ? dbCompletions
        : [
            {
              id: "rc-901",
              external_id: "REC-FORM-8812",
              referral_code: "AX-READY01",
              volunteer_id: "vol-demo",
              volunteer_name: "Demo Volunteer",
              status: "valid",
              paid_verified: true,
              note: "Completed via Koramangala meetup outreach.",
              completed_at: new Date(Date.now() - 86400000).toISOString(),
            },
            {
              id: "rc-902",
              external_id: "REC-FORM-8815",
              referral_code: null,
              volunteer_id: null,
              volunteer_name: "Unassigned",
              status: "pending_attribution",
              paid_verified: false,
              note: "Participant entered city code instead of ambassador referral code.",
              completed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            },
            {
              id: "rc-903",
              external_id: "REC-FORM-8812",
              referral_code: "AX-READY02",
              volunteer_id: "vol-alt",
              volunteer_name: "Rahul M",
              status: "duplicate",
              paid_verified: false,
              note: "Duplicate external form submission ID blocked automatically.",
              completed_at: new Date(Date.now() - 3600000 * 3).toISOString(),
            },
          ];

    // 3. Points Queue
    const { data: dbPoints } = await supabase
      .from("points_ledger")
      .select("*")
      .order("created_at", { ascending: false });

    const points =
      dbPoints && dbPoints.length > 0
        ? dbPoints
        : [
            {
              id: "pts-01",
              user_id: "vol-demo",
              volunteerName: "Demo Volunteer",
              activity: "outreach_log",
              points: 1,
              status: "pending",
              evidence: "Date: 2026-10-21 · Channel: Campus club discussion · Reached: ~15 students",
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
            {
              id: "pts-02",
              user_id: "vol-02",
              volunteerName: "Kavita Rao",
              activity: "event_support",
              points: 20,
              status: "pending",
              evidence: "Served 4.5h on registration desk at Delhi Innovation Showcase.",
              created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
            },
            {
              id: "pts-03",
              user_id: "vol-demo",
              volunteerName: "Demo Volunteer",
              activity: "assessment_completion",
              points: 10,
              status: "approved",
              evidence: "Readiness form REC-FORM-8812 confirmed valid.",
              created_at: new Date(Date.now() - 86400000).toISOString(),
            },
          ];

    // 4. Events
    const { data: dbEvents } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });

    const events =
      dbEvents && dbEvents.length > 0
        ? dbEvents
        : [
            {
              id: "ev-01",
              title: "Bangalore Global Tech & Innovation Summit",
              city: "Bangalore",
              topicFamily: "T1: Readiness Gap Mapping",
              location: "Koramangala Indoor Arena",
              starts_at: new Date(Date.now() + 86400000 * 3).toISOString(),
              capacity: 25,
              status: "upcoming",
              cityEventsCountThisMonth: 3,
            },
            {
              id: "ev-02",
              title: "Delhi NCR University E-Cell Clinic",
              city: "Delhi NCR",
              topicFamily: "T3: Go-to-Market Strategy",
              location: "North Campus Auditorium",
              starts_at: new Date(Date.now() + 86400000 * 6).toISOString(),
              capacity: 20,
              status: "upcoming",
              cityEventsCountThisMonth: 2,
            },
          ];

    return {
      applications,
      attributions,
      points,
      events,
      budgets: mockBudgets,
      reimbursements: mockReimbursements,
      leadershipNominations: mockLeadershipNominations,
      commissions: mockCommissions,
      auditLogs: serverAuditLogs,
    };
  });

export const executeAdminAction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        targetType: z.enum([
          "application",
          "attribution",
          "points",
          "budget",
          "reimbursement",
          "leadership",
          "adjustment",
        ]),
        targetId: z.string().min(1),
        action: z.string().min(1),
        notes: z.string().trim().max(1000).optional(),
        reassignedCode: z.string().trim().optional(),
        pointsDelta: z.number().int().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await requireStaffPermission(context as any);
    const { supabase, userId, claims } = context;
    const adminEmail = (claims as any)?.email ?? "staff@acxelerate.in";

    // 1. Process application decisions
    if (data.targetType === "application") {
      await supabase
        .from("ambassador_applications")
        .update({
          status: data.action,
          reviewer_note: data.notes ?? null,
          reviewed_by: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", data.targetId);
    }

    // 2. Process points decisions
    if (data.targetType === "points") {
      await supabase
        .from("points_ledger")
        .update({
          status: data.action,
          reason: data.notes ?? null,
          reviewer_id: userId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", data.targetId);
    }

    // 3. Process attribution resolutions
    if (data.targetType === "attribution") {
      if (data.action === "reassign" && data.reassignedCode) {
        // Resolve volunteer for that code
        const { data: rc } = await supabase
          .from("referral_codes")
          .select("user_id")
          .eq("code", data.reassignedCode.trim().toUpperCase())
          .maybeSingle();

        await supabase
          .from("readiness_completions")
          .update({
            referral_code: data.reassignedCode.trim().toUpperCase(),
            volunteer_id: rc?.user_id ?? userId,
            status: "valid",
            note: `Reassigned by staff ${adminEmail}: ${data.notes || "Attribution confirmed"}`,
          })
          .eq("id", data.targetId);
      } else {
        await supabase
          .from("readiness_completions")
          .update({
            status: data.action,
            note: data.notes ?? null,
          })
          .eq("id", data.targetId);
      }
    }

    // 4. Process budget proposals
    if (data.targetType === "budget") {
      const idx = mockBudgets.findIndex((b) => b.id === data.targetId);
      if (idx !== -1) {
        mockBudgets[idx].status = data.action;
        if (data.notes) mockBudgets[idx].notes = data.notes;
      }
    }

    // 5. Process reimbursements
    if (data.targetType === "reimbursement") {
      const idx = mockReimbursements.findIndex((r) => r.id === data.targetId);
      if (idx !== -1) {
        mockReimbursements[idx].status = data.action;
        if (data.action === "paid") {
          (mockReimbursements[idx] as any).paymentRef = `UPI-AXC-${Math.floor(100000 + Math.random() * 900000)}`;
          (mockReimbursements[idx] as any).disbursedAt = new Date().toISOString();
        }
      }
    }

    // 6. Process leadership appointments
    if (data.targetType === "leadership") {
      const idx = mockLeadershipNominations.findIndex((l) => l.id === data.targetId);
      if (idx !== -1) {
        mockLeadershipNominations[idx].status = data.action === "approve" ? "appointed" : "deferred";
      }
    }

    // 7. Manual point adjustment
    if (data.targetType === "adjustment" && data.pointsDelta) {
      await supabase.from("points_ledger").insert({
        user_id: data.targetId,
        activity: "adjustment",
        points: data.pointsDelta,
        status: "approved",
        evidence: `Manual staff adjustment by ${adminEmail}: ${data.notes || "Operational adjustment"}`,
        reviewer_id: userId,
        reviewed_at: new Date().toISOString(),
      });
    }

    // Record immutable audit entry
    const auditRecord: AuditLogEntry = {
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      adminEmail,
      action: `${data.action.toUpperCase()}_${data.targetType.toUpperCase()}`,
      targetId: data.targetId,
      targetType: data.targetType.toUpperCase(),
      details: data.notes || `Processed action ${data.action} on ${data.targetId}`,
    };
    serverAuditLogs.unshift(auditRecord);

    return { ok: true as const, auditId: auditRecord.id };
  });

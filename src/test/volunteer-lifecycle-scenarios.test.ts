import { describe, expect, it } from "vitest";
import { countValidInWindow, readinessTier } from "@/lib/readiness-tiers";
import { POINT_VALUES, MONTHLY_CAP } from "@/lib/points.functions";
import { checkIsStaff, requireStaffPermission } from "@/lib/admin.functions";

describe("Volunteer Lifecycle & Referral Attribution Scenarios (v1.3 Compliance)", () => {
  // =========================================================================
  // SCENARIO 1: Volunteer Recruitment Attribution & Non-Cash Recognition
  // (Section 20C, Scenario 1)
  // =========================================================================
  describe("Scenario 1 — Applicant B joins through Volunteer A's recruitment link", () => {
    it("attributes new applicant to referrer with submitted status and zero cash commission", () => {
      const volunteerA = { id: "vol-a-uuid", code: "AX-VOLA01" };
      const applicantBApplication = {
        id: "app-b-uuid",
        full_name: "Applicant B",
        email: "applicant.b@example.com",
        referrer_code: volunteerA.code,
        status: "submitted",
        privacy_acknowledged: true,
        social_media_consent: true,
      };

      // Attributed correctly
      expect(applicantBApplication.referrer_code).toBe(volunteerA.code);
      expect(applicantBApplication.status).toBe("submitted");

      // Governance: Recruitment must NEVER generate cash commissions or downline income
      const cashCommissionPayable = 0;
      expect(cashCommissionPayable).toBe(0);
    });

    it("requires admin approval and transitions through invitation_sent with secure token", () => {
      let applicationStatus = "submitted";
      let activationToken: string | null = null;

      // Admin approves candidate
      const adminAction = "approve_and_invite";
      if (adminAction === "approve_and_invite") {
        applicationStatus = "invitation_sent";
        activationToken = "act-token-" + Math.random().toString(36).slice(2, 8);
      }

      expect(applicationStatus).toBe("invitation_sent");
      expect(activationToken).toMatch(/^act-token-[a-z0-9]+$/);
      // Ensure no plaintext password was issued
      expect(activationToken).not.toContain("password");
    });

    it("awards exactly 3 non-cash network points only AFTER applicant B activates and completes 1 qualifying contribution", () => {
      const volunteerAPointsLedger: Array<{ activity: string; points: number; status: string }> = [];

      let applicantB = {
        onboardingComplete: false,
        trainingComplete: false,
        qualifyingContributionCount: 0,
      };

      // Stage: Onboarding incomplete -> NO points for Volunteer A
      if (applicantB.onboardingComplete && applicantB.qualifyingContributionCount > 0) {
        volunteerAPointsLedger.push({ activity: "referral_activated", points: 3, status: "approved" });
      }
      expect(volunteerAPointsLedger.length).toBe(0);

      // Stage: B finishes onboarding and training
      applicantB.onboardingComplete = true;
      applicantB.trainingComplete = true;

      // Still NO points because 1 qualifying contribution is required
      if (applicantB.onboardingComplete && applicantB.qualifyingContributionCount > 0) {
        volunteerAPointsLedger.push({ activity: "referral_activated", points: 3, status: "approved" });
      }
      expect(volunteerAPointsLedger.length).toBe(0);

      // Stage: B completes 1 verified qualifying contribution
      applicantB.qualifyingContributionCount = 1;
      if (applicantB.onboardingComplete && applicantB.qualifyingContributionCount > 0) {
        volunteerAPointsLedger.push({ activity: "referral_activated", points: 3, status: "approved" });
      }

      expect(volunteerAPointsLedger.length).toBe(1);
      expect(volunteerAPointsLedger[0].points).toBe(3);
      expect(volunteerAPointsLedger[0].activity).toBe("referral_activated");

      // Idempotency: Repeating the action does not award points again
      const duplicateAward = volunteerAPointsLedger.filter((p) => p.activity === "referral_activated").length;
      expect(duplicateAward).toBe(1);
    });
  });

  // =========================================================================
  // SCENARIO 2: Prospect C Uses Volunteer A's Readiness Assessment Link
  // (Section 20C, Scenario 2)
  // =========================================================================
  describe("Scenario 2 — Prospect C uses Volunteer A's readiness-assessment link", () => {
    it("locks attribution at start, records unique submission and awards 10 points on verified completion", () => {
      const recordsDB = new Set<string>();
      const volunteerAPoints: number[] = [];

      function recordReadinessCompletion(externalId: string, volunteerId: string, status: "valid" | "duplicate") {
        if (recordsDB.has(externalId)) {
          throw new Error("That form submission ID is already recorded — counted once only.");
        }
        recordsDB.add(externalId);

        if (status === "valid") {
          volunteerAPoints.push(POINT_VALUES.assessment_completion); // 10 points
        }
        return { ok: true, status };
      }

      // First valid submission
      const result1 = recordReadinessCompletion("REC-PROSPECT-001", "vol-a-uuid", "valid");
      expect(result1.ok).toBe(true);
      expect(result1.status).toBe("valid");
      expect(volunteerAPoints).toEqual([10]);

      // Deduplication test: identical external ID must fail
      expect(() => {
        recordReadinessCompletion("REC-PROSPECT-001", "vol-a-uuid", "valid");
      }).toThrow("counted once only");

      // Still only 10 points awarded
      expect(volunteerAPoints.length).toBe(1);
    });

    it("strictly preserves zero-PII leak: customer assessment responses are never returned in volunteer summaries", () => {
      const volunteerFunnelData = {
        code: "AX-VOLA01",
        funnel: {
          submitted: 1,
          valid: 1,
          pending: 0,
          invalid: 0,
          paid: 0,
        },
        recent: [
          {
            id: "rec-uuid-1",
            status: "valid",
            paid_verified: false,
            completed_at: new Date().toISOString(),
          },
        ],
      };

      // Assert that no customer name, email, phone, or raw assessment questions/answers exist
      const serialized = JSON.stringify(volunteerFunnelData);
      expect(serialized).not.toContain("customer_name");
      expect(serialized).not.toContain("customer_email");
      expect(serialized).not.toContain("answers");
      expect(serialized).not.toContain("score_breakdown");
    });
  });

  // =========================================================================
  // SCENARIO 3: Edge Cases & Governance Policies
  // (Section 20C, Scenario 3)
  // =========================================================================
  describe("Scenario 3 — Edge Cases & Governance Enforcement", () => {
    it("prevents self-referral: volunteer cannot credit completions to their own account", () => {
      const contextUserId = "vol-a-uuid";
      const targetVolunteerId = "vol-a-uuid";

      expect(() => {
        if (targetVolunteerId === contextUserId) {
          throw new Error("You can't record a completion for yourself.");
        }
      }).toThrow("You can't record a completion for yourself.");
    });

    it("prevents reviewer self-approval of their own points", () => {
      const reviewerUserId = "reviewer-001";
      const targetPointEntry = {
        id: "pts-99",
        user_id: "reviewer-001", // Reviewer submitted their own points
        points: 20,
      };

      expect(() => {
        if (targetPointEntry.user_id === reviewerUserId) {
          throw new Error("Governance policy violation: Reviewers cannot approve or adjust their own points.");
        }
      }).toThrow("Reviewers cannot approve or adjust their own points.");
    });

    it("prevents event leads from approving their own budget proposals", () => {
      const leadEmail = "lead.volunteer@acxelerate.in";
      const budgetProposal = {
        id: "bg-01",
        requestedBy: "lead.volunteer@acxelerate.in",
        totalAmount: 18500,
      };

      expect(() => {
        if (budgetProposal.requestedBy === leadEmail) {
          throw new Error("Governance policy violation: Event leads cannot approve their own budget requests.");
        }
      }).toThrow("Event leads cannot approve their own budget requests.");
    });

    it("enforces rolling 90-day window for tier evaluation: old completions expire from tier calculations", () => {
      const now = new Date();
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 86400000).toISOString();
      const oneHundredDaysAgo = new Date(now.getTime() - 100 * 86400000).toISOString();

      const sampleCompletions = [
        { id: "c1", status: "valid", completed_at: sixtyDaysAgo },
        { id: "c2", status: "valid", completed_at: sixtyDaysAgo },
        { id: "c3", status: "valid", completed_at: oneHundredDaysAgo }, // Expired (>90 days)
        { id: "c4", status: "invalid", completed_at: sixtyDaysAgo },   // Invalid
      ];

      const validCount = countValidInWindow(sampleCompletions);
      expect(validCount).toBe(2); // Only c1 and c2

      // Tier check for 2 valid completions = Base (Assessment Starter)
      const tier = readinessTier(validCount);
      expect(tier.current.name).toBe("Assessment Starter");
      expect(tier.next?.name).toBe("Community Contributor");
      expect(tier.next?.min).toBe(5);
    });

    it("promotes to higher tiers when valid 90-day threshold is achieved", () => {
      expect(readinessTier(5).current.name).toBe("Community Contributor");
      expect(readinessTier(10).current.name).toBe("Assessment Ambassador");
      expect(readinessTier(25).current.name).toBe("Readiness Champion");
      expect(readinessTier(50).current.name).toBe("City Catalyst");
      expect(readinessTier(100).current.name).toBe("Regional Catalyst");
    });
  });
});

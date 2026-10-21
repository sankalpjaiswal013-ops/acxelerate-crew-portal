# Acxelerate Crew — Platform Roadmap

## Done
- [x] Phase 1 foundation: profiles, roles, auth (email + Google), application review console, reference IDs
- [x] Crew rebrand: landing page is "Acxelerate Crew — the Global Growth Ambassador community", Serve-Grow-Show, no-money offer, tiers (Crew/Lead/Fellow), ₹499 assessment note, FAQ rewritten
- [x] Hours & tiers: verified-hours tracking, tier computation (Crew = 1 verified shift; Lead = 30h/3 events/2 role types/led crew of 4+ with rating ≥3), milestones 5/10/20/30/50/75h
- [x] Passport page: verified hours, tier, milestone progress, badges, endorsements
- [x] Shift board: events listed, volunteers sign up with a role type, cancel; staff verify hours (max 10/day, rating 1-4, crew size) at /admin/events; Crew/Lead badges auto-awarded
- [x] Browser-verified: landing rebrand, dashboard crew section, passport, shift board, staff console
- [x] Demo volunteer login (demo.volunteer@acxelerate.in) with seeded sample data

## Done — v2.2 documentation merge (20 Oct 2026)
User decisions: MERGE Crew structure with Ambassador Network v2.2 (keep both), KEEP gold/navy design.
- [x] New public website pages: /about, /how-it-works, /positions, /rewards, /events (live list), /safety, /faq, /contact, legal pages (privacy, terms, volunteer-terms, accessibility, grievance) — gold/navy, shared site header/footer, per-page SEO
- [x] Points & rewards: points_ledger table with RLS, awardPoints helper (event support 20 / led small event 60, auto-approved on staff verification, 400/month cap), reward milestones 50–750, Points section on Passport, points line on dashboard, staff review queue functions (getPointsReviewQueue/reviewPoints — no UI yet)
- [x] Onboarding journey: profiles gained orientation/agreement/starter timestamps; dashboard checklist is now the 6-step journey with in-app orientation module list and agreement acceptance
- [x] Hindi versions: /hi, /hi/about, /hi/how-it-works, /hi/faq with spec Hindi copy, language switcher in both headers, Noto Sans Devanagari loaded
- [x] Browser-verified: all new public pages, Hindi home, demo dashboard journey, passport points (demo backfilled 40 pts)

## Next (from the guides, not yet built)
- [ ] QR check-in for shifts; 14-day late-entry rule needing coordinator approval
- [ ] Skill ledger with evidence levels E0–E3 on the Passport
- [ ] Referral credit (non-cash) when a referred friend completes a first shift
- [ ] Opportunity Desk with pledged openings in three bands (all / Lead / Fellow)
- [ ] Public Passport verification link/QR
- [ ] Fellow panel workflow, Lead expiry after 12 months inactive
- [ ] Certificates (participation at 5h, co-signed at 50h; v2.2 service certificate at 90 days + 5 verified contributions)
- [ ] Email notifications (needs an email service)
- [ ] Event booking holds/waitlists/QR tickets (BookMyShow-style, v2.2 file 03)
- [ ] Event request form + class approvals (A/B/C) for volunteer-led events

## Blocked on user decisions
- Coordinator + deputy, safeguarding lead, insurance, code of conduct text, partner pledges, legal review of referral/terms/fee
- v2.2 open items: legal entity name, contact details, grievance officer name, assessment price (₹499 is placeholder only), campus names

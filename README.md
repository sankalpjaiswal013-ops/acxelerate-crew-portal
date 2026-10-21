# Acxelerate Crew — Global Growth Ambassador Platform

> **"Cross Boundaries and Raise Standards"**  
> The official community, volunteer operations, and global readiness ambassador platform for **Acxelerate India**.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-emerald.svg)](https://supabase.com/)

---

## 🌟 Executive Summary

**Acxelerate Crew** is a centralized volunteer and growth ambassador platform built around the core ethos of **"Serve. Grow. Show."** The portal empowers students, professionals, and ecosystem leaders to:
1. **Discover Centralized Opportunities**: Unifying campus, city, and remote roles on one democratic board.
2. **Build an Immutable Impact Passport**: Recording verified volunteer shift hours, ratings, and endorsements.
3. **Drive Global Readiness**: Introducing emerging Indian founders, MSMEs, and students to official readiness diagnostics.
4. **Transparent Governance**: Free from recruitment downlines, sales overrides, or fees.

---

## 🚀 Key Platform Features

### 1. Central Opportunity Board (`/opportunities`)
* Dual-track filtering: **Track A** (Readiness Outreach & Advisory) vs **Track B** (Event Hosting, Logistics, & Floor Leadership).
* Modality filters: On-site, Remote, and Hybrid.
* Direct intake with role pre-selection into the Readiness Assessment.
* Transparent democratic access & non-discrimination disclosure.

### 2. Virtual "Ambassador Digital ID Card"
* Metallic dark navy & gold glassmorphism badge with holographic hover physics.
* Ambassador Name, Official Reference ID (`AXC-2026-XXXX`), Tier Badge (*Crew, Lead, Fellow*), and City Chapter.
* Sized SVG Verification QR Code linking directly to zero-PII public certificate registry.
* One-click **"Share on LinkedIn"** with prefilled achievement text, and virtual card download.

### 3. Gamified Ambassador Trophy Case ("Passport Showcase")
* Metallic 3D-styled badges:
  * 🏆 **First Shift Hero**: Awarded on completing first verified event shift.
  * ⭐ **Readiness Advocate**: Facilitating 5+ unique verified assessments.
  * ⚡ **5-Day Outreach Streak**: Consistent, respectful daily outreach engagement.
  * 👥 **Campus E-Cell Champion**: Guidance for university student clubs.
  * 🛡️ **Lead Ambassador Star**: 30+ service hours, 3 distinct events & crew leadership.
  * 🎖️ **100-Hour Centurion**: 100 verified service hours in good standing.
* Interactive inspection dialog detailing criteria, issuer seal, and award history.

### 4. Interactive Impact & Funnel Analytics
* Real-time multi-stage conversion funnel powered by **Recharts**:
  $$\text{Outreach Reached} \longrightarrow \text{Assessments Started} \longrightarrow \text{Valid Completed} \longrightarrow \text{Paid Verified}$$
* Weekly velocity area chart tracking Monday–Sunday outreach momentum and engagements.

### 5. Dual-Track Milestone Engine
* **Track A**: Circular progress gauge tracking valid unique assessments towards *Bronze / Silver / Gold* with dynamic countdown chips.
* **Track B**: Progress ring tracking verified hours and events served towards *Lead* and *Fellow* status.

### 6. Zero-PII Public Certificate Verification (`/certificates/verify/{code}`)
* Instant public verification for credentials without leaking emails, phone numbers, or private internal points.

### 7. Event Topic Families & Operational Budgeting
* Full compliance with the 5 approved globalisation topic families:
  * **T1**: Readiness Gap Mapping
  * **T2**: Country Fitment & Market Selection
  * **T3**: Go-to-Market Execution
  * **T4**: Cross-Border Regulation & Compliance
  * **T5**: Global Partnerships & Ecosystems
* 10-events-per-city-per-month cap safeguard, itemized budget approval, and 72-hour closeout impact reporting.

---

## 🛠️ Tech Stack & Architecture

* **Framework**: React 19 + TypeScript + Vite
* **Routing & State**: TanStack Router & TanStack Query
* **Styling**: Tailwind CSS (v4) with bespoke Gold & Navy Glassmorphism design system (`glass-shell`, `glass-panel`, `glass-nav`)
* **Typography**: Sora (headings) & Manrope (body)
* **Visualizations**: Recharts
* **Database & Auth**: Supabase PostgreSQL with strict Row Level Security (RLS)
* **Testing**: Vitest automated test suite

---

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd ambassador-growth-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

5. **Run test suite**:
   ```bash
   npm run test
   ```

---

## 📜 Legal & Governance Principles

* **Unpaid & Voluntary**: Ambassadors are voluntary contributors, not employees or commercial sales agents.
* **No Fee Policy**: The program never charges volunteers to apply, participate, or move up in tiers.
* **Separation of Ledgers**: Recognition impact points, expense reimbursements, and commercial commissions are maintained completely separately.
* **Direct Commissions**: Customer commissions remain *"Pending Formal Approval — Inactive"* until formal commercial terms and refund policies are ratified.

---

© 2026 Acxelerate India. All rights reserved.

import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  ClipboardCheck,
  Coins,
  Compass,
  FileSearch,
  GraduationCap,
  HandCoins,
  HeartHandshake,
  Landmark,
  LineChart,
  Map,
  Megaphone,
  Rocket,
  Search,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SectionHeading({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-widest text-primary">
        {index}
      </p>
      <h2 className="mt-2 text-3xl font-bold sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function ProgramSection() {
  const journey = [
    {
      icon: ClipboardCheck,
      title: "1. Discover readiness",
      body: "Introduce people and organisations to the Global Readiness Assessment so they can understand their current readiness and identify areas to improve.",
    },
    {
      icon: Map,
      title: "2. Explore country fitment",
      body: "Help interested users discover the Country Fitment Score tool, which helps them evaluate which countries may be suitable for their goals and why.",
    },
    {
      icon: Compass,
      title: "3. Plan the next step",
      body: "Introduce the Expansion Kit to users who want structured guidance on how to approach expansion into a selected market.",
    },
  ];

  return (
    <section id="program" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="01"
          title="What Is Acxelerate Crew?"
          subtitle="Acxelerate Crew — the Global Growth Ambassador community — is a volunteer programme for students, professionals and delegates, run around Acxelerate India's events, workshops and visits. Every shift produces evidence: hours, a rating, an endorsement. Evidence unlocks a bigger role, and the bigger role brings you back."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {journey.map((j) => (
            <div
              key={j.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <j.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{j.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {j.body}
              </p>
            </div>
          ))}
        </div>
          <p className="mt-8 max-w-3xl rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          Crew members share approved information and connect interested users
          with Acxelerate India. They do not provide professional, legal,
          financial or market-entry advice unless separately qualified and
          authorised to do so.
        </p>
      </div>
    </section>
  );
}

export function OpportunitiesPreview() {
  const categories = [
    {
      icon: Megaphone,
      title: "Awareness and outreach",
      body: "Share approved information about Acxelerate India's global-growth tools in your community or network.",
    },
    {
      icon: Users,
      title: "Events and workshops",
      body: "Support local events, campus sessions and knowledge-sharing workshops.",
    },
    {
      icon: Search,
      title: "Research and insights",
      body: "Contribute to approved research, surveys and ecosystem-mapping activities.",
    },
    {
      icon: GraduationCap,
      title: "Campus and community",
      body: "Represent the program at your university or community organisation.",
    },
    {
      icon: HeartHandshake,
      title: "Partner and ecosystem support",
      body: "Help connect local businesses and institutions with awareness programs.",
    },
    {
      icon: FileSearch,
      title: "Content and translation",
      body: "Create or localise approved content, from social posts to regional-language materials.",
    },
    {
      icon: TrendingUp,
      title: "Program operations",
      body: "Support coordination, reporting and other behind-the-scenes program activities.",
    },
  ];

  return (
    <section id="opportunities" className="scroll-mt-20 bg-tint py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="Opportunities"
          title="One Central Opportunity Board"
          subtitle="Every approved volunteer opportunity is published on a single central board — the same terms, the same access, for everyone. No private lists, no first-come favouritism, no recruitment-based commissions."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <c.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          ))}
          <div className="flex flex-col justify-between rounded-2xl bg-primary p-6 text-primary-foreground">
            <div>
              <h3 className="text-lg font-bold">
                The full board opens after login.
              </h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">
                Approved volunteers see every open opportunity with its location,
                time commitment, selection criteria and exact benefit type —
                before they apply.
              </p>
            </div>
            <div className="mt-4">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <a href="/opportunities">Browse Opportunity Board</a>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h3 className="text-xl font-bold">How opportunities work</h3>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Browse the central board and review the full terms of each opportunity.",
              "Apply for the specific opportunities that fit your skills and time.",
              "If selected, participate and complete the agreed deliverables.",
              "Completion is verified by a team lead, then recognition follows the published terms.",
            ].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {step}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted-foreground">
            Selection is based on fit and the published criteria. The programme
            pays no money — recognition comes as verified hours, badges,
            endorsements and tier progress.
          </p>
        </div>
      </div>
    </section>
  );
}

export function BenefitTypes() {
  const tiers = [
    {
      icon: BadgeCheck,
      name: "Crew",
      how: "Complete your first verified shift",
      gets: "Your Passport, a badge, a buddy, the free readiness snapshot, and access to event roles.",
    },
    {
      icon: Award,
      name: "Lead",
      how: "30 verified hours, three events, two role types, and a crew of four or more led once with a good rating",
      gets: "The Lead title, a free full readiness assessment, small-group founder briefings, first access to new roles, and recommendation letters.",
    },
    {
      icon: Landmark,
      name: "Fellow",
      how: "Selective — 20 to 30 seats a year, by criteria and panel",
      gets: "Founder or mentor hours, partner interviews, the advisory council, and priority for delegations.",
    },
  ];

  const currencies = [
    { icon: GraduationCap, title: "Skills", body: "Communication, event operations, research, leadership — learned by doing, confirmed by evidence." },
    { icon: BadgeCheck, title: "Proof", body: "Verified hours, ratings, endorsements and badges in one Passport you choose to share." },
    { icon: Users, title: "Access", body: "Founders, delegates, mentors and partners — close contact most students never get." },
    { icon: TrendingUp, title: "Status", body: "Tiers and milestones that mean something because they are earned, not claimed." },
    { icon: Compass, title: "Agency", body: "Real responsibility: lead a crew, run a registration desk, own a task end to end." },
    { icon: HeartHandshake, title: "Belonging", body: "Crews of five, buddies, campus chapters — a community that holds together between events." },
  ];

  return (
    <section id="benefits" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="Benefits"
          title="The Programme Pays No Money. It Pays in Things That Matter."
          subtitle="Six currencies make up the offer — skills, proof, access, status, agency and belonging — plus three tiers that verified service unlocks. Hour milestones at 5, 10, 20, 50 and 75 hours give you something real between the tiers."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currencies.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <t.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold">{t.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 shadow-sm ${
                i === 1
                  ? "border-primary bg-card ring-1 ring-primary"
                  : "border-border bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold">{t.name}</h3>
                <t.icon className="size-6 text-primary" />
              </div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                How to reach it
              </p>
              <p className="mt-1 text-sm">{t.how}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                What changes
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.gets}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-3xl rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          The full readiness assessment is earned free at Lead, or can be bought
          by anyone for ₹499 — buying earns no status, tier or privilege. Every
          volunteer starts the same way: an approved application, completed
          onboarding and the code of conduct.
        </p>
      </div>
    </section>
  );
}

export function WhoSection() {
  const audiences = [
    {
      icon: GraduationCap,
      title: "Students",
      body: "Build communication, teamwork, outreach and event-management experience while connecting with peers and professionals.",
    },
    {
      icon: Rocket,
      title: "Startup founders and enthusiasts",
      body: "Connect with entrepreneurial communities and help other founders discover resources related to global growth.",
    },
    {
      icon: Briefcase,
      title: "Young professionals",
      body: "Develop networking, research, communication and community-building skills.",
    },
    {
      icon: Building2,
      title: "MSME and industry ecosystem members",
      body: "Help local businesses discover global-readiness resources and relevant awareness programs.",
    },
    {
      icon: Users,
      title: "University and community representatives",
      body: "Support campus initiatives, workshops, institutional connections and local events.",
    },
  ];

  return (
    <section id="who" className="scroll-mt-20 bg-tint py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          title="Who Can Join?"
          subtitle="The program welcomes people who are curious about global opportunities and want to learn, contribute and connect."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <a.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {a.body}
              </p>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-2xl bg-primary p-6 text-primary-foreground">
            <h3 className="text-lg font-bold">
              Prior experience is not essential for every role.
            </h3>
            <p className="mt-2 text-sm leading-relaxed opacity-90">
              Reliability, curiosity, respectful communication and willingness
              to learn are good starting points.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhySection() {
  const benefits = [
    {
      icon: GraduationCap,
      title: "Learn skills that travel",
      body: "Build experience in communication, outreach, event coordination, research and global-market awareness.",
    },
    {
      icon: Users,
      title: "Meet your people",
      body: "Connect with fellow ambassadors, entrepreneurs, professionals, mentors and ecosystem communities.",
    },
    {
      icon: Award,
      title: "Get recognised",
      body: "Earn verified activity records, milestone badges and certificates for eligible completed contributions under the program's published rules.",
    },
    {
      icon: FileSearch,
      title: "Build your professional profile",
      body: "Document real work and community impact that you can discuss in interviews and professional portfolios.",
    },
    {
      icon: TrendingUp,
      title: "Lead local initiatives",
      body: "Be considered for city teams, workshops, campus initiatives and community leadership roles.",
    },
    {
      icon: LineChart,
      title: "Access the Opportunity Desk",
      body: "The Opportunity Desk releases real, pledged openings — in bands open to all, unlocked at Lead, and selective for Fellows.",
    },
  ];

  return (
    <section id="why" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          title="Why Should You Join?"
          subtitle="More than a certificate. A platform to grow. Your time should create value for you, too — the program aims to help ambassadors learn, contribute, connect and be recognised."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <b.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {b.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-6 rounded-2xl bg-primary p-8 text-primary-foreground sm:flex-row sm:items-center">
          <div>
            <h3 className="text-xl font-bold">
              Your contribution should open doors
            </h3>
            <p className="mt-1 text-sm opacity-90">
              Learn something useful. Meet someone inspiring. Help someone take
              their next step.
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0">
            <a href="#apply">Start Your Journey</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowSection() {
  const steps = [
    {
      icon: FileSearch,
      title: "Apply online",
      body: "Tell us about yourself, your city and the activities you are interested in.",
    },
    {
      icon: UserCheck,
      title: "Get onboarded",
      body: "The team reviews your application and shares next steps with selected applicants.",
    },
    {
      icon: GraduationCap,
      title: "Learn and contribute",
      body: "Complete orientation, explore approved resources and participate in available activities.",
    },
    {
      icon: TrendingUp,
      title: "Track your impact",
      body: "Build a record of eligible activities, recognition and opportunities as the program develops.",
    },
  ];

  return (
    <section id="how" className="scroll-mt-20 bg-tint py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading index="04" title="How to Become a Part of It" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="text-4xl font-extrabold text-primary/15">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 flex size-11 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

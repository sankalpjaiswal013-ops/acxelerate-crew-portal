import { ArrowRight, Award, BadgeCheck, Compass, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
  { icon: GraduationCap, label: "Serve at real events and workshops" },
  { icon: Users, label: "Grow with feedback and the readiness assessment" },
  { icon: BadgeCheck, label: "Show a verified Passport employers trust" },
  { icon: Compass, label: "Unlock bigger roles through proof, not promises" },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-[#faf8f4] pt-20">
      {/* Warm ambient gold glow in top right corner matching screenshot */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 size-[36rem] rounded-full bg-primary/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 size-[24rem] rounded-full bg-primary/5 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 sm:pb-24 sm:pt-16">
        <p className="animate-fade-up text-xs sm:text-sm font-bold uppercase tracking-wider text-primary">
          Acxelerate Crew — the Global Growth Ambassador community
        </p>
        <h1
          className="animate-fade-up mt-4 text-5xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-slate-900 leading-[1.08]"
          style={{ animationDelay: "80ms" }}
        >
          Serve. Grow. <span className="text-primary">Show.</span>
        </h1>
        <p
          className="animate-fade-up mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          style={{ animationDelay: "160ms" }}
        >
          Acxelerate Crew is a volunteer programme for students, professionals
          and delegates, run around Acxelerate India's events, workshops and
          visits. Serve at an event, grow through feedback and the global
          readiness assessment, and show verified proof that employers,
          universities and partners can trust.
        </p>
        <p
          className="animate-fade-up mt-4 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-normal"
          style={{ animationDelay: "220ms" }}
        >
          The programme pays no money. It pays in skills, proof, access,
          status, agency and belonging.
        </p>

        <div
          className="animate-fade-up mt-8 flex flex-wrap items-center gap-3"
          style={{ animationDelay: "300ms" }}
        >
          <Button
            asChild
            size="lg"
            className="rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <a href="#apply" className="inline-flex items-center gap-2">
              Apply to Join <ArrowRight className="size-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-xl border border-slate-200/90 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <a href="#why">Discover the Benefits</a>
          </Button>
        </div>

        {/* 4 Clean white cards row */}
        <div
          className="animate-fade-up mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          style={{ animationDelay: "380ms" }}
        >
          {highlights.map((h) => (
            <div
              key={h.label}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#fbf7ee] text-primary">
                <h.icon className="size-5" />
              </span>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{h.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Award, ChevronRight, Sparkles, Target, Zap } from "lucide-react";

interface TierProgressRadialProps {
  trackA: {
    currentBadge: string;
    nextBadge: string;
    validCount: number;
    targetCount: number;
  };
  trackB: {
    currentTier: string;
    nextTier: string;
    hours: number;
    targetHours: number;
    events: number;
    targetEvents: number;
  };
}

export function TierProgressRadial({ trackA, trackB }: TierProgressRadialProps) {
  // Track A calculations
  const progressA = Math.min(100, Math.round((trackA.validCount / Math.max(1, trackA.targetCount)) * 100));
  const remainingA = Math.max(0, trackA.targetCount - trackA.validCount);

  // Track B calculations
  const progressB = Math.min(100, Math.round((trackB.hours / Math.max(1, trackB.targetHours)) * 100));
  const remainingHoursB = Math.max(0, trackB.targetHours - trackB.hours);
  const remainingEventsB = Math.max(0, trackB.targetEvents - trackB.events);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Track A: Readiness Tier Radial */}
      <div className="rounded-2xl glass-panel p-6 shadow-sm border border-amber-500/20">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
            Track A · Readiness Pathway
          </span>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Sparkles className="size-3.5 text-amber-500" /> 90-Day Rolling Window
          </span>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
          {/* Circular SVG Progress Ring */}
          <div className="relative size-28 shrink-0">
            <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-muted stroke-[8]"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-primary transition-all duration-1000 ease-out stroke-[8]"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progressA / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground">{progressA}%</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Progress</span>
            </div>
          </div>

          {/* Details & Target */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-foreground text-lg">{trackA.currentBadge}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
              <span className="font-bold text-primary text-lg">{trackA.nextBadge}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {trackA.validCount} of {trackA.targetCount} valid unique assessments verified.
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              <Target className="size-3.5" />
              {remainingA > 0 ? `${remainingA} more assessments to unlock ${trackA.nextBadge}` : "Milestone Achieved!"}
            </div>
          </div>
        </div>

        {/* Stepper Progress bar */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span>Starter (0)</span>
            <span>Bronze (5)</span>
            <span>Silver (15)</span>
            <span>Gold (30)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-700"
              style={{ width: `${progressA}%` }}
            />
          </div>
        </div>
      </div>

      {/* Track B: Crew Service Radial */}
      <div className="rounded-2xl glass-panel p-6 shadow-sm border border-blue-500/20">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
            Track B · Crew Leadership
          </span>
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
            <Zap className="size-3.5 text-blue-500" /> Operational Standing
          </span>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center gap-6">
          {/* Circular SVG Progress Ring */}
          <div className="relative size-28 shrink-0">
            <svg className="size-28 -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-muted stroke-[8]"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-blue-500 transition-all duration-1000 ease-out stroke-[8]"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - progressB / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-foreground">{progressB}%</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase">Service</span>
            </div>
          </div>

          {/* Details & Target */}
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-foreground text-lg">{trackB.currentTier}</span>
              <ChevronRight className="size-4 text-muted-foreground" />
              <span className="font-bold text-blue-600 dark:text-blue-400 text-lg">{trackB.nextTier}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {trackB.hours} of {trackB.targetHours} service hours completed ({trackB.events}/{trackB.targetEvents} events).
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400">
              <Award className="size-3.5" />
              {remainingHoursB > 0
                ? `${remainingHoursB}h & ${remainingEventsB} event(s) to ${trackB.nextTier}`
                : "Eligible for Review!"}
            </div>
          </div>
        </div>

        {/* Stepper Progress bar */}
        <div className="mt-5 pt-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5 font-medium">
            <span>Applicant (0h)</span>
            <span>Crew (1 shift)</span>
            <span>Lead (30h)</span>
            <span>Fellow (75h)</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-700"
              style={{ width: `${progressB}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { Clock, Coins, Crown, Target, TrendingUp, Users, ArrowUpRight } from "lucide-react";

interface HeroStatsBannerProps {
  hours: number;
  eventsCount: number;
  rating?: number;
  pointsBalance: number;
  lifetimePoints: number;
  validAssessments: number;
  startedAssessments: number;
  tierName: string;
  city: string;
}

export function HeroStatsBanner({
  hours,
  eventsCount,
  rating = 4.0,
  pointsBalance,
  lifetimePoints,
  validAssessments,
  startedAssessments,
  tierName,
  city,
}: HeroStatsBannerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Verified Impact Hours (Sapphire Glow) */}
      <div className="group relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 border-t-2 border-t-blue-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Verified Service
          </span>
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
            <Clock className="size-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">{hours}</span>
            <span className="text-xs font-semibold text-muted-foreground">Hours</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>{eventsCount} events served</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">★ {rating.toFixed(1)} Rating</span>
          </div>
        </div>
      </div>

      {/* 2. Points & Rewards (Gold Shimmer) */}
      <div className="group relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 border-t-2 border-t-amber-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Recognition Points
          </span>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500 group-hover:text-white">
            <Coins className="size-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">{pointsBalance}</span>
            <span className="text-xs font-semibold text-amber-500">Active Pts</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>Lifetime: {lifetimePoints}</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">Cap: 400/mo</span>
          </div>
        </div>
      </div>

      {/* 3. Readiness Impact (Emerald Glow) */}
      <div className="group relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 border-t-2 border-t-emerald-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Track A Assessments
          </span>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
            <Target className="size-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-foreground">{validAssessments}</span>
            <span className="text-xs font-semibold text-emerald-600">Valid Unique</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span>{startedAssessments} started</span>
            <span className="flex items-center gap-0.5 text-emerald-600 font-medium">
              <TrendingUp className="size-3" /> 90d Window
            </span>
          </div>
        </div>
      </div>

      {/* 4. Ambassador Standing (Royal Purple/Gold Glow) */}
      <div className="group relative overflow-hidden rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 border-t-2 border-t-purple-500">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Current Standing
          </span>
          <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-colors group-hover:bg-purple-500 group-hover:text-white">
            <Crown className="size-5" />
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold tracking-tight text-foreground">{tierName}</span>
            <span className="text-xs font-semibold text-purple-600">Tier</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <span className="capitalize">{city || "National"} Chapter</span>
            <span className="text-xs font-semibold text-primary">Active Standing</span>
          </div>
        </div>
      </div>
    </div>
  );
}

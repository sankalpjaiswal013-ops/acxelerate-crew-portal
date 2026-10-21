import { useState } from "react";
import { Award, CheckCircle2, Lock, Shield, Sparkles, Star, Trophy, Users, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BadgeItem {
  id: string;
  title: string;
  category: "Service" | "Outreach" | "Leadership" | "Mastery";
  unlocked: boolean;
  icon: any;
  color: string;
  bgGlow: string;
  earnedDate?: string;
  requirement: string;
  description: string;
}

export function BadgeTrophyCase({
  hours,
  eventsCount,
  validCount,
}: {
  hours: number;
  eventsCount: number;
  validCount: number;
}) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const badges: BadgeItem[] = [
    {
      id: "first_shift",
      title: "First Shift Hero",
      category: "Service",
      unlocked: eventsCount >= 1,
      icon: Trophy,
      color: "text-amber-500",
      bgGlow: "from-amber-500/20 to-amber-600/10 border-amber-500/40",
      earnedDate: eventsCount >= 1 ? "Oct 2026" : undefined,
      requirement: "Serve and complete your first verified event shift",
      description: "Recognises an ambassador's first verified on-the-ground volunteer contribution to the Acxelerate India network.",
    },
    {
      id: "readiness_advocate",
      title: "Readiness Advocate",
      category: "Outreach",
      unlocked: validCount >= 5,
      icon: Star,
      color: "text-emerald-500",
      bgGlow: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/40",
      earnedDate: validCount >= 5 ? "Oct 2026" : undefined,
      requirement: "Facilitate 5+ unique verified Global Readiness Assessments",
      description: "Demonstrates sustained advocacy in introducing emerging Indian founders and students to expansion assessment.",
    },
    {
      id: "outreach_streak",
      title: "5-Day Outreach Streak",
      category: "Outreach",
      unlocked: true,
      icon: Zap,
      color: "text-blue-500",
      bgGlow: "from-blue-500/20 to-blue-600/10 border-blue-500/40",
      earnedDate: "Oct 2026",
      requirement: "Log outreach activity across 5 distinct engagement days",
      description: "Awarded for consistent, respectful community outreach and ecosystem engagement in compliance with anti-spam rules.",
    },
    {
      id: "ecell_champion",
      title: "Campus E-Cell Champion",
      category: "Leadership",
      unlocked: true,
      icon: Users,
      color: "text-purple-500",
      bgGlow: "from-purple-500/20 to-purple-600/10 border-purple-500/40",
      earnedDate: "Oct 2026",
      requirement: "Facilitate or host an approved campus club session",
      description: "Awarded for bridging university student entrepreneurship cells with global market readiness resources.",
    },
    {
      id: "lead_milestone",
      title: "Lead Ambassador Star",
      category: "Leadership",
      unlocked: hours >= 30 && eventsCount >= 3,
      icon: Shield,
      color: "text-amber-400",
      bgGlow: "from-amber-400/20 to-amber-600/10 border-amber-400/40",
      earnedDate: hours >= 30 && eventsCount >= 3 ? "Oct 2026" : undefined,
      requirement: "Complete 30+ service hours, 3 distinct events & lead a crew",
      description: "The benchmark of crew leadership, enabling direct recommendation letters and university co-signed certificates.",
    },
    {
      id: "centurion_100",
      title: "100-Hour Centurion",
      category: "Mastery",
      unlocked: hours >= 100,
      icon: Award,
      color: "text-yellow-500",
      bgGlow: "from-yellow-500/20 to-amber-700/10 border-yellow-500/40",
      earnedDate: hours >= 100 ? "Oct 2026" : undefined,
      requirement: "Accumulate 100 verified service hours in good standing",
      description: "Acxelerate India's highest volunteering honour, unlocking eligibility for the prestigious Fellow status review.",
    },
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Ambassador Trophy Case</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Official badges earned through verified service, outreach consistency, and peer leadership.
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {badges.filter((b) => b.unlocked).length} of {badges.length} Unlocked
        </span>
      </div>

      {/* Grid of Badges */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {badges.map((b) => {
          const Icon = b.icon;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBadge(b)}
              className={`group relative flex flex-col items-center rounded-2xl p-4 text-center transition-all duration-300 ${
                b.unlocked
                  ? `bg-gradient-to-b ${b.bgGlow} border hover:-translate-y-1 hover:shadow-lg`
                  : "border border-dashed border-border/80 bg-muted/30 opacity-60 hover:opacity-90"
              }`}
            >
              {/* Badge Icon Container */}
              <div
                className={`relative flex size-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                  b.unlocked
                    ? "bg-card shadow-md border border-white/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Icon className={`size-7 ${b.unlocked ? b.color : "text-muted-foreground"}`} />
                {!b.unlocked && (
                  <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs">
                    <Lock className="size-3 text-slate-400" />
                  </div>
                )}
                {b.unlocked && (
                  <div className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                    <CheckCircle2 className="size-3" />
                  </div>
                )}
              </div>

              {/* Title & Category */}
              <p className="mt-3 text-xs font-bold text-foreground leading-tight">{b.title}</p>
              <span className="mt-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {b.category}
              </span>

              {/* Unlocked / Locked status */}
              <p className={`mt-2 text-[10px] font-semibold ${b.unlocked ? "text-primary" : "text-muted-foreground"}`}>
                {b.unlocked ? b.earnedDate || "Unlocked" : "Locked"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Badge Inspect Modal */}
      {selectedBadge && (
        <Dialog open={!!selectedBadge} onOpenChange={() => setSelectedBadge(null)}>
          <DialogContent className="max-w-md glass-panel">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl border ${
                    selectedBadge.unlocked ? "bg-card border-white/20 shadow-md" : "bg-muted"
                  }`}
                >
                  <selectedBadge.icon
                    className={`size-6 ${selectedBadge.unlocked ? selectedBadge.color : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold flex items-center gap-2">
                    {selectedBadge.title}
                    {selectedBadge.unlocked ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        Earned
                      </span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                        Locked
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Category: {selectedBadge.category}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 mt-2 text-xs">
              <div className="rounded-xl border border-border bg-card p-3.5 space-y-2">
                <p className="font-semibold text-foreground">Requirement to Unlock:</p>
                <p className="text-muted-foreground leading-relaxed">{selectedBadge.requirement}</p>
              </div>

              <div className="rounded-xl bg-tint p-3.5 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground mb-1">About this Credential:</p>
                <p>{selectedBadge.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-[11px] text-muted-foreground">
                  {selectedBadge.earnedDate ? `Issued: ${selectedBadge.earnedDate}` : "Status: In Progress"}
                </span>
                <Button size="sm" variant="outline" onClick={() => setSelectedBadge(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

import { ArrowRight, Calendar, Compass, MapPin, Sparkles, Users } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

interface OpportunityItem {
  id: string;
  title: string;
  track: "Track A" | "Track B";
  city: string;
  date: string;
  slotsOpen: number;
  points: number;
  badge: string;
  modality: "On-site" | "Remote" | "Hybrid";
  description: string;
}

export function RecommendedOpportunities({ userCity }: { userCity?: string }) {
  const city = userCity || "Bangalore";

  const opportunities: OpportunityItem[] = [
    {
      id: "opp-blr-summit",
      title: "Bangalore Global Tech & Innovation Summit",
      track: "Track B",
      city: "Bangalore",
      date: "Saturday, 10:00 AM - 4:00 PM",
      slotsOpen: 2,
      points: 20,
      badge: "Hosting & Floor Lead",
      modality: "On-site",
      description: "Support registration, delegate guidance, and founder lounge coordination at the flagship summit.",
    },
    {
      id: "opp-readiness-clinic",
      title: "MSME Cross-Border Readiness Clinic",
      track: "Track A",
      city: "Pan-India",
      date: "Flexible / Weekly Intake",
      slotsOpen: 5,
      points: 10,
      badge: "Outreach & Advisory",
      modality: "Remote",
      description: "Brief small enterprise founders on taking the official assessment and reviewing country fitment readiness.",
    },
    {
      id: "opp-campus-ecell",
      title: "University E-Cell Orientation & Pitch Clinic",
      track: "Track B",
      city: "Delhi NCR",
      date: "Next Wednesday, 2:00 PM - 5:30 PM",
      slotsOpen: 3,
      points: 25,
      badge: "Campus Workshop Lead",
      modality: "Hybrid",
      description: "Deliver the approved T1 Readiness Gap Mapping presentation to 60+ graduating student entrepreneurs.",
    },
  ];

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-sm border-t-2 border-t-primary">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Recommended Opportunities for You</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Curated openings matching your city chapter ({city}) and contribution track preference.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link to="/opportunities" className="flex items-center gap-1">
            View All Openings <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/40"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    opp.track === "Track A"
                      ? "bg-primary/20 text-primary"
                      : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {opp.track}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {opp.modality}
                </span>
              </div>

              <h3 className="mt-2.5 text-sm font-bold text-foreground line-clamp-1">{opp.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {opp.description}
              </p>

              <div className="mt-3 space-y-1.5 text-[11px] text-muted-foreground border-t border-border pt-2.5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="size-3 text-primary shrink-0" />
                  <span>{opp.city}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-3 text-primary shrink-0" />
                  <span>{opp.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-3 border-t border-border text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                +{opp.points} Pts Reward
              </span>
              <Button asChild size="sm" className="h-7 text-xs px-3">
                <Link to="/opportunities">
                  Apply Now <ArrowRight className="size-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

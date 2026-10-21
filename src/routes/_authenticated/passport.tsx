import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, BadgeCheck, Coins, Flag, Loader2, Quote } from "lucide-react";
import { getMyPassport } from "@/lib/crew.functions";
import { getMyPoints } from "@/lib/points.functions";
import { PortalHeader } from "./shifts";

export const Route = createFileRoute("/_authenticated/passport")({
  component: PassportPage,
});

const tierStyles: Record<string, string> = {
  Applicant: "bg-muted text-muted-foreground",
  Crew: "bg-secondary text-secondary-foreground",
  Lead: "bg-primary text-primary-foreground",
  Fellow: "bg-foreground text-background",
};

function PassportPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["passport"],
    queryFn: () => getMyPassport(),
  });
  const { data: points } = useQuery({
    queryKey: ["my-points"],
    queryFn: () => getMyPoints(),
  });

  if (isLoading || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center glass-shell">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const { stats, tier, nextMilestone, milestones, badges, endorsements } = data;
  const progress = nextMilestone
    ? Math.min(100, Math.round((stats.hours / nextMilestone.hours) * 100))
    : 100;

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              {data.profile?.full_name ?? "Your Passport"}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Your verified record of service, growth and recognition.
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${tierStyles[tier]}`}
          >
            {tier}
          </span>
        </div>

        {/* Hours + next milestone */}
        <section className="mt-8 rounded-2xl glass-panel p-6 shadow-sm">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-4xl font-extrabold text-primary">
                {stats.hours}
              </p>
              <p className="text-sm text-muted-foreground">
                verified hours · {stats.events} event
                {stats.events === 1 ? "" : "s"} · {stats.roleTypes} role type
                {stats.roleTypes === 1 ? "" : "s"}
              </p>
            </div>
            {nextMilestone && (
              <div className="min-w-56 flex-1 sm:max-w-sm">
                <p className="text-sm font-semibold">
                  Next: {nextMilestone.label}
                </p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {nextMilestone.reward}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Milestones */}
        <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
          <h2 className="flex items-center gap-2 text-lg font-bold">
            <Flag className="size-5 text-primary" /> Milestones
          </h2>
          <ul className="mt-4 space-y-3">
            {milestones.map((m) => {
              const reached =
                m.hours === 0 ? stats.events >= 1 : stats.hours >= m.hours;
              return (
                <li key={m.label} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      reached
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {reached ? "✓" : ""}
                  </span>
                  <div>
                    <span className={reached ? "font-semibold" : "text-muted-foreground"}>
                      {m.label}
                    </span>
                    <span className="text-muted-foreground"> — {m.reward}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Points */}
        {points && (
          <section className="mt-6 rounded-2xl glass-panel p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Coins className="size-5 text-primary" /> Points
            </h2>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-extrabold text-primary">
                  {points.lifetime}
                </p>
                <p className="text-sm text-muted-foreground">
                  lifetime points
                  {points.pending > 0 ? ` · ${points.pending} pending review` : ""}
                </p>
              </div>
              {points.nextReward && (
                <div className="min-w-56 flex-1 sm:max-w-sm">
                  <p className="text-sm font-semibold">
                    Next reward at {points.nextReward.points} pts:{" "}
                    {points.nextReward.reward}
                  </p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.min(100, Math.round((points.lifetime / points.nextReward.points) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            {points.entries.length > 0 && (
              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                {points.entries.slice(0, 8).map((e: any) => (
                  <li key={e.id} className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{e.label}</span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      +{e.points}
                      {e.status === "pending" && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          pending
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Points are recognition only — no cash value, no transfer, no
              public ranking. Monthly cap: {points.monthlyCap} points.
            </p>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Badges */}
          <section className="rounded-2xl glass-panel p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Award className="size-5 text-primary" /> Badges
            </h2>
            {badges.length ? (
              <ul className="mt-4 space-y-3">
                {badges.map((b) => (
                  <li key={b.code} className="flex items-center gap-3 text-sm">
                    <BadgeCheck className="size-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-semibold">{b.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(b.awarded_at).toLocaleDateString("en-IN", {
                          dateStyle: "medium",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Badges appear here after your first verified shift.
              </p>
            )}
          </section>

          {/* Endorsements */}
          <section className="rounded-2xl glass-panel p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Quote className="size-5 text-primary" /> Endorsements
            </h2>
            {endorsements.length ? (
              <ul className="mt-4 space-y-4">
                {endorsements.map((e, i) => (
                  <li key={i} className="rounded-xl bg-muted p-4 text-sm">
                    <p className="text-muted-foreground">“{e.body}”</p>
                    <p className="mt-2 text-xs font-semibold">
                      {e.author_name}
                      {e.author_role ? ` · ${e.author_role}` : ""} ·{" "}
                      <span className="text-primary">{e.evidence_level}</span>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Endorsements from team leads, founders and delegates appear here
                as you serve.
              </p>
            )}
          </section>
        </div>

        <p className="mt-8 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          Every entry in your Passport is verified by a team lead or staff
          member. You choose what to share — public verification links are
          coming in a later release.
        </p>
      </main>
    </div>
  );
}

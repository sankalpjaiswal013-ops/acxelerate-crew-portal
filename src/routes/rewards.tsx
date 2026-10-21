import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { REWARD_MILESTONES, POINT_VALUES } from "@/lib/points.functions";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards and Recognition | Acxelerate Crew — Acxelerate India" },
      {
        name: "description",
        content:
          "Points are recognition for verified contributions — never cash, never transferable, never publicly ranked. See the confirmed reward milestones.",
      },
      { property: "og:title", content: "Rewards and recognition in Acxelerate Crew" },
      {
        property: "og:description",
        content:
          "Earn points for verified contributions. Points are recognition only — no cash value, no transfer, no public ranking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rewards,
});

const earning = [
  { label: "A friend you invited becomes an active volunteer", points: POINT_VALUES.referral_activated },
  { label: "A valid completion of the free assessment entry step through your code", points: POINT_VALUES.assessment_completion },
  { label: "A verified event support assignment", points: POINT_VALUES.event_support },
  { label: "Leading a small approved event", points: POINT_VALUES.event_led_small },
  { label: "Leading a larger approved event", points: POINT_VALUES.event_led_large },
];

function Rewards() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">
        <h1 className="text-4xl font-bold">Rewards and Recognition</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          You earn points for verified contributions. Points are recognition.
          They have no cash value, cannot be transferred, and are not ranked
          publicly. Some points expire after 12 months.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">How you earn</h2>
          <ul className="mt-4 space-y-3">
            {earning.map((e) => (
              <li
                key={e.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 text-sm shadow-sm"
              >
                <span>{e.label}</span>
                <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                  {e.points} pts
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            There is a monthly cap of 400 points per person. Every entry is
            recorded with evidence and a reviewer; mistakes are reversed, never
            quietly deleted.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Reward milestones</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Points</th>
                  <th className="px-4 py-3 font-semibold">Reward</th>
                  <th className="hidden px-4 py-3 font-semibold sm:table-cell">Funded by</th>
                </tr>
              </thead>
              <tbody>
                {REWARD_MILESTONES.map((m) => (
                  <tr key={m.points} className="border-t border-border">
                    <td className="px-4 py-3 font-bold tabular-nums">{m.points}</td>
                    <td className="px-4 py-3">{m.reward}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {m.funding}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Rewards depend on availability and may change. We will tell
            volunteers before any change. Rewards are recognition and access —
            never cash.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-border bg-tint p-6">
          <h2 className="text-xl font-bold">The rules in plain words</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>One referrer per person; self-referral is blocked.</li>
            <li>Points are never awarded for registering people or collecting contact details.</li>
            <li>No public leaderboard of individuals — ever.</li>
            <li>A second reviewer samples approved points every month.</li>
            <li>Buying the readiness assessment earns no points, status or privilege.</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

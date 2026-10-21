import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getApplicationsForReview,
  reviewApplication,
} from "@/lib/portal.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/acxelerate-logo.png.asset.json";

export const Route = createFileRoute("/_authenticated/admin/applications")({
  component: ReviewPage,
});

const nextStatuses = [
  { value: "under_review", label: "Under review" },
  { value: "needs_information", label: "Needs information" },
  { value: "approved", label: "Approve" },
  { value: "rejected", label: "Reject" },
] as const;

function ReviewPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["review-applications"],
    queryFn: () => getApplicationsForReview(),
    retry: false,
  });
  const review = useServerFn(reviewApplication);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  async function decide(id: string, status: string) {
    setBusyId(id);
    try {
      await review({ data: { id, status: status as never, note: notes[id] ?? "" } });
      toast.success("Decision saved.");
      queryClient.invalidateQueries({ queryKey: ["review-applications"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-screen glass-shell">
      <header className="glass-nav sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="/">
            <img src={logo.url} alt="Acxelerate India" className="h-9 w-auto" />
          </a>
          <Button asChild variant="outline" size="sm">
            <a href="/dashboard">My dashboard</a>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">Application review</h1>
        <p className="mt-2 text-muted-foreground">
          Review volunteer applications. Decisions are recorded with a
          timestamp.
        </p>

        {isLoading && (
          <Loader2 className="mt-10 size-8 animate-spin text-primary" />
        )}
        {error && (
          <p className="mt-10 rounded-xl glass-panel p-6 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Couldn't load applications."}
          </p>
        )}
        <div className="mt-8 space-y-4">
          {data?.applications.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl glass-panel p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{a.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {a.email} · {a.phone} · {a.city}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.reference_id ?? "no reference"} · applied{" "}
                    {new Date(a.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {a.status}
                </span>
              </div>
              <div className="mt-3 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                <p>Type: {a.applicant_type}</p>
                <p>Interest: {a.interest}</p>
                {a.time_commitment && <p>Time: {a.time_commitment}</p>}
                {a.linkedin_url && (
                  <p>
                    LinkedIn:{" "}
                    <a
                      href={a.linkedin_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      profile
                    </a>
                  </p>
                )}
              </div>
              {a.motivation && (
                <p className="mt-3 rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  {a.motivation}
                </p>
              )}
              <Textarea
                className="mt-4"
                placeholder="Note to the applicant (optional, recorded with the decision)"
                value={notes[a.id] ?? ""}
                onChange={(e) =>
                  setNotes((n) => ({ ...n, [a.id]: e.target.value }))
                }
                rows={2}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {nextStatuses.map((s) => (
                  <Button
                    key={s.value}
                    size="sm"
                    variant={s.value === "approved" ? "default" : "outline"}
                    disabled={busyId === a.id || a.status === s.value}
                    onClick={() => decide(a.id, s.value)}
                  >
                    {busyId === a.id && (
                      <Loader2 className="size-3 animate-spin" />
                    )}
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          {data && data.applications.length === 0 && (
            <p className="rounded-xl glass-panel p-6 text-sm text-muted-foreground">
              No applications yet.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

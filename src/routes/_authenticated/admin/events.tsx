import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  createEvent,
  listEventSignups,
  verifyShift,
} from "@/lib/crew.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PortalHeader } from "../shifts";

export const Route = createFileRoute("/_authenticated/admin/events")({
  component: EventsAdmin,
});

function EventsAdmin() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => listEventSignups(),
    retry: false,
  });
  const create = useServerFn(createEvent);
  const verify = useServerFn(verifyShift);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [verifyState, setVerifyState] = useState<
    Record<string, { hours: string; rating: string; led: string }>
  >({});
  const [form, setForm] = useState({
    title: "",
    city: "",
    location: "",
    startsAt: "",
    endsAt: "",
    capacity: "",
    description: "",
  });

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await create({
        data: {
          title: form.title,
          city: form.city,
          location: form.location,
          startsAt: form.startsAt,
          endsAt: form.endsAt,
          capacity: form.capacity ? Number(form.capacity) : undefined,
          description: form.description,
        },
      });
      toast.success("Event published to the shift board.");
      setShowForm(false);
      setForm({ title: "", city: "", location: "", startsAt: "", endsAt: "", capacity: "", description: "" });
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create the event.");
    } finally {
      setBusy(false);
    }
  }

  async function onVerify(signupId: string) {
    const v = verifyState[signupId];
    if (!v?.hours || !v?.rating) {
      toast.error("Enter hours and a rating first.");
      return;
    }
    setBusy(true);
    try {
      await verify({
        data: {
          signupId,
          hours: Number(v.hours),
          rating: Number(v.rating),
          ledCrewSize: v.led ? Number(v.led) : undefined,
        },
      });
      toast.success("Shift verified — hours added to the volunteer's Passport.");
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't verify.");
    } finally {
      setBusy(false);
    }
  }

  const setV = (id: string, k: "hours" | "rating" | "led", val: string) =>
    setVerifyState((s) => ({
      ...s,
      [id]: { hours: "", rating: "", led: "", ...s[id], [k]: val },
    }));

  return (
    <div className="min-h-screen glass-shell">
      <PortalHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Events & shift verification</h1>
            <p className="mt-2 text-muted-foreground">
              Publish event shifts and verify hours within seven days of each
              event. No more than 10 hours a day count.
            </p>
          </div>
          <Button onClick={() => setShowForm((v) => !v)}>
            <Plus className="size-4" /> New event
          </Button>
        </div>

        {showForm && (
          <form
            onSubmit={onCreate}
            className="mt-6 grid gap-4 rounded-2xl glass-panel p-6 shadow-sm sm:grid-cols-2"
          >
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>City *</Label>
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Starts *</Label>
              <Input type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Ends</Label>
              <Input type="datetime-local" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Description</Label>
              <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />} Publish event
              </Button>
            </div>
          </form>
        )}

        {isLoading && <Loader2 className="mt-10 size-8 animate-spin text-primary" />}
        {error && (
          <p className="mt-10 rounded-xl glass-panel p-6 text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "Couldn't load events."}
          </p>
        )}

        <div className="mt-8 space-y-6">
          {data?.events.map((ev) => {
            const signups = data.signups.filter((s) => s.event_id === ev.id);
            return (
              <section key={ev.id} className="rounded-2xl glass-panel p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-bold">{ev.title}</h2>
                  <span className="text-sm text-muted-foreground">
                    {ev.city} · {new Date(ev.starts_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </span>
                </div>
                {signups.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No signups yet.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {signups.map((s) => (
                      <li key={s.id} className="rounded-xl border border-border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-sm">
                            <span className="font-semibold">{s.volunteerName}</span>
                            <span className="text-muted-foreground"> · {s.role_type} · </span>
                            <span className={`font-semibold ${s.status === "completed" ? "text-primary" : ""}`}>
                              {s.status === "completed" ? `verified · ${s.hours}h · rating ${s.rating}/4` : s.status}
                            </span>
                          </div>
                          {s.status !== "completed" && (
                            <div className="flex flex-wrap items-center gap-2">
                              <Input
                                className="w-20" placeholder="Hours" type="number" min={0.5} max={10} step={0.5}
                                value={verifyState[s.id]?.hours ?? ""}
                                onChange={(e) => setV(s.id, "hours", e.target.value)}
                              />
                              <Select
                                value={verifyState[s.id]?.rating ?? ""}
                                onValueChange={(v) => setV(s.id, "rating", v)}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue placeholder="Rating" />
                                </SelectTrigger>
                                <SelectContent>
                                  {[1, 2, 3, 4].map((r) => (
                                    <SelectItem key={r} value={String(r)}>{r} / 4</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Input
                                className="w-24" placeholder="Crew size" type="number" min={0}
                                value={verifyState[s.id]?.led ?? ""}
                                onChange={(e) => setV(s.id, "led", e.target.value)}
                              />
                              <Button size="sm" disabled={busy} onClick={() => onVerify(s.id)}>
                                Verify
                              </Button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
          {data && data.events.length === 0 && (
            <p className="rounded-xl glass-panel p-6 text-sm text-muted-foreground">
              No events yet. Publish the first one above.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitApplication, type ApplicationInput } from "@/lib/applications.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const applicantTypes = [
  { value: "student", label: "Student" },
  { value: "young-professional", label: "Young professional" },
  { value: "startup-founder", label: "Startup founder / enthusiast" },
  { value: "msme-industry", label: "MSME / industry professional" },
  { value: "university-community", label: "University / community representative" },
  { value: "other", label: "Other" },
];

const interests = [
  { value: "campus-outreach", label: "Campus outreach" },
  { value: "startup-ecosystem", label: "Startup ecosystem" },
  { value: "msme-outreach", label: "MSME outreach" },
  { value: "events-workshops", label: "Events and workshops" },
  { value: "research-content", label: "Research and content" },
  { value: "networking-partnerships", label: "Networking and partnerships" },
  { value: "city-leadership", label: "City leadership" },
];

const timeOptions = [
  { value: "2-3-hours", label: "2–3 hours per week" },
  { value: "4-5-hours", label: "4–5 hours per week" },
  { value: "6-plus-hours", label: "6+ hours per week" },
  { value: "flexible", label: "Event-based / flexible" },
];

type Errors = Partial<Record<keyof ApplicationInput, string | undefined>>;

export function ApplyForm() {
  const submit = useServerFn(submitApplication);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [form, setForm] = useState<ApplicationInput>({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    applicantType: undefined as never,
    interest: undefined as never,
    timeCommitment: undefined,
    linkedinUrl: "",
    motivation: "",
    privacyAcknowledged: false as never,
    socialMediaConsent: false,
  });

  const set = <K extends keyof ApplicationInput>(key: K, value: ApplicationInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const next: Errors = {};
    if (!form.fullName || form.fullName.trim().length < 2) next.fullName = "Please enter your full name";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Please enter a valid email address";
    if (!form.phone || form.phone.trim().length < 7) next.phone = "Please enter a valid phone number";
    if (!form.city || form.city.trim().length < 2) next.city = "Please enter your city";
    if (!form.applicantType) next.applicantType = "Please select one";
    if (!form.interest) next.interest = "Please select one";
    if (form.linkedinUrl && !/^https?:\/\/.+\..+/.test(form.linkedinUrl)) next.linkedinUrl = "Please enter a valid URL";
    if (!form.privacyAcknowledged) next.privacyAcknowledged = "Please accept the privacy acknowledgement to submit";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      const result = await submit({ data: form });
      setReference(result?.referenceId ?? null);
      setDone(true);
      window.scrollTo({ top: document.getElementById("apply")?.offsetTop ?? 0, behavior: "smooth" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="apply" className="scroll-mt-20 bg-tint py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">
          Apply Now
        </p>
        <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
          Ready to help ideas cross borders?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Take the first step towards joining the Acxelerate India Global Growth
          Ambassador community.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Choose how you would like to contribute.</li>
          <li>Share your interests and availability.</li>
          <li>Hear from the team about onboarding.</li>
          <li>Social-media recognition is always optional and consent-based.</li>
        </ul>
        <p className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Joining policy:</span>{" "}
          Acxelerate Crew is free to join and free to serve in. The programme
          pays no money — recognition comes as verified hours, badges,
          endorsements and tier progress.
        </p>

        {done ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
            <CheckCircle2 className="mx-auto size-12 text-primary" />
            <h3 className="mt-4 text-2xl font-bold">Application received</h3>
            {reference && (
              <p className="mx-auto mt-4 max-w-md rounded-xl bg-muted px-4 py-3 text-sm">
                Your application reference ID is{" "}
                <span className="font-bold text-foreground">{reference}</span>.
                Please keep it for any follow-up.
              </p>
            )}
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Thank you for applying to Acxelerate Crew.
              The team will review your application and share the decision on
              your volunteer dashboard. You can{" "}
              <a href="/auth" className="font-semibold text-primary">
                create your volunteer login
              </a>{" "}
              with the same email address to track your application.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mt-10 space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
            noValidate
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Full name" required error={errors.fullName}>
                <Input
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </Field>
              <Field label="Email address" required error={errors.email}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>
              <Field label="Phone number" required error={errors.phone}>
                <Input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 …"
                  autoComplete="tel"
                />
              </Field>
              <Field label="City" required error={errors.city}>
                <Input
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  placeholder="Your city"
                  autoComplete="address-level2"
                />
              </Field>
              <Field label="I am a..." required error={errors.applicantType}>
                <Select
                  value={form.applicantType}
                  onValueChange={(v) => set("applicantType", v as ApplicationInput["applicantType"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {applicantTypes.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="I'm most interested in..." required error={errors.interest}>
                <Select
                  value={form.interest}
                  onValueChange={(v) => set("interest", v as ApplicationInput["interest"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    {interests.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Time I can contribute" error={errors.timeCommitment}>
                <Select
                  value={form.timeCommitment ?? ""}
                  onValueChange={(v) => set("timeCommitment", v as ApplicationInput["timeCommitment"])}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="LinkedIn profile" error={errors.linkedinUrl}>
                <Input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => set("linkedinUrl", e.target.value)}
                  placeholder="https://linkedin.com/in/… (optional)"
                />
              </Field>
            </div>

            <Field label="Why would you like to join?" error={errors.motivation}>
              <Textarea
                value={form.motivation}
                onChange={(e) => set("motivation", e.target.value)}
                placeholder="A few sentences (optional)"
                rows={4}
              />
            </Field>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={!!form.privacyAcknowledged}
                  onCheckedChange={(c) => set("privacyAcknowledged", c === true ? true : (false as never))}
                />
                <div>
                  <Label htmlFor="privacy" className="cursor-pointer text-sm font-normal leading-relaxed">
                    I agree that Acxelerate India may use the information above to
                    review my application and contact me about the ambassador
                    program. <span className="text-destructive">*</span>
                  </Label>
                  {errors.privacyAcknowledged && (
                    <p className="mt-1 text-sm text-destructive">{errors.privacyAcknowledged}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="social"
                  checked={!!form.socialMediaConsent}
                  onCheckedChange={(c) => set("socialMediaConsent", c === true)}
                />
                <Label htmlFor="social" className="cursor-pointer text-sm font-normal leading-relaxed">
                  I would like to be asked for separate approval if Acxelerate
                  India wants to feature my name, photo or achievement on its
                  social-media channels. This is not required to join.
                </Label>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Submitting…" : "Submit Application"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

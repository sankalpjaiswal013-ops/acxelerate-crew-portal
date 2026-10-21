import { CheckCircle2, Circle, ClipboardList, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InteractiveOnboardingTrackerProps {
  appSubmitted: boolean;
  appApproved: boolean;
  profileDone: boolean;
  orientationDone: boolean;
  agreementDone: boolean;
  starterDone: boolean;
  onStartOrientation: () => void;
  onStartAgreement: () => void;
}

export function InteractiveOnboardingTracker({
  appSubmitted,
  appApproved,
  profileDone,
  orientationDone,
  agreementDone,
  starterDone,
  onStartOrientation,
  onStartAgreement,
}: InteractiveOnboardingTrackerProps) {
  const steps = [
    { id: 1, label: "Application submitted", done: appSubmitted },
    { id: 2, label: "Review team approved", done: appApproved },
    { id: 3, label: "Profile completed", done: profileDone },
    { id: 4, label: "Orientation completed", done: orientationDone },
    { id: 5, label: "Volunteer agreement signed", done: agreementDone },
    { id: 6, label: "Starter contribution verified", done: starterDone },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const pct = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="rounded-2xl glass-panel p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Interactive Onboarding Journey</h2>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete the 6 foundational steps to unlock full opportunity board access and Passport verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-foreground">{completedCount} of 6 Complete</span>
            <p className="text-[10px] text-muted-foreground">{pct}% Finished</p>
          </div>
          <div className="h-3 w-28 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-primary transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Connected Milestone Step Chain */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const isCurrent = !step.done && (idx === 0 || steps[idx - 1].done);

          return (
            <div
              key={step.id}
              className={`relative flex flex-col justify-between rounded-xl p-3.5 border transition-all duration-300 ${
                step.done
                  ? "border-emerald-500/40 bg-emerald-500/5 text-foreground"
                  : isCurrent
                  ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/20"
                  : "border-border/60 bg-muted/20 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground">STEP 0{step.id}</span>
                  {step.done ? (
                    <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="size-2 rounded-full bg-primary animate-ping" />
                  ) : (
                    <Circle className="size-3.5 text-muted-foreground shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold leading-snug">{step.label}</p>
              </div>

              {/* Action button for current pending step */}
              {isCurrent && (
                <div className="mt-3 pt-2 border-t border-primary/20">
                  {step.id === 4 && (
                    <Button size="sm" className="h-7 w-full text-[11px]" onClick={onStartOrientation}>
                      Start <ArrowRight className="size-3 ml-1" />
                    </Button>
                  )}
                  {step.id === 5 && (
                    <Button size="sm" className="h-7 w-full text-[11px]" onClick={onStartAgreement}>
                      Accept <ArrowRight className="size-3 ml-1" />
                    </Button>
                  )}
                  {step.id === 6 && (
                    <span className="text-[10px] font-semibold text-primary">Serve 1st shift</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

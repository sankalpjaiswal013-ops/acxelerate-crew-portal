import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { demoVolunteerLogin } from "@/lib/demo.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logo from "@/assets/acxelerate-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Volunteer Login — Acxelerate India" },
      {
        name: "description",
        content:
          "Sign in to the Acxelerate India volunteer portal to access your dashboard and the opportunity board.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function onDemo() {
    setDemoBusy(true);
    try {
      const creds = await demoVolunteerLogin();
      const { error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      });
      if (error) throw error;
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Demo sign-in failed.",
      );
      setDemoBusy(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setCheckEmail(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function onGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Google sign-in failed.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-tint px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <a href="/" className="flex justify-center">
          <img src={logo.url} alt="Acxelerate India" className="h-12 w-auto" />
        </a>
        <h1 className="mt-6 text-center text-2xl font-bold">
          Volunteer Portal
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Sign in to access your dashboard and the opportunity board. The full
          board is available to approved volunteers.
        </p>

        {checkEmail ? (
          <div className="mt-8 rounded-xl border border-border bg-muted p-4 text-center text-sm">
            <p className="font-semibold">Check your email</p>
            <p className="mt-1 text-muted-foreground">
              We sent a confirmation link to {email}. Confirm your address, then
              sign in.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setCheckEmail(false);
                setMode("signin");
              }}
            >
              Back to sign in
            </Button>
          </div>
        ) : (
          <>
            <Button
              variant="outline"
              className="mt-8 w-full"
              onClick={onGoogle}
              disabled={busy}
            >
              Continue with Google
            </Button>
            <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />
              or with email
              <span className="h-px flex-1 bg-border" />
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  minLength={6}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New volunteer?{" "}
                  <button
                    className="font-semibold text-primary"
                    onClick={() => setMode("signup")}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    className="font-semibold text-primary"
                    onClick={() => setMode("signin")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <div className="mt-8 rounded-xl border border-primary/30 bg-tint p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" />
                Just exploring?
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Preview the portal with a demo volunteer account — sample
                hours, tier progress, shifts and passport included.
              </p>
              <Button
                className="mt-3 w-full"
                onClick={onDemo}
                disabled={demoBusy || busy}
              >
                {demoBusy && <Loader2 className="size-4 animate-spin" />}
                Try the demo volunteer dashboard
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

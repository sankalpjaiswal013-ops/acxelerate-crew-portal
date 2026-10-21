-- Points ledger (v2.2 framework): recognition units, never cash
CREATE TABLE public.points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity text NOT NULL, -- referral_activated | assessment_completion | event_support | event_led_small | event_led_large | adjustment
  points integer NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending | approved | rejected | reversed
  evidence text,
  reason text,
  reviewer_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.points_ledger TO authenticated;
GRANT ALL ON public.points_ledger TO service_role;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own points" ON public.points_ledger
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "staff manage points" ON public.points_ledger
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));

-- Onboarding journey fields on profiles
ALTER TABLE public.profiles ADD COLUMN orientation_completed_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN agreement_accepted_at timestamptz;
ALTER TABLE public.profiles ADD COLUMN starter_completed_at timestamptz;

-- Public events page: anyone can read non-cancelled events
GRANT SELECT ON public.events TO anon;
CREATE POLICY "public read open events" ON public.events
  FOR SELECT TO anon USING (status <> 'cancelled');
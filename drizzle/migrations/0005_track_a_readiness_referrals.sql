CREATE TABLE public.referral_codes (
  user_id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.referral_codes TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own referral code" ON public.referral_codes FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'));

CREATE OR REPLACE FUNCTION public.ensure_my_referral_code()
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE c text; tries int := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  SELECT code INTO c FROM referral_codes WHERE user_id = auth.uid();
  IF c IS NOT NULL THEN RETURN c; END IF;
  LOOP
    c := 'AX-' || upper(substr(md5(gen_random_uuid()::text), 1, 8));
    BEGIN
      INSERT INTO referral_codes(user_id, code) VALUES (auth.uid(), c);
      RETURN c;
    EXCEPTION WHEN unique_violation THEN
      tries := tries + 1;
      IF tries > 5 THEN RAISE; END IF;
      SELECT code INTO c FROM referral_codes WHERE user_id = auth.uid();
      IF c IS NOT NULL THEN RETURN c; END IF;
    END;
  END LOOP;
END $$;
REVOKE ALL ON FUNCTION public.ensure_my_referral_code() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.ensure_my_referral_code() TO authenticated;

CREATE TABLE public.readiness_completions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text NOT NULL UNIQUE,
  volunteer_id uuid,
  referral_code text,
  status text NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted','valid','duplicate','invalid','pending_attribution')),
  paid_verified boolean NOT NULL DEFAULT false,
  note text,
  recorded_by uuid NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX readiness_completions_volunteer_idx ON public.readiness_completions(volunteer_id, completed_at);
GRANT SELECT, INSERT, UPDATE ON public.readiness_completions TO authenticated;
GRANT ALL ON public.readiness_completions TO service_role;
ALTER TABLE public.readiness_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Volunteer reads own completions" ON public.readiness_completions FOR SELECT TO authenticated
  USING (auth.uid() = volunteer_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'));
CREATE POLICY "Staff record completions" ON public.readiness_completions FOR INSERT TO authenticated
  WITH CHECK ((public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer')) AND recorded_by = auth.uid() AND (volunteer_id IS NULL OR volunteer_id <> auth.uid()));
CREATE POLICY "Staff update completions" ON public.readiness_completions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'))
  WITH CHECK (volunteer_id IS NULL OR volunteer_id <> auth.uid());
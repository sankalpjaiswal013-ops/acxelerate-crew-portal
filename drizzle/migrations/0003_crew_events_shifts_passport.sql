CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  city text NOT NULL,
  location text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  capacity integer,
  status text NOT NULL DEFAULT 'upcoming',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Signed-in volunteers can read events" ON public.events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
CREATE POLICY "Staff can update events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));

CREATE TABLE public.shift_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  volunteer_id uuid NOT NULL,
  role_type text NOT NULL DEFAULT 'general',
  status text NOT NULL DEFAULT 'signed_up',
  hours numeric,
  rating integer,
  led_crew_size integer,
  reviewer_note text,
  verified_by uuid,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, volunteer_id)
);
GRANT SELECT, INSERT ON public.shift_signups TO authenticated;
GRANT UPDATE ON public.shift_signups TO authenticated;
GRANT ALL ON public.shift_signups TO service_role;
ALTER TABLE public.shift_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Volunteers read own signups" ON public.shift_signups FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
CREATE POLICY "Volunteers sign up for shifts" ON public.shift_signups FOR INSERT TO authenticated WITH CHECK (volunteer_id = auth.uid() AND status = 'signed_up');
CREATE POLICY "Volunteers can cancel own signup" ON public.shift_signups FOR UPDATE TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));

CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL,
  code text NOT NULL,
  label text NOT NULL,
  awarded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (volunteer_id, code)
);
GRANT SELECT, INSERT ON public.badges TO authenticated;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Volunteers read own badges" ON public.badges FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
CREATE POLICY "Staff award badges" ON public.badges FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));

CREATE TABLE public.endorsements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id uuid NOT NULL,
  author_name text NOT NULL,
  author_role text,
  body text NOT NULL,
  evidence_level text NOT NULL DEFAULT 'E2',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.endorsements TO authenticated;
GRANT ALL ON public.endorsements TO service_role;
ALTER TABLE public.endorsements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Volunteers read own endorsements" ON public.endorsements FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
CREATE POLICY "Staff add endorsements" ON public.endorsements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
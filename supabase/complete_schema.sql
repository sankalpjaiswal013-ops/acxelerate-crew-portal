-- =========================================================================
-- ACXELERATE CREW PORTAL - COMPLETE DATABASE SCHEMA FOR SUPABASE
-- Run this in your Supabase Dashboard -> SQL Editor -> New query -> Run
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Enum Types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'reviewer', 'organizer', 'city_coordinator', 'finance', 'volunteer');
  END IF;
END $$;

-- 2. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  city text,
  phone text,
  skills text,
  interests text,
  availability text,
  preferred_format text,
  languages text,
  onboarding_completed boolean NOT NULL DEFAULT false,
  orientation_completed_at timestamptz,
  agreement_accepted_at timestamptz,
  starter_completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can read own profile') THEN
    CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- 3. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can read own roles') THEN
    CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- Role Helper Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

-- Auto create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Ambassador Applications Table
CREATE TABLE IF NOT EXISTS public.ambassador_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  city text NOT NULL,
  applicant_type text NOT NULL,
  interest text NOT NULL,
  time_commitment text,
  linkedin_url text,
  motivation text,
  privacy_acknowledged boolean NOT NULL DEFAULT false,
  social_media_consent boolean NOT NULL DEFAULT false,
  reference_id text,
  status text NOT NULL DEFAULT 'submitted',
  reviewer_note text,
  reviewed_at timestamptz,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ambassador_applications_reference_id_key ON public.ambassador_applications (reference_id) WHERE reference_id IS NOT NULL;

GRANT INSERT ON public.ambassador_applications TO anon;
GRANT SELECT, UPDATE ON public.ambassador_applications TO authenticated;
GRANT ALL ON public.ambassador_applications TO service_role;
ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_applications' AND policyname = 'Anyone can submit an application') THEN
    CREATE POLICY "Anyone can submit an application" ON public.ambassador_applications FOR INSERT TO anon, authenticated WITH CHECK (privacy_acknowledged = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_applications' AND policyname = 'Applicants can read own application') THEN
    CREATE POLICY "Applicants can read own application" ON public.ambassador_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_applications' AND policyname = 'Reviewers can read all applications') THEN
    CREATE POLICY "Reviewers can read all applications" ON public.ambassador_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ambassador_applications' AND policyname = 'Reviewers can update applications') THEN
    CREATE POLICY "Reviewers can update applications" ON public.ambassador_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

-- 5. Events Table
CREATE TABLE IF NOT EXISTS public.events (
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

GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'public read open events') THEN
    CREATE POLICY "public read open events" ON public.events FOR SELECT TO anon USING (status <> 'cancelled');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Signed-in volunteers can read events') THEN
    CREATE POLICY "Signed-in volunteers can read events" ON public.events FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Staff can create events') THEN
    CREATE POLICY "Staff can create events" ON public.events FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'events' AND policyname = 'Staff can update events') THEN
    CREATE POLICY "Staff can update events" ON public.events FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
END $$;

-- 6. Shift Signups Table
CREATE TABLE IF NOT EXISTS public.shift_signups (
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

GRANT SELECT, INSERT, UPDATE ON public.shift_signups TO authenticated;
GRANT ALL ON public.shift_signups TO service_role;
ALTER TABLE public.shift_signups ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shift_signups' AND policyname = 'Volunteers read own signups') THEN
    CREATE POLICY "Volunteers read own signups" ON public.shift_signups FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shift_signups' AND policyname = 'Volunteers sign up for shifts') THEN
    CREATE POLICY "Volunteers sign up for shifts" ON public.shift_signups FOR INSERT TO authenticated WITH CHECK (volunteer_id = auth.uid() AND status = 'signed_up');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'shift_signups' AND policyname = 'Volunteers can cancel own signup') THEN
    CREATE POLICY "Volunteers can cancel own signup" ON public.shift_signups FOR UPDATE TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
END $$;

-- 7. Badges Table
CREATE TABLE IF NOT EXISTS public.badges (
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Volunteers read own badges') THEN
    CREATE POLICY "Volunteers read own badges" ON public.badges FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'badges' AND policyname = 'Staff award badges') THEN
    CREATE POLICY "Staff award badges" ON public.badges FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
END $$;

-- 8. Endorsements Table
CREATE TABLE IF NOT EXISTS public.endorsements (
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

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'endorsements' AND policyname = 'Volunteers read own endorsements') THEN
    CREATE POLICY "Volunteers read own endorsements" ON public.endorsements FOR SELECT TO authenticated USING (volunteer_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'endorsements' AND policyname = 'Staff add endorsements') THEN
    CREATE POLICY "Staff add endorsements" ON public.endorsements FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
END $$;

-- 9. Points Ledger Table
CREATE TABLE IF NOT EXISTS public.points_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity text NOT NULL,
  points integer NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  evidence text,
  reason text,
  reviewer_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.points_ledger TO authenticated;
GRANT ALL ON public.points_ledger TO service_role;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'points_ledger' AND policyname = 'users read own points') THEN
    CREATE POLICY "users read own points" ON public.points_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'points_ledger' AND policyname = 'staff manage points') THEN
    CREATE POLICY "staff manage points" ON public.points_ledger FOR ALL TO authenticated
      USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'))
      WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'organizer') OR public.has_role(auth.uid(), 'reviewer'));
  END IF;
END $$;

-- 10. Referral Codes Table
CREATE TABLE IF NOT EXISTS public.referral_codes (
  user_id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.referral_codes TO authenticated;
GRANT ALL ON public.referral_codes TO service_role;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referral_codes' AND policyname = 'Own referral code') THEN
    CREATE POLICY "Own referral code" ON public.referral_codes FOR SELECT TO authenticated
      USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'));
  END IF;
END $$;

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

-- 11. Readiness Completions Table (Assessments)
CREATE TABLE IF NOT EXISTS public.readiness_completions (
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

CREATE INDEX IF NOT EXISTS readiness_completions_volunteer_idx ON public.readiness_completions(volunteer_id, completed_at);
GRANT SELECT, INSERT, UPDATE ON public.readiness_completions TO authenticated;
GRANT ALL ON public.readiness_completions TO service_role;
ALTER TABLE public.readiness_completions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'readiness_completions' AND policyname = 'Volunteer reads own completions') THEN
    CREATE POLICY "Volunteer reads own completions" ON public.readiness_completions FOR SELECT TO authenticated
      USING (auth.uid() = volunteer_id OR public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'readiness_completions' AND policyname = 'Staff record completions') THEN
    CREATE POLICY "Staff record completions" ON public.readiness_completions FOR INSERT TO authenticated
      WITH CHECK ((public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer')) AND recorded_by = auth.uid() AND (volunteer_id IS NULL OR volunteer_id <> auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'readiness_completions' AND policyname = 'Staff update completions') THEN
    CREATE POLICY "Staff update completions" ON public.readiness_completions FOR UPDATE TO authenticated
      USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'reviewer'))
      WITH CHECK (volunteer_id IS NULL OR volunteer_id <> auth.uid());
  END IF;
END $$;

-- 12. Seed Starter Demo Event (Optional sample data)
INSERT INTO public.events (id, title, description, city, location, starts_at, ends_at, capacity, status)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'Bangalore Career Readiness Summit', 'Flagship city career fair and peer-to-peer breakout track.', 'Bangalore', 'Koramangala Community Center', now() + interval '3 days', now() + interval '3 days 4 hours', 150, 'upcoming'),
  ('e1000000-0000-0000-0000-000000000002', 'Delhi NCR Campus Outreach Walk', 'College activation and youth engagement booth.', 'Delhi NCR', 'South Campus Quad', now() + interval '7 days', now() + interval '7 days 5 hours', 80, 'upcoming'),
  ('e1000000-0000-0000-0000-000000000003', 'Mumbai Career Exploration Camp', 'Interactive mock assessment lab with industry mentors.', 'Mumbai', 'BKC Convention Hall B', now() + interval '12 days', now() + interval '12 days 6 hours', 200, 'upcoming')
ON CONFLICT (id) DO NOTHING;

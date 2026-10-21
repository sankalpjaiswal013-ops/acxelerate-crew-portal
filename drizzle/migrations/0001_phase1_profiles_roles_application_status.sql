CREATE TYPE public.app_role AS ENUM ('admin', 'reviewer', 'organizer', 'city_coordinator', 'finance', 'volunteer');

CREATE TABLE public.profiles (
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
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.ambassador_applications
  ADD COLUMN reference_id text,
  ADD COLUMN status text NOT NULL DEFAULT 'submitted',
  ADD COLUMN reviewer_note text,
  ADD COLUMN reviewed_at timestamptz,
  ADD COLUMN user_id uuid;

CREATE UNIQUE INDEX ambassador_applications_reference_id_key ON public.ambassador_applications (reference_id) WHERE reference_id IS NOT NULL;

CREATE POLICY "Applicants can read own application" ON public.ambassador_applications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Reviewers can read all applications" ON public.ambassador_applications FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Reviewers can update applications" ON public.ambassador_applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'reviewer') OR public.has_role(auth.uid(), 'admin'));
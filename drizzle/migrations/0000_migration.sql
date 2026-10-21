CREATE TABLE public.ambassador_applications (
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
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.ambassador_applications TO anon;
GRANT SELECT ON public.ambassador_applications TO authenticated;
GRANT ALL ON public.ambassador_applications TO service_role;

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.ambassador_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (privacy_acknowledged = true);

CREATE POLICY "Authenticated users can read applications"
  ON public.ambassador_applications FOR SELECT
  TO authenticated
  USING (true);
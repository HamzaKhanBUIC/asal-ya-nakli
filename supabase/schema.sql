-- ASAL YA NAKLI — SUPABASE POSTGRESQL DATABASE SCHEMA

-- 1. Products Table (DRAP & Public Registry Entries)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  registration_number TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  generic_name TEXT NOT NULL,
  strength TEXT,
  dosage_form TEXT,
  manufacturer TEXT,
  country TEXT DEFAULT 'Pakistan',
  status TEXT DEFAULT 'ACTIVE',
  issue_date DATE,
  expiry_date DATE,
  source TEXT DEFAULT 'DRAP',
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast search
CREATE INDEX IF NOT EXISTS idx_products_search ON public.products (brand_name, generic_name, registration_number);

-- 2. Investigations Table (Shareable Intelligence Records)
CREATE TABLE IF NOT EXISTS public.investigations (
  id TEXT PRIMARY KEY, -- e.g. AYN-5XRU4N
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  query_type TEXT NOT NULL,
  image_url TEXT,
  extracted_data JSONB,
  official_match JSONB,
  matching_alerts JSONB,
  evidence JSONB,
  risk_assessment JSONB,
  explanation JSONB,
  community_stats JSONB,
  timeline JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_investigations_created ON public.investigations (created_at DESC);

-- 3. Community Reports Table (Citizen Feedback Loop)
CREATE TABLE IF NOT EXISTS public.community_reports (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  verdict TEXT NOT NULL, -- REAL, SUSPICIOUS, FAKE
  flags JSONB DEFAULT '[]'::jsonb,
  note TEXT,
  city TEXT,
  batch_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_product ON public.community_reports (product_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_city ON public.community_reports (city);

-- 4. Official Alerts Table (WHO & DRAP Medical Product Warnings)
CREATE TABLE IF NOT EXISTS public.official_alerts (
  id TEXT PRIMARY KEY,
  source TEXT NOT NULL,
  title TEXT NOT NULL,
  product_names JSONB DEFAULT '[]'::jsonb,
  active_ingredients JSONB DEFAULT '[]'::jsonb,
  batch_numbers JSONB DEFAULT '[]'::jsonb,
  manufacturers JSONB DEFAULT '[]'::jsonb,
  countries JSONB DEFAULT '[]'::jsonb,
  alert_date DATE,
  severity TEXT DEFAULT 'HIGH',
  source_url TEXT,
  summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Allow Anonymous Read/Write for Hackathon MVP
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to investigations" ON public.investigations FOR SELECT USING (true);
CREATE POLICY "Allow public write access to investigations" ON public.investigations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to community reports" ON public.community_reports FOR SELECT USING (true);
CREATE POLICY "Allow public write access to community reports" ON public.community_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to official alerts" ON public.official_alerts FOR SELECT USING (true);

-- OpenComp Database Schema
-- Run this in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ================================================
-- TABLES
-- ================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  provider TEXT NOT NULL DEFAULT 'google',
  is_verified BOOLEAN DEFAULT false,
  contributions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  avg_salary_lpa DECIMAL(6,2),
  median_salary_lpa DECIMAL(6,2),
  total_entries INTEGER DEFAULT 0,
  avg_rent_1bhk INTEGER,
  metro_coverage INTEGER DEFAULT 0,
  air_quality_index INTEGER,
  safety_score INTEGER,
  walkability_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('startup', 'mnc', 'product', 'service', 'unicorn')),
  headquarters TEXT,
  founded_year INTEGER,
  employee_count TEXT,
  description TEXT,
  opencomp_score DECIMAL(5,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  avg_salary_lpa DECIMAL(6,2) DEFAULT 0,
  culture_score DECIMAL(3,2) DEFAULT 0,
  wlb_score DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  avg_salary_lpa DECIMAL(6,2) DEFAULT 0,
  median_salary_lpa DECIMAL(6,2) DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  yoy_growth DECIMAL(5,2) DEFAULT 0,
  demand_score INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.salary_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  company_id TEXT REFERENCES public.companies(id),
  city_id TEXT REFERENCES public.cities(id),
  role_id TEXT REFERENCES public.roles(id),
  base_salary_lpa DECIMAL(6,2) NOT NULL,
  total_comp_lpa DECIMAL(6,2) NOT NULL,
  equity_lpa DECIMAL(6,2) DEFAULT 0,
  bonus_lpa DECIMAL(6,2) DEFAULT 0,
  experience_years INTEGER NOT NULL,
  work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  education TEXT,
  gender TEXT,
  is_verified BOOLEAN DEFAULT false,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.culture_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  company_id TEXT REFERENCES public.companies(id),
  wlb_rating INTEGER CHECK (wlb_rating BETWEEN 1 AND 5),
  manager_rating INTEGER CHECK (manager_rating BETWEEN 1 AND 5),
  culture_rating INTEGER CHECK (culture_rating BETWEEN 1 AND 5),
  growth_rating INTEGER CHECK (growth_rating BETWEEN 1 AND 5),
  compensation_rating INTEGER CHECK (compensation_rating BETWEEN 1 AND 5),
  pros TEXT,
  cons TEXT,
  is_current_employee BOOLEAN DEFAULT true,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.office_areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city_id TEXT REFERENCES public.cities(id),
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  avg_salary_lpa DECIMAL(6,2),
  company_density INTEGER DEFAULT 0,
  avg_rent_1bhk INTEGER,
  commute_score INTEGER DEFAULT 50,
  food_score INTEGER DEFAULT 50,
  safety_score INTEGER DEFAULT 50,
  walkability_score INTEGER DEFAULT 50,
  metro_distance_km DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.perks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.office_facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_area_id TEXT NOT NULL REFERENCES public.office_areas(id) ON DELETE CASCADE,
  company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
  facility_name TEXT NOT NULL,
  facility_type TEXT,
  score INTEGER DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workplace_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  city_id TEXT REFERENCES public.cities(id) ON DELETE SET NULL,
  role_id TEXT REFERENCES public.roles(id) ON DELETE SET NULL,
  work_mode TEXT CHECK (work_mode IN ('remote', 'hybrid', 'onsite')),
  sample_size INTEGER DEFAULT 0,
  salary_mean DECIMAL(7,2) DEFAULT 0,
  salary_stddev DECIMAL(7,2) DEFAULT 1,
  opencomp_score DECIMAL(5,2) DEFAULT 0,
  percentile_p25 DECIMAL(7,2),
  percentile_p50 DECIMAL(7,2),
  percentile_p75 DECIMAL(7,2),
  percentile_p90 DECIMAL(7,2),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (company_id, city_id, role_id, work_mode)
);

CREATE TABLE IF NOT EXISTS public.area_intelligence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_area_id TEXT NOT NULL REFERENCES public.office_areas(id) ON DELETE CASCADE,
  city_id TEXT NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  office_density INTEGER DEFAULT 0,
  affordability_index DECIMAL(5,2) DEFAULT 0,
  commute_index DECIMAL(5,2) DEFAULT 0,
  food_index DECIMAL(5,2) DEFAULT 0,
  safety_index DECIMAL(5,2) DEFAULT 0,
  walkability_index DECIMAL(5,2) DEFAULT 0,
  avg_aqi INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (office_area_id)
);

-- ================================================
-- INDEXES
-- ================================================

CREATE INDEX IF NOT EXISTS idx_salary_entries_company ON public.salary_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_entries_city ON public.salary_entries(city_id);
CREATE INDEX IF NOT EXISTS idx_salary_entries_role ON public.salary_entries(role_id);
CREATE INDEX IF NOT EXISTS idx_salary_entries_experience ON public.salary_entries(experience_years);
CREATE INDEX IF NOT EXISTS idx_salary_entries_submitted ON public.salary_entries(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_score ON public.companies(opencomp_score DESC);
CREATE INDEX IF NOT EXISTS idx_companies_name_trgm ON public.companies USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_roles_slug ON public.roles(slug);
CREATE INDEX IF NOT EXISTS idx_culture_reviews_company ON public.culture_reviews(company_id);
CREATE INDEX IF NOT EXISTS idx_perks_company ON public.perks(company_id);
CREATE INDEX IF NOT EXISTS idx_office_facilities_area ON public.office_facilities(office_area_id);
CREATE INDEX IF NOT EXISTS idx_workplace_scores_company_city_role ON public.workplace_scores(company_id, city_id, role_id);
CREATE INDEX IF NOT EXISTS idx_area_intelligence_city ON public.area_intelligence(city_id);

-- ================================================
-- VIEWS
-- ================================================

CREATE OR REPLACE VIEW public.company_salary_stats AS
SELECT
  c.id,
  c.name,
  c.slug,
  c.industry,
  c.opencomp_score,
  COUNT(se.id) as total_entries,
  ROUND(AVG(se.base_salary_lpa)::NUMERIC, 2) as avg_base_lpa,
  ROUND(AVG(se.total_comp_lpa)::NUMERIC, 2) as avg_total_comp_lpa,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY se.base_salary_lpa)::NUMERIC, 2) as median_base_lpa,
  ROUND(PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY se.base_salary_lpa)::NUMERIC, 2) as p25_lpa,
  ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY se.base_salary_lpa)::NUMERIC, 2) as p75_lpa
FROM public.companies c
LEFT JOIN public.salary_entries se ON se.company_id = c.id
GROUP BY c.id, c.name, c.slug, c.industry, c.opencomp_score;

CREATE OR REPLACE VIEW public.city_salary_stats AS
SELECT
  ci.id,
  ci.name,
  ci.state,
  COUNT(se.id) as total_entries,
  ROUND(AVG(se.base_salary_lpa)::NUMERIC, 2) as avg_salary_lpa,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY se.base_salary_lpa)::NUMERIC, 2) as median_salary_lpa
FROM public.cities ci
LEFT JOIN public.salary_entries se ON se.city_id = ci.id
GROUP BY ci.id, ci.name, ci.state;

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workplace_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.area_intelligence ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);
CREATE POLICY "Public read office_areas" ON public.office_areas FOR SELECT USING (true);
CREATE POLICY "Public read perks" ON public.perks FOR SELECT USING (true);
CREATE POLICY "Public read office_facilities" ON public.office_facilities FOR SELECT USING (true);
CREATE POLICY "Public read workplace_scores" ON public.workplace_scores FOR SELECT USING (true);
CREATE POLICY "Public read area_intelligence" ON public.area_intelligence FOR SELECT USING (true);

-- Salary entries: public aggregated read, auth insert
CREATE POLICY "Public read salary_entries" ON public.salary_entries FOR SELECT USING (true);
CREATE POLICY "Auth insert salary_entries" ON public.salary_entries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Culture reviews: public read, auth insert
CREATE POLICY "Public read culture_reviews" ON public.culture_reviews FOR SELECT USING (true);
CREATE POLICY "Auth insert culture_reviews" ON public.culture_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users: own row read/update
CREATE POLICY "Users read own row" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own row" ON public.users FOR UPDATE USING (auth.uid() = id);

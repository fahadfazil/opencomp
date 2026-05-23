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
  slug TEXT UNIQUE,
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
  tech_hub_rank INTEGER,
  cost_of_living_index INTEGER DEFAULT 50,
  metro_available BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  industry TEXT NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('startup', 'mnc', 'product', 'service', 'unicorn', 'mid_size', 'enterprise')),
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
  p25_salary_lpa DECIMAL(6,2) DEFAULT 0,
  p75_salary_lpa DECIMAL(6,2) DEFAULT 0,
  total_entries INTEGER DEFAULT 0,
  yoy_growth DECIMAL(5,2) DEFAULT 0,
  yoy_growth_pct DECIMAL(5,2) DEFAULT 0,
  remote_premium_pct DECIMAL(5,2) DEFAULT 0,
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
  office_density INTEGER DEFAULT 0,
  avg_rent_1bhk INTEGER,
  avg_rent_2bhk INTEGER,
  commute_score INTEGER DEFAULT 50,
  food_score INTEGER DEFAULT 50,
  safety_score INTEGER DEFAULT 50,
  walkability_score INTEGER DEFAULT 50,
  metro_distance_km DECIMAL(4,2),
  avg_aqi INTEGER DEFAULT 0,
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

CREATE TABLE IF NOT EXISTS public.app_content (
  key TEXT PRIMARY KEY,
  description TEXT,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- BACKFILL / COMPATIBILITY ALTERS
-- ================================================

ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS tech_hub_rank INTEGER;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS cost_of_living_index INTEGER DEFAULT 50;
ALTER TABLE public.cities ADD COLUMN IF NOT EXISTS metro_available BOOLEAN DEFAULT false;

ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS p25_salary_lpa DECIMAL(6,2) DEFAULT 0;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS p75_salary_lpa DECIMAL(6,2) DEFAULT 0;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS yoy_growth_pct DECIMAL(5,2) DEFAULT 0;
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS remote_premium_pct DECIMAL(5,2) DEFAULT 0;

ALTER TABLE public.office_areas ADD COLUMN IF NOT EXISTS office_density INTEGER DEFAULT 0;
ALTER TABLE public.office_areas ADD COLUMN IF NOT EXISTS avg_rent_2bhk INTEGER;
ALTER TABLE public.office_areas ADD COLUMN IF NOT EXISTS avg_aqi INTEGER DEFAULT 0;

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
CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities(slug);
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
ALTER TABLE public.app_content ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read companies" ON public.companies;
CREATE POLICY "Public read companies" ON public.companies FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read cities" ON public.cities;
CREATE POLICY "Public read cities" ON public.cities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read roles" ON public.roles;
CREATE POLICY "Public read roles" ON public.roles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read office_areas" ON public.office_areas;
CREATE POLICY "Public read office_areas" ON public.office_areas FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read perks" ON public.perks;
CREATE POLICY "Public read perks" ON public.perks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read office_facilities" ON public.office_facilities;
CREATE POLICY "Public read office_facilities" ON public.office_facilities FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read workplace_scores" ON public.workplace_scores;
CREATE POLICY "Public read workplace_scores" ON public.workplace_scores FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read area_intelligence" ON public.area_intelligence;
CREATE POLICY "Public read area_intelligence" ON public.area_intelligence FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read app_content" ON public.app_content;
CREATE POLICY "Public read app_content" ON public.app_content FOR SELECT USING (true);

-- Salary entries: public aggregated read, auth insert
DROP POLICY IF EXISTS "Public read salary_entries" ON public.salary_entries;
CREATE POLICY "Public read salary_entries" ON public.salary_entries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth insert salary_entries" ON public.salary_entries;
CREATE POLICY "Auth insert salary_entries" ON public.salary_entries FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Culture reviews: public read, auth insert
DROP POLICY IF EXISTS "Public read culture_reviews" ON public.culture_reviews;
CREATE POLICY "Public read culture_reviews" ON public.culture_reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Auth insert culture_reviews" ON public.culture_reviews;
CREATE POLICY "Auth insert culture_reviews" ON public.culture_reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Users: own row read/update
DROP POLICY IF EXISTS "Users read own row" ON public.users;
CREATE POLICY "Users read own row" ON public.users FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users update own row" ON public.users;
CREATE POLICY "Users update own row" ON public.users FOR UPDATE USING (auth.uid() = id);

-- ================================================
-- SEED DATA
-- ================================================

INSERT INTO public.cities (
  id, slug, name, state, latitude, longitude, avg_salary_lpa, tech_hub_rank,
  cost_of_living_index, metro_available, total_entries, created_at
)
VALUES
  ('blr', 'bangalore', 'Bangalore', 'Karnataka', 12.971600, 77.594600, 32.4, 1, 72, true, 128400, '2024-01-01T00:00:00Z'),
  ('mum', 'mumbai', 'Mumbai', 'Maharashtra', 19.076000, 72.877700, 28.8, 2, 88, true, 98200, '2024-01-01T00:00:00Z'),
  ('del', 'delhi-ncr', 'Delhi NCR', 'Delhi', 28.704100, 77.102500, 26.2, 3, 75, true, 89500, '2024-01-01T00:00:00Z'),
  ('hyd', 'hyderabad', 'Hyderabad', 'Telangana', 17.385000, 78.486700, 24.6, 4, 65, true, 72100, '2024-01-01T00:00:00Z'),
  ('pun', 'pune', 'Pune', 'Maharashtra', 18.520400, 73.856700, 22.1, 5, 60, false, 54300, '2024-01-01T00:00:00Z'),
  ('che', 'chennai', 'Chennai', 'Tamil Nadu', 13.082700, 80.270700, 20.8, 6, 55, true, 48900, '2024-01-01T00:00:00Z'),
  ('kol', 'kolkata', 'Kolkata', 'West Bengal', 22.572600, 88.363900, 16.2, 8, 48, true, 28400, '2024-01-01T00:00:00Z'),
  ('ahm', 'ahmedabad', 'Ahmedabad', 'Gujarat', 23.022500, 72.571400, 14.8, 9, 45, false, 22100, '2024-01-01T00:00:00Z'),
  ('jai', 'jaipur', 'Jaipur', 'Rajasthan', 26.912400, 75.787300, 12.4, NULL, 40, false, 14600, '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  state = EXCLUDED.state,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  avg_salary_lpa = EXCLUDED.avg_salary_lpa,
  tech_hub_rank = EXCLUDED.tech_hub_rank,
  cost_of_living_index = EXCLUDED.cost_of_living_index,
  metro_available = EXCLUDED.metro_available,
  total_entries = EXCLUDED.total_entries,
  created_at = EXCLUDED.created_at;

INSERT INTO public.companies (
  id, name, slug, logo_url, website, industry, company_type, headquarters,
  founded_year, employee_count, description, opencomp_score, total_reviews,
  avg_salary_lpa, created_at
)
VALUES
  ('flipkart', 'Flipkart', 'flipkart', NULL, 'https://flipkart.com', 'E-Commerce', 'product', 'Bangalore', 2007, '25000+', 'India''s leading e-commerce marketplace', 87, 3240, 38.5, '2024-01-01T00:00:00Z'),
  ('razorpay', 'Razorpay', 'razorpay', NULL, 'https://razorpay.com', 'Fintech', 'startup', 'Bangalore', 2014, '3000+', 'India''s leading payment gateway', 91, 1840, 44.2, '2024-01-01T00:00:00Z'),
  ('swiggy', 'Swiggy', 'swiggy', NULL, 'https://swiggy.com', 'Food-Tech', 'startup', 'Bangalore', 2014, '5000+', 'On-demand food delivery platform', 83, 2100, 36.8, '2024-01-01T00:00:00Z'),
  ('zepto', 'Zepto', 'zepto', NULL, 'https://zeptonow.com', 'Quick Commerce', 'startup', 'Mumbai', 2021, '1500+', '10-minute grocery delivery', 78, 620, 40.1, '2024-01-01T00:00:00Z'),
  ('meesho', 'Meesho', 'meesho', NULL, 'https://meesho.com', 'Social Commerce', 'startup', 'Bangalore', 2015, '4000+', 'Enabling 100 million+ entrepreneurs', 80, 1280, 35.6, '2024-01-01T00:00:00Z'),
  ('phonepe', 'PhonePe', 'phonepe', NULL, 'https://phonepe.com', 'Fintech', 'product', 'Bangalore', 2015, '4000+', 'India''s digital payments platform', 85, 1960, 41.3, '2024-01-01T00:00:00Z'),
  ('cred', 'CRED', 'cred', NULL, 'https://cred.club', 'Fintech', 'startup', 'Bangalore', 2018, '800+', 'Rewards for responsible credit behaviour', 93, 820, 52.4, '2024-01-01T00:00:00Z'),
  ('groww', 'Groww', 'groww', NULL, 'https://groww.in', 'Fintech', 'startup', 'Bangalore', 2016, '1200+', 'India''s leading investment platform', 88, 980, 46.2, '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  logo_url = EXCLUDED.logo_url,
  website = EXCLUDED.website,
  industry = EXCLUDED.industry,
  company_type = EXCLUDED.company_type,
  headquarters = EXCLUDED.headquarters,
  founded_year = EXCLUDED.founded_year,
  employee_count = EXCLUDED.employee_count,
  description = EXCLUDED.description,
  opencomp_score = EXCLUDED.opencomp_score,
  total_reviews = EXCLUDED.total_reviews,
  avg_salary_lpa = EXCLUDED.avg_salary_lpa,
  created_at = EXCLUDED.created_at;

INSERT INTO public.roles (
  id, title, slug, category, avg_salary_lpa, median_salary_lpa, p25_salary_lpa,
  p75_salary_lpa, total_entries, yoy_growth_pct, remote_premium_pct, yoy_growth, created_at
)
VALUES
  ('swe', 'Software Engineer', 'software-engineer', 'Engineering', 22.4, 20.0, 14.0, 30.0, 48200, 12.4, 18.2, 12.4, '2024-01-01T00:00:00Z'),
  ('sde2', 'Senior Software Engineer', 'senior-software-engineer', 'Engineering', 38.6, 36.0, 28.0, 50.0, 38400, 14.8, 22.1, 14.8, '2024-01-01T00:00:00Z'),
  ('em', 'Engineering Manager', 'engineering-manager', 'Engineering Leadership', 58.2, 56.0, 44.0, 75.0, 12800, 9.2, 15.4, 9.2, '2024-01-01T00:00:00Z'),
  ('pm', 'Product Manager', 'product-manager', 'Product', 36.8, 34.0, 25.0, 48.0, 18600, 11.6, 12.8, 11.6, '2024-01-01T00:00:00Z'),
  ('ds', 'Data Scientist', 'data-scientist', 'Data & Analytics', 28.4, 26.0, 18.0, 40.0, 14200, 16.2, 24.6, 16.2, '2024-01-01T00:00:00Z'),
  ('de', 'Data Engineer', 'data-engineer', 'Data & Analytics', 26.2, 24.0, 17.0, 36.0, 11800, 18.4, 26.8, 18.4, '2024-01-01T00:00:00Z'),
  ('ml', 'ML Engineer', 'ml-engineer', 'AI/ML', 42.6, 40.0, 30.0, 58.0, 8400, 28.4, 32.1, 28.4, '2024-01-01T00:00:00Z'),
  ('devops', 'DevOps Engineer', 'devops-engineer', 'Infrastructure', 24.8, 23.0, 16.0, 34.0, 9600, 10.8, 20.4, 10.8, '2024-01-01T00:00:00Z')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  category = EXCLUDED.category,
  avg_salary_lpa = EXCLUDED.avg_salary_lpa,
  median_salary_lpa = EXCLUDED.median_salary_lpa,
  p25_salary_lpa = EXCLUDED.p25_salary_lpa,
  p75_salary_lpa = EXCLUDED.p75_salary_lpa,
  total_entries = EXCLUDED.total_entries,
  yoy_growth_pct = EXCLUDED.yoy_growth_pct,
  remote_premium_pct = EXCLUDED.remote_premium_pct,
  yoy_growth = EXCLUDED.yoy_growth,
  created_at = EXCLUDED.created_at;

INSERT INTO public.office_areas (
  id, city_id, name, avg_rent_1bhk, avg_rent_2bhk, commute_score, food_score,
  safety_score, walkability_score, metro_distance_km, office_density, avg_aqi,
  latitude, longitude
)
VALUES
  ('koro', 'blr', 'Koramangala', 28000, 42000, 72, 95, 88, 82, 2.4, 94, 68, 12.935200, 77.624500),
  ('indo', 'blr', 'Indiranagar', 32000, 48000, 68, 98, 92, 88, 0.8, 76, 72, 12.978400, 77.640800),
  ('whit', 'blr', 'Whitefield', 20000, 32000, 52, 74, 86, 58, 8.2, 98, 82, 12.969800, 77.749900),
  ('elte', 'blr', 'Electronic City', 16000, 24000, 48, 65, 82, 45, NULL, 96, 78, 12.848400, 77.660600)
ON CONFLICT (id) DO UPDATE SET
  city_id = EXCLUDED.city_id,
  name = EXCLUDED.name,
  avg_rent_1bhk = EXCLUDED.avg_rent_1bhk,
  avg_rent_2bhk = EXCLUDED.avg_rent_2bhk,
  commute_score = EXCLUDED.commute_score,
  food_score = EXCLUDED.food_score,
  safety_score = EXCLUDED.safety_score,
  walkability_score = EXCLUDED.walkability_score,
  metro_distance_km = EXCLUDED.metro_distance_km,
  office_density = EXCLUDED.office_density,
  avg_aqi = EXCLUDED.avg_aqi,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;

INSERT INTO public.app_content (key, description, value)
VALUES
  (
    'global-stats',
    'Global stats used across the home page hero and counters.',
    $$
    {
      "total_contributors": 12847,
      "total_data_points": 458320,
      "companies_tracked": 2340,
      "cities_covered": 47,
      "avg_salary_india": 18.4,
      "yoy_salary_growth": 11.2
    }
    $$::jsonb
  ),
  (
    'home',
    'Homepage marketing and analytics content previously stored in frontend mocks.',
    $$
    {
      "quick_searches": ["Bangalore", "SDE-2 at CRED", "Remote ML Engineer", "Senior PM Mumbai"],
      "featured_insight": {
        "title": "Remote-first companies are offering ₹8L more in equity grants this year.",
        "subtitle": "ML Engineers saw 28% YoY growth — highest of any tech role in FY2024",
        "href": "/roles/senior-software-engineer"
      },
      "salary_snapshot": {
        "headline_value": "₹42.5L",
        "headline_label": "Sr. Frontend (Remote)",
        "trend_label": "+12% YoY",
        "top_roles": [
          { "role": "ML Engineer", "salary": "₹48L" },
          { "role": "EM", "salary": "₹62L" },
          { "role": "Sr. PM", "salary": "₹38L" }
        ]
      },
      "salary_trend": [
        { "period": "Q1 2022", "value": 18.2 },
        { "period": "Q2 2022", "value": 19.4 },
        { "period": "Q3 2022", "value": 20.1 },
        { "period": "Q4 2022", "value": 21.8 },
        { "period": "Q1 2023", "value": 22.4 },
        { "period": "Q2 2023", "value": 24.2 },
        { "period": "Q3 2023", "value": 25.8 },
        { "period": "Q4 2023", "value": 27.1 },
        { "period": "Q1 2024", "value": 28.6 },
        { "period": "Q2 2024", "value": 30.2 },
        { "period": "Q3 2024", "value": 31.8 },
        { "period": "Q4 2024", "value": 33.4 }
      ],
      "trending_insights": [
        {
          "id": "1",
          "title": "ML Engineers saw 28% YoY salary growth",
          "subtitle": "Highest growth across all tech roles in FY2024",
          "category": "SALARY TREND",
          "value": "+28%",
          "accent": "primary"
        },
        {
          "id": "2",
          "title": "Remote-first companies offer ₹8L more on average",
          "subtitle": "Remote premium widening vs pre-pandemic levels",
          "category": "REMOTE WORK",
          "value": "22%",
          "accent": "secondary"
        },
        {
          "id": "3",
          "title": "CRED leads all companies in comp score",
          "subtitle": "OpenComp Score: 93/100 — industry best",
          "category": "TOP EMPLOYER",
          "value": "93",
          "accent": "tertiary"
        },
        {
          "id": "4",
          "title": "Bangalore still commands 24% city premium",
          "subtitle": "Over Hyderabad for equivalent roles",
          "category": "CITY INTEL",
          "value": "+24%",
          "accent": "primary"
        }
      ]
    }
    $$::jsonb
  ),
  (
    'company-page',
    'Shared company detail page datasets previously hardcoded in the frontend.',
    $$
    {
      "avg_salary_trend": 12.4,
      "salary_trend_badge": "+14.2% CAGR",
      "industry_avg_score": 74,
      "culture_rating": 4.3,
      "culture_rating_trend": 3.2,
      "salary_distribution_multipliers": {
        "p10": 0.55,
        "p25": 0.75,
        "p50": 0.95,
        "p75": 1.25,
        "p90": 1.55
      },
      "culture_radar": [
        { "subject": "WLB", "value": 4.2, "fullMark": 5 },
        { "subject": "Engineering", "value": 4.6, "fullMark": 5 },
        { "subject": "Management", "value": 3.9, "fullMark": 5 },
        { "subject": "Growth", "value": 4.4, "fullMark": 5 },
        { "subject": "Comp", "value": 4.7, "fullMark": 5 },
        { "subject": "Politics", "value": 3.4, "fullMark": 5 }
      ],
      "culture_ratings": [
        { "label": "Work-Life Balance", "value": 4.2 },
        { "label": "Manager Friendliness", "value": 3.9 },
        { "label": "Career Growth", "value": 4.4 },
        { "label": "Comp & Benefits", "value": 4.7 },
        { "label": "Politics / Toxicity", "value": 3.4 }
      ],
      "salary_trend": [
        { "period": "Q1 2022", "value": 18.2 },
        { "period": "Q2 2022", "value": 19.4 },
        { "period": "Q3 2022", "value": 20.1 },
        { "period": "Q4 2022", "value": 21.8 },
        { "period": "Q1 2023", "value": 22.4 },
        { "period": "Q2 2023", "value": 24.2 },
        { "period": "Q3 2023", "value": 25.8 },
        { "period": "Q4 2023", "value": 27.1 },
        { "period": "Q1 2024", "value": 28.6 },
        { "period": "Q2 2024", "value": 30.2 },
        { "period": "Q3 2024", "value": 31.8 },
        { "period": "Q4 2024", "value": 33.4 }
      ],
      "department_breakdown": [
        { "dept": "Engineering", "avg": 48.2, "count": 1240, "culture": 4.5 },
        { "dept": "Product", "avg": 42.6, "count": 380, "culture": 4.3 },
        { "dept": "Data / AI", "avg": 52.1, "count": 220, "culture": 4.6 },
        { "dept": "Design", "avg": 36.4, "count": 180, "culture": 4.2 },
        { "dept": "Sales", "avg": 28.8, "count": 440, "culture": 3.8 },
        { "dept": "Marketing", "avg": 24.6, "count": 320, "culture": 3.9 }
      ],
      "perks": [
        { "label": "Health Insurance", "detail": "Family covered, ₹5L sum assured", "icon_key": "shield" },
        { "label": "Work from Anywhere", "detail": "30 days/year WFA policy", "icon_key": "globe" },
        { "label": "Learning Budget", "detail": "₹1L/year for courses & conferences", "icon_key": "award" },
        { "label": "Meals & Snacks", "detail": "Free breakfast, lunch, dinner", "icon_key": "coffee" },
        { "label": "Flexible Hours", "detail": "Core hours 11am–4pm only", "icon_key": "clock" }
      ],
      "anonymous_reviews": [
        {
          "id": "1",
          "role": "Senior Software Engineer",
          "tenure": "2 years",
          "pros": "Excellent engineering culture, fast career growth, smart colleagues. The tech stack is modern and we have real autonomy.",
          "cons": "Compensation benchmarking lags behind competitors by ~20%. Equity refreshes are inconsistent.",
          "rating": 4.2,
          "period": "2024"
        },
        {
          "id": "2",
          "role": "Product Manager",
          "tenure": "1.5 years",
          "pros": "Great product ownership, very customer-focused. Cross-functional collaboration is real here.",
          "cons": "High pressure to deliver without always adequate resourcing. Work-life balance variable by team.",
          "rating": 3.8,
          "period": "2024"
        }
      ]
    }
    $$::jsonb
  ),
  (
    'city-page',
    'Shared city detail page datasets previously hardcoded in the frontend.',
    $$
    {
      "stat_trend": 11.2,
      "salary_trend_badge": "+11.2% YOY",
      "salary_trend": [
        { "period": "Q1 2022", "value": 18.2 },
        { "period": "Q2 2022", "value": 19.4 },
        { "period": "Q3 2022", "value": 20.1 },
        { "period": "Q4 2022", "value": 21.8 },
        { "period": "Q1 2023", "value": 22.4 },
        { "period": "Q2 2023", "value": 24.2 },
        { "period": "Q3 2023", "value": 25.8 },
        { "period": "Q4 2023", "value": 27.1 },
        { "period": "Q1 2024", "value": 28.6 },
        { "period": "Q2 2024", "value": 30.2 },
        { "period": "Q3 2024", "value": 31.8 },
        { "period": "Q4 2024", "value": 33.4 }
      ],
      "affordability_summary": {
        "avg_1bhk": "₹24k/mo",
        "avg_2bhk": "₹38k/mo",
        "rent_salary_pct": "22%"
      },
      "livability_scores": [
        { "label": "Air Quality Index", "value": 68, "max": 200, "unit": "AQI", "invert": true },
        { "label": "Walkability", "value": 82, "max": 100, "unit": "/100" },
        { "label": "Food & Dining", "value": 95, "max": 100, "unit": "/100" },
        { "label": "Safety Score", "value": 88, "max": 100, "unit": "/100" }
      ]
    }
    $$::jsonb
  ),
  (
    'role-page',
    'Shared role detail page datasets previously hardcoded in the frontend.',
    $$
    {
      "salary_trend_badge": "+14.2% CAGR",
      "salary_trend": [
        { "period": "Q1 2022", "value": 18.2 },
        { "period": "Q2 2022", "value": 19.4 },
        { "period": "Q3 2022", "value": 20.1 },
        { "period": "Q4 2022", "value": 21.8 },
        { "period": "Q1 2023", "value": 22.4 },
        { "period": "Q2 2023", "value": 24.2 },
        { "period": "Q3 2023", "value": 25.8 },
        { "period": "Q4 2023", "value": 27.1 },
        { "period": "Q1 2024", "value": 28.6 },
        { "period": "Q2 2024", "value": 30.2 },
        { "period": "Q3 2024", "value": 31.8 },
        { "period": "Q4 2024", "value": 33.4 }
      ],
      "salary_distribution_multipliers": {
        "p10": 0.75,
        "p90": 1.3
      },
      "city_comparison": {
        "baseline_salary": 22,
        "multiplier": 0.9
      },
      "experience_bands": [
        { "exp": "0-1 yr", "pct": 0.45 },
        { "exp": "1-3 yr", "pct": 0.65 },
        { "exp": "3-5 yr", "pct": 0.88 },
        { "exp": "5-8 yr", "pct": 1.1 },
        { "exp": "8+ yr", "pct": 1.45 }
      ]
    }
    $$::jsonb
  )
ON CONFLICT (key) DO UPDATE SET
  description = EXCLUDED.description,
  value = EXCLUDED.value,
  updated_at = NOW();

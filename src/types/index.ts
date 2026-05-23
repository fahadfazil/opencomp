// ============================================================
// Core Domain Types
// ============================================================

export interface User {
  id: string
  email: string
  display_name: string | null
  avatar_url: string | null
  provider: 'google' | 'github' | 'linkedin'
  created_at: string
  contributions_count: number
  is_verified: boolean
}

export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  industry: string
  company_type: 'startup' | 'mid_size' | 'enterprise' | 'mnc' | 'product' | 'service'
  headquarters: string
  founded_year: number | null
  employee_count: string
  description: string | null
  opencomp_score: number
  total_reviews: number
  avg_salary_lpa: number
  created_at: string
}

export interface City {
  id: string
  name: string
  slug: string
  state: string
  latitude: number
  longitude: number
  avg_salary_lpa: number
  tech_hub_rank: number | null
  cost_of_living_index: number
  metro_available: boolean
  total_entries: number
  created_at: string
}

export interface Role {
  id: string
  title: string
  slug: string
  category: string
  avg_salary_lpa: number
  median_salary_lpa: number
  p25_salary_lpa: number
  p75_salary_lpa: number
  total_entries: number
  yoy_growth_pct: number
  remote_premium_pct: number
  created_at: string
}

export interface SalaryEntry {
  id: string
  user_id: string | null
  company_id: string
  city_id: string
  role_id: string
  base_salary_lpa: number
  total_comp_lpa: number
  equity_lpa: number | null
  bonus_lpa: number | null
  experience_years: number
  work_mode: 'remote' | 'hybrid' | 'onsite'
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say'
  education: string | null
  submitted_at: string
  is_verified: boolean
}

export interface CultureReview {
  id: string
  user_id: string | null
  company_id: string
  role_id: string
  city_id: string
  overall_rating: number
  wlb_rating: number
  manager_rating: number
  culture_rating: number
  growth_rating: number
  compensation_rating: number
  politics_rating: number
  review_text: string | null
  pros: string | null
  cons: string | null
  submitted_at: string
}

export interface OfficeArea {
  id: string
  city_id: string
  name: string
  avg_rent_1bhk: number
  avg_rent_2bhk: number
  commute_score: number
  food_score: number
  safety_score: number
  walkability_score: number
  metro_distance_km: number | null
  office_density: number
  avg_aqi: number
  latitude: number
  longitude: number
}

export interface CompanyStats {
  company: Company
  salary_percentiles: {
    p10: number; p25: number; p50: number; p75: number; p90: number
  }
  culture_scores: {
    overall: number; wlb: number; manager: number
    culture: number; growth: number; compensation: number
  }
  department_breakdown: DepartmentStat[]
  salary_trend: TrendPoint[]
  top_roles: RoleStat[]
}

export interface DepartmentStat {
  department: string
  avg_salary_lpa: number
  count: number
  culture_score: number
}

export interface RoleStat {
  role: string
  avg_salary_lpa: number
  count: number
}

export interface TrendPoint {
  period: string
  value: number
}

export interface CityStats {
  city: City
  top_companies: Company[]
  salary_by_role: { role: string; avg_salary: number }[]
  areas: OfficeArea[]
  affordability: {
    avg_salary: number
    avg_rent_1bhk: number
    avg_rent_2bhk: number
    rent_to_salary_ratio: number
  }
}

// OpenComp Score types
export interface CompScore {
  score: number
  percentile: number
  positioning: 'below_market' | 'at_market' | 'above_market' | 'top_market'
  z_score: number
  comparison: {
    city_avg: number
    role_avg: number
    experience_avg: number
    your_salary: number
  }
}

// Contribution form types
export interface ContributionFormData {
  step: number
  company_id: string | null
  company_name: string
  role_id: string | null
  role_title: string
  city_id: string | null
  base_salary_lpa: number | null
  total_comp_lpa: number | null
  equity_lpa: number | null
  bonus_lpa: number | null
  experience_years: number | null
  work_mode: 'remote' | 'hybrid' | 'onsite' | null
  education: string | null
  gender: string | null
  wlb_rating: number | null
  manager_rating: number | null
  culture_rating: number | null
  growth_rating: number | null
  review_text: string | null
  pros: string | null
  cons: string | null
}

// Map types
export interface MapMarker {
  id: string
  name: string
  latitude: number
  longitude: number
  avg_salary_lpa: number
  total_entries: number
  type: 'city' | 'company' | 'area'
}

// Search types
export interface SearchResult {
  id: string
  type: 'company' | 'city' | 'role'
  name: string
  subtitle: string
  slug: string
}

// Filter types
export interface SalaryFilters {
  city?: string
  role?: string
  company?: string
  work_mode?: string
  experience_min?: number
  experience_max?: number
  salary_min?: number
  salary_max?: number
  company_type?: string
}

// Analytics types
export interface GlobalStats {
  total_contributors: number
  total_data_points: number
  companies_tracked: number
  cities_covered: number
  avg_salary_india: number
  yoy_salary_growth: number
}

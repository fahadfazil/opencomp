/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          display_name: string | null
          avatar_url: string | null
          provider: string
          created_at: string
          contributions_count: number
          is_verified: boolean
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website: string | null
          industry: string
          company_type: string
          headquarters: string
          founded_year: number | null
          employee_count: string
          description: string | null
          opencomp_score: number
          total_reviews: number
          avg_salary_lpa: number
          created_at: string
        }
      }
      salary_entries: {
        Row: {
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
          work_mode: string
          submitted_at: string
          is_verified: boolean
        }
      }
    }
  }
}
